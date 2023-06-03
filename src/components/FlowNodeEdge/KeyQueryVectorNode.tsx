import { Handle, NodeResizer, Position } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useStore from '../store';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import React from 'react';


const selector = (state) => ({
  modelActivations: state.modelActivations,
  patchTargetNodes: state.patchTargetNodes,
  patching: state.patching,
});


// Function to generate a color interpolator based on colourId
const getColorInterpolator = ( colourId: number, headCount: number=12 ) => {
  const hue = (colourId * (360/headCount)) % 360; // Generate a hue value based on colourId
  return d3.interpolateHsl(`hsla(${hue}, 30%, 0%, 0.0)`, `hsla(${hue}, 30%, 60%, 1.0)`); // Interpolator for the hue
};


export const KQVPlot = ({ data, width, height, renderText=false }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!ref.current) return;

    const [B, T, H, C] = data.shape;
    
    const meandData = data.mean(0); 
    const minMax = [meandData.min().dataSync()[0], meandData.max().dataSync()[0]];
    
    const colorScales = Array.from(
      { length: H },
      (_, i) => d3.scaleSequential().interpolator(getColorInterpolator(i)).domain(minMax)
      );
      
      const x = d3.scaleBand().domain(d3.range(T).map(String)).range([0, width]).paddingInner(0.3);
      const y = d3.scaleBand().domain(d3.range(C*H).map(String)).range([0, height]);
      
      const syncData = meandData.arraySync();
      
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
        for (let k = 0; k < H; k++) {
          for (let j = 0; j < C; j++) {
            ctx.fillStyle = colorScales[k](syncData[i][k][j]);
            ctx.fillRect(x(String(i))!, y(String(j+k*C))!, x.bandwidth(), y.bandwidth());
          }
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
    }, [data, width, height]);
    
    return <canvas ref={ref} width={width} height={height}></canvas>;
  };
  
  
export const KeyQueryVectorNode = ({ id, data, selected }) => {
  const { modelActivations, patchTargetNodes, patching } = useStore(selector, shallow);
  const [initWidth, initHeight, headerHeight] = [96*2, 96, 24];
  const [width, setWidth] = useState(initWidth);
  const [height, setHeight] = useState(initHeight);


  const grayScale = patching && !patchTargetNodes.has(id);
  
  return (
    <div className={`px-0 py-0 shadow-md rounded-md bg-slate-900 border-2 border-stone-950 ${grayScale ? 'grayscale-[95%]' : ''}`} >
      <NodeResizer color='#ff0071' isVisible={selected} minWidth={initWidth} minHeight={initHeight+headerHeight} onResize={(_, { width, height }) => {setWidth(width); setHeight(height-headerHeight);}} />
      <span className='px-2 py-1 text-sm text-slate-300'>{data.label}</span>
      <div className="flex">
        <div className='flex flex-row w-48 h-24'>
          <KQVPlot data={modelActivations?.[data.realationId] ?? data.activations} width={width} height={height} />
        </div>
      </div>
      
      <Handle type="target" position={Position.Bottom} className="w-8 !bg-teal-500" />
      <Handle type="source" position={Position.Top} className="w-8 !bg-teal-500" />
    </div>
  )
};