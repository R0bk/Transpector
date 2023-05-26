import React, { useRef, useEffect, useState } from 'react'
import { Handle, Position, NodeToolbar } from 'reactflow';
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
import { GitMergeIcon, GitPullRequestClosedIcon } from '@primer/octicons-react';

// Function to generate a color interpolator based on colourId
const getColorInterpolator = ( colourId: number, headCount: number=12 ) => {
    const hue = (colourId * (360/headCount)) % 360; // Generate a hue value based on colourId
    return d3.interpolateHsl(`hsla(${hue}, 1%, 0%, 0.0)`, `hsla(${hue}, 100%, 60%, 1.0)`); // Interpolator for the hue
};

const PatternPlot = ({ data, width, height, renderText=false, colourId=0, useCanvas=true }) => {
    const ref = useRef(null);

    useEffect(() => {
        const [B, T, C] = data.shape;
        
        const meanData = data.mean(0); 
        const minMax = [meanData.min().dataSync()[0], meanData.max().dataSync()[0]];
                
        const colorScale = d3
        .scaleSequential()
        .interpolator(getColorInterpolator(colourId)) // Use the generated color interpolator
        .domain(minMax);
        
        const x = d3.scaleBand().domain(d3.range(T).map(String)).range([0, width]);
        const y = d3.scaleBand().domain(d3.range(C).map(String)).range([0, height]);

        const syncData = meanData.arraySync()

        if (!ref.current) return;

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

    }, [data, width, height, renderText, colourId]);

    return useCanvas?   (<canvas ref={ref} width={width} height={height}></canvas>) :
                        (<svg ref={ref} width={width} height={height}></svg>)
};

const SummedPatternPlot = ({ data, width, height, useCanvas=true }) => {
    const ref = useRef(null);
  
    useEffect(() => {
        const [B, H, T, C] = data.shape;
        const meanData = data.mean(0);
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

        meanData.arraySync().forEach((headData: [number, number], index: number) => {
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

    }, [data, width, height, useCanvas]);

    return useCanvas ? <canvas ref={ref} width={width} height={height}></canvas> : <svg ref={ref} width={width} height={height}></svg>;
};

const getAllOtherSlices = (sliceNo, nHeads) => Array.from({ length: nHeads }, (_, j) => [[0,-1], [j, j+1], [0,-1], [0,-1]] ).filter(n => n[1][0] !== sliceNo);


export const PatternNode = ({ data }) => {
    const { modelActivations, modelAblations, rmAblations, addAblations } = useStore(selector, shallow);
    // console.log(modelAblations)
    const dataSlice = [[0,-1], [data?.relationSliceId, data?.relationSliceId+1], [0,-1], [0,-1]];
    const isAblated = modelAblations?.[data.realationId]?.[dataSlice.toString()]?.slice ?? false
    const [toolbarVisible, setToolbarVisible] = useState(false);
    const width = 96;
    const height = 96;

    const pattern = modelActivations?.[data.realationId]?.transpose([0,1,3,2]) ?? data.pattern;
    const psh = pattern.shape;
    

    return (
        <div 
            className={`px-0 py-0 shadow-md rounded-md bg-slate-900 border-2 border-stone-950 ${isAblated ? 'grayscale-[95%]' : ''}`}
            onMouseEnter={() => setToolbarVisible(true)}
            onMouseLeave={() => setToolbarVisible(false)}
        >
            <NodeToolbar offset={0} isVisible={toolbarVisible} position={Position.Right}>
                <div className='flex flex-col'>
                    <button
                        className="bg-slate-800 hover:bg-red-400 text-slate-300 py-2 px-2 rounded-md my-1"
                        onClick={isAblated
                            ? () => rmAblations(data.realationId, [dataSlice])
                            : () => addAblations(data.realationId, [dataSlice], 'zero')
                        }
                    >
                        <div title='Ablate Head'><GitPullRequestClosedIcon fill={isAblated ? "#888": "#fff"} size={16} /></div>
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
                </div>
            </NodeToolbar>
            <span className='px-2 py-1 text-sm text-slate-300'>{data.label}</span>
            <div className="flex">
                <div className='flex flex-row w-24 h-24'>
                    {'relationSliceId' in data
                        ? (<PatternPlot data={tf.squeeze(tf.slice(pattern, [0,data.relationSliceId,0,0], [psh[0], 1, psh[2], psh[3]]), [1])} width={width} height={height} colourId={data.colourId} />)
                        : (<SummedPatternPlot data={pattern} width={width} height={height} />)
                    }
                </div>
            </div>

            <Handle type="target" position={Position.Bottom} className="w-8 !bg-teal-500" />
            <Handle type="source" position={Position.Top} className="w-8 !bg-teal-500" />
        </div>
    )
};


export const ResultNode = ({ data }) => {
    const state = useStore(selector, shallow);
    const width = 96;
    const height = 96;

    return (
        <div className="px-0 py-0 shadow-md rounded-md bg-slate-900 border-2 border-stone-950">
            <span className='px-2 py-1 text-sm text-slate-300'>{data.label}</span>
            <div className="flex">
                <div className='flex flex-row w-24 h-24'>
                    <SummedPatternPlot data={state.modelActivations?.[data.realationId]?.transpose([0,2,1,3]) ?? data.result} width={width} height={height} />
                </div>
            </div>

            <Handle type="target" position={Position.Bottom} className="w-8 !bg-teal-500" />
            <Handle type="source" position={Position.Top} className="w-8 !bg-teal-500" />
        </div>
    )
};
