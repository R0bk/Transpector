import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Handle, Position, NodeToolbar } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { shallow } from 'zustand/shallow';
import useStore from '../store';

const selector = (state) => ({
  modelActivations: state.modelActivations,
  modelAblations: state.modelAblations,
  addAblations: state.addAblations,
  rmAblations: state.rmAblations,
});

import * as d3 from 'd3';
import * as tf from '@tensorflow/tfjs';
import { GitMergeIcon, GitPullRequestClosedIcon, PinIcon } from '@primer/octicons-react';

// Function to generate a color interpolator based on colourId
const getColorInterpolator = ( colourId: number, headCount: number=12 ) => {
  const hue = (colourId * (360/headCount)) % 360; // Generate a hue value based on colourId
  return d3.interpolateHsl(`hsla(${hue}, 1%, 0%, 0.0)`, `hsla(${hue}, 100%, 60%, 1.0)`); // Interpolator for the hue
};

const usePatternPlotData = (preSliceData: tf.Tensor, slice: number | undefined) => {
  const dataIdRef = useRef(preSliceData.id); // Store Tensor id to check if we need to recalculate

  const dS = preSliceData.shape as [number, number, number, number]; // Standard multi head attn, (Batch, Head, Seq, Seq)
  
  const [data, setData] = useState(() => slice !== undefined
    ? tf.squeeze(tf.slice(preSliceData.transpose([0,1,3,2]), [0,slice,0,0], [dS[0], 1, dS[3], dS[2]]), [1])
    : preSliceData.transpose([0,1,3,2])
  )  // Transpose to get causal looking correct and slice to head of interest if head selected
  
  const [meanData, setMeanData] = useState(() => data.mean(0)); // Merge across batch
  const [minMax, setMinMax] = useState(() => [meanData.min().dataSync()[0], meanData.max().dataSync()[0]]); // For scaling colours
  const [syncData, setSyncData] = useState(() => meanData.arraySync()); // To JS

  
  useEffect(() => {
    if (dataIdRef.current !== preSliceData.id) {
      console.log('data id missmatch', dataIdRef.current, preSliceData.id)
      dataIdRef.current = preSliceData.id;

      const dS = preSliceData.shape as [number, number, number, number];
      const localData = slice !== undefined
        ? tf.squeeze(tf.slice(preSliceData.transpose([0,1,3,2]), [0,slice,0,0], [dS[0], 1, dS[3], dS[2]]), [1])
        : preSliceData.transpose([0,1,3,2])
      const localMeanData = localData.mean(0);

      setData(localData);
      setMeanData(localMeanData);
      setMinMax([localMeanData.min().dataSync()[0], localMeanData.max().dataSync()[0]])
      setSyncData(localMeanData.arraySync());
    }
  }, [preSliceData, slice]);
  
  return { data, meanData, minMax, syncData };
};


const PatternPlot = ({ patternData, width, height, renderText=false, colourId=0 }) => {
  const ref = useRef(null);

  const { data, minMax, syncData } = patternData;
  const [B, T, C] = data.shape;
    
  useEffect(() => {
    if (!ref.current) return;
    
    const colorScale = d3
    .scaleSequential()
    .interpolator(getColorInterpolator(colourId)) // Use the generated color interpolator
    .domain(minMax);
    
    const x = d3.scaleBand().domain(d3.range(T).map(String)).range([0, width]);
    const y = d3.scaleBand().domain(d3.range(C).map(String)).range([0, height]);
        
    
    const canvas = d3.select(ref.current);
    const ctx = (canvas.node() as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;
    
    // Set the canvas dimensions for high-resolution rendering
    const scaleFactor = 2;
    canvas.attr('width', width * scaleFactor);
    canvas.attr('height', height * scaleFactor);
    
    // Apply CSS to maintain the same display size
    canvas.style('width', `${width}px`);
    canvas.style('height', `${height}px`);
    
    // Scale the context
    ctx.scale(scaleFactor, scaleFactor);
    
    // Clear the canvas before drawing
    ctx.clearRect(0, 0, width, height);
    
    // Draw cells
    for (let i = 0; i < T; i++) {
      for (let j = 0; j < C; j++) {
        ctx.fillStyle = colorScale(syncData[i][j]);
        ctx.fillRect(x(String(i))!, y(String(j))!, x.bandwidth(), y.bandwidth());
      }
    }
    
    // Draw text
    if (renderText) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgb(203 213 225)';
      ctx.font = `${x.bandwidth() * 0.3}px sans-serif`;
      
      for (let i = 0; i < T; i++) {
        for (let j = 0; j < C; j++) {
          ctx.fillText(syncData[i][j].toFixed(2), x(String(i))! + x.bandwidth() / 2, y(String(j))! + y.bandwidth() / 2);
        }
      }
    }
    
  }, [C, T, minMax, syncData, width, height, renderText, colourId]);
  
  return (<canvas ref={ref} width={width} height={height}></canvas>)
};

const SummedPatternPlot = ({ patternData, width, height, useCanvas=true }) => {
  const ref = useRef(null);

  const { data, syncData } = patternData;
  const [B, H, T, C] = data.shape;

  
  useEffect(() => {
    const x = d3.scaleBand().domain(d3.range(T).map(String)).range([0, width]);
    const y = d3.scaleBand().domain(d3.range(C).map(String)).range([0, height]);
    
    if (!ref.current) return;
    
    const canvas = d3.select(ref.current);
    const ctx = (canvas.node() as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;
    
    const scaleFactor = 2;
    canvas.attr('width', width * scaleFactor);
    canvas.attr('height', height * scaleFactor);
    canvas.style('width', `${width}px`);
    canvas.style('height', `${height}px`);
    ctx.scale(scaleFactor, scaleFactor);
    
    syncData.forEach((headData: [number, number], index: number) => {
      const colorScale = d3
      .scaleSequential()
      .interpolator(getColorInterpolator(index))
      .domain(d3.extent(headData.flat()) as [number, number]);
      
      for (let i = 0; i < T; i++) {
        for (let j = 0; j < C; j++) {
          ctx.fillStyle = colorScale(headData[i][j]);
          ctx.fillRect(x(String(i))!, y(String(j))!, x.bandwidth(), y.bandwidth());
        }
      }
    });
    
  }, [syncData, C, T, width, height, useCanvas]);
  
  return useCanvas ? <canvas ref={ref} width={width} height={height}></canvas> : <svg ref={ref} width={width} height={height}></svg>;
};

const getAllOtherSlices = (sliceNo, nHeads) => Array.from({ length: nHeads }, (_, j) => [[0,-1], [j, j+1], [0,-1], [0,-1]] ).filter(n => n[1][0] !== sliceNo);


export const PatternNode = ({ data, selected }) => {
  const { modelActivations, modelAblations, rmAblations, addAblations } = useStore(selector, shallow);
  const dataSlice = [[0,-1], [data?.relationSliceId, data?.relationSliceId+1], [0,-1], [0,-1]];
  const isAblated = modelAblations?.[data.realationId]?.[dataSlice.toString()]?.slice ?? false
  const ablationType = modelAblations?.[data.realationId]?.[dataSlice.toString()]?.ablationType
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [initWidth, initHeight] = [96, 96];
  const [width, setWidth] = useState(initWidth);
  const [height, setHeight] = useState(initHeight);

  const pattern = usePatternPlotData(modelActivations?.[data.realationId] ?? data.pattern, data?.relationSliceId)
  
  
  return (
    <div 
      className={`px-0 py-0 shadow-md rounded-md bg-slate-900 border-2 border-stone-950 ${isAblated ? ablationType === 'freeze' ? 'grayscale-[25%]' : 'grayscale-[95%]' : ''}`}
      onMouseEnter={() => setToolbarVisible(true)}
      onMouseLeave={() => setToolbarVisible(false)}
    >
      <NodeResizer color='#ff0071' isVisible={selected} minWidth={initWidth} minHeight={initHeight} onResize={(_, { width, height }) => {setWidth(width); setHeight(height-24);}} />
      <NodeToolbar offset={0} isVisible={toolbarVisible} position={Position.Right}>
      <div className='flex flex-col'>
        <button
          className="bg-slate-800 hover:bg-red-400 text-slate-300 py-2 px-2 rounded-md my-1"
          onClick={isAblated
            ? () => rmAblations(data.realationId, [dataSlice])
            : () => addAblations(data.realationId, [dataSlice], 'zero')
          }
        >
          <div title='Ablate Head'><GitPullRequestClosedIcon fill={ablationType === 'zero' ? "#888": "#fff"} size={16} /></div>
        </button>
        <button
          className="bg-slate-800 hover:bg-red-400 text-slate-300 py-2 px-2 rounded-md my-1"
          onClick={isAblated
            ? () => rmAblations(data.realationId, getAllOtherSlices(data?.relationSliceId, data.pattern.shape[1])) 
            : () => addAblations(data.realationId, getAllOtherSlices(data?.relationSliceId, data.pattern.shape[1]), 'zero')
          }
          >
          <div title='Isolate Head'><GitMergeIcon size={16} /></div>
        </button>
        <button
          className="bg-slate-800 hover:bg-red-400 text-slate-300 py-2 px-2 rounded-md my-1"
          onClick={isAblated
            ? () => rmAblations(data.realationId, [dataSlice])
            : () => addAblations(data.realationId, [dataSlice], 'freeze')
          }
        >
          <div title='Freeze Head'><PinIcon size={16} fill={ablationType === 'freeze' ? "#888": "#fff"} /></div>
        </button>

      </div>
      </NodeToolbar>
      <span className='px-2 py-1 text-sm text-slate-300'>{ablationType === 'freeze' && (<PinIcon size={12} />)} {data.label}</span>
      <div className="flex">
        <div className={`flex flex-row w-[${width}px] h-[${height}px]`}>
          {'relationSliceId' in data
            ? (<PatternPlot patternData={pattern} width={width} height={height} colourId={data.colourId} />)
            : (<SummedPatternPlot patternData={pattern} width={width} height={height} />)
          }
        </div>
      </div>
    
    <Handle type="target" position={Position.Bottom} className="w-8 !bg-teal-500" />
    <Handle type="source" position={Position.Top} className="w-8 !bg-teal-500" />
  </div>
  )
};


export const ResultNode = ({ data }) => {
  const { modelActivations } = useStore(selector, shallow);
  const width = 96;
  const height = 96;

  const pattern = usePatternPlotData(modelActivations?.[data.realationId] ?? data.result, undefined)
  
  return (
    <div className="px-0 py-0 shadow-md rounded-md bg-slate-900 border-2 border-stone-950">
      <span className='px-2 py-1 text-sm text-slate-300'>{data.label}</span>
      <div className="flex">
        <div className='flex flex-row w-24 h-24'>
          <SummedPatternPlot patternData={pattern} width={width} height={height} />
        </div>
      </div>
      
      <Handle type="target" position={Position.Bottom} className="w-8 !bg-teal-500" />
      <Handle type="source" position={Position.Top} className="w-8 !bg-teal-500" />
    </div>
  )
};
  