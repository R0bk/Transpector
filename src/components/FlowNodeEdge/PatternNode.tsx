import React, { useRef, useEffect } from 'react'
import { Handle, Position } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useStore from '../store';

const selector = (state) => ({
    modelActivations: state.modelActivations,
});

import * as d3 from 'd3';
import * as tf from '@tensorflow/tfjs';

// Function to generate a color interpolator based on colourId
const getColorInterpolator = ( colourId: number, headCount: number=12 ) => {
    const hue = (colourId * (360/headCount)) % 360; // Generate a hue value based on colourId
    return d3.interpolateHsl(`hsla(${hue}, 1%, 0%, 0.0)`, `hsla(${hue}, 100%, 60%, 1.0)`); // Interpolator for the hue
};

const PatternPlot = ({ data, width, height, renderText=false, colourId=0, useCanvas=true }) => {
    const ref = useRef();

    useEffect(() => {
        const [B, T, C] = data.shape;
        
        const meanData = data.mean(0); 
        const minMax = [meanData.min().dataSync()[0], meanData.max().dataSync()[0]];
                
        const colorScale = d3
        .scaleSequential()
        .interpolator(getColorInterpolator(colourId)) // Use the generated color interpolator
        .domain(minMax);
        
        const x = d3.scaleBand().domain(d3.range(T)).range([0, width]);
        const y = d3.scaleBand().domain(d3.range(C)).range([0, height]);

        const syncData = meanData.arraySync()

        if (useCanvas) {
            const canvas = d3.select(ref.current);
            const ctx = canvas.node().getContext('2d');

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
                    ctx.fillRect(x(i), y(j), x.bandwidth(), y.bandwidth());
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
                        ctx.fillText(syncData[i][j].toFixed(2), x(i) + x.bandwidth() / 2, y(j) + y.bandwidth() / 2);
                    }
                }
            }
        } else {        
            const svg = d3.select(ref.current);
            
            const cell = svg.selectAll('g')
                .data(meanData.arraySync())
                .join('g')
                .attr('transform', (d, i) => `translate(${x(i)},0)`)
                .selectAll('rect')
                .data(d => d)
                .join('rect')
                .attr('y', (d, i) => y(i))
                .attr('width', x.bandwidth())
                .attr('height', y.bandwidth())
                .attr('fill', d => colorScale(d));

            if (renderText) {
                const fontSize = x.bandwidth() * 0.3; // Set the font size as a percentage of cell height

                const text = svg.selectAll('g')
                    .selectAll('text')
                    .data(d => d)
                    .join('text')
                    .attr('x', x.bandwidth() / 2)
                    .attr('y', (d, i) => y(i) + y.bandwidth() / 2)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'central')
                    .attr('fill', 'rgb(203 213 225)')
                    .attr('font-size', fontSize)
                    .text(d => d.toFixed(2));
            }
        }

    }, [data, width, height, renderText, colourId]);

    return useCanvas?   (<canvas ref={ref} width={width} height={height}></canvas>) :
                        (<svg ref={ref} width={width} height={height}></svg>)
};

const SummedPatternPlot = ({ data, width, height }) => {
    const ref = useRef();
    // const batchData = tf.tensor(dataArray);
  
    useEffect(() => {
      const svg = d3.select(ref.current);
  
      const [B, H, T, C] = data.shape;
      const meanData = data.mean(0);
    //   console.log(meanData);

      const x = d3.scaleBand().domain(d3.range(T)).range([0, width]);
      const y = d3.scaleBand().domain(d3.range(C)).range([0, height]);
  
      meanData.arraySync().forEach((headData, index) => {
        const colorScale = d3
          .scaleSequential()
          .interpolator(getColorInterpolator(index))
          .domain(d3.extent(headData.flat()));
  
        const cell = svg
          .selectAll(`g.chart${index}`)
          .data(headData)
          .join('g')
          .attr('class', `chart${index}`)
          .attr('transform', (d, i) => `translate(${x(i)},0)`)
          .selectAll('rect')
          .data((d) => d)
          .join('rect')
          .attr('y', (d, i) => y(i))
          .attr('width', x.bandwidth())
          .attr('height', y.bandwidth())
          .attr('fill', (d) => colorScale(d))
          .style('mix-blend-mode', 'normal'); // Use multiply blend mode to combine colors
  
      });
  
    }, [data, width, height]);
  
    return <svg ref={ref} width={width} height={height}></svg>;
};

export const PatternNode = ({ data }) => {
    const state = useStore(selector, shallow);
    const width = 96;
    const height = 96;

    const pattern = state.modelActivations?.[data.realationId]?.transpose([0,1,3,2]) ?? data.pattern;
    const psh = pattern.shape;
    // console.log(pattern)
    // console.log('pattern')
    // console.log(`Rendering pattern node ${data.realationId} ${data?.relationSliceId} ` )
    

    return (
        <div className="px-0 py-0 shadow-md rounded-md bg-slate-900 border-2 border-stone-950">
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
    // console.log(`Rendering result node ${data.realationId}`)
    // console.log(data.realationId)
    // console.log(state.modelActivations?.[data.realationId])

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