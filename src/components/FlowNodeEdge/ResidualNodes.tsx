import React, { useRef, useEffect } from 'react'
import { Handle, Position } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useStore from '../store';
import * as d3 from 'd3';


const selector = (state) => ({
    modelActivations: state.modelActivations,
});


export const ResidualPlot = ({ data, width, height, renderText=false, useCanvas=true }) => {
    const ref = useRef(null);
    const marginBottom = 5;

    useEffect(() => {
        if (!ref.current) return;

        const [B, T, C] = data.shape;

        const summedData = data.mean(0); 
        const minMax = [summedData.min().dataSync()[0], summedData.max().dataSync()[0]];

        const colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateViridis)
            .domain(minMax);

        const x = d3.scaleBand().domain(d3.range(T).map(String)).range([0, width]).paddingInner(0.3);
        const y = d3.scaleBand().domain(d3.range(C).map(String)).range([0, height - marginBottom]);

        const syncData = summedData.arraySync();

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
    }, [data, width, height]);

    return useCanvas?   (<canvas ref={ref} width={width} height={height}></canvas>) :
                        (<svg ref={ref} width={width} height={height}></svg>)
};

export const EmbedNode = ({ data }) => {
    const state = useStore(selector, shallow);
    const width = 96*3;
    const height = 96*3;

    return (
        <div className="px-0 py-0 shadow-md rounded-md bg-slate-900 border-2 border-stone-950">
            <span className='px-2 py-1 text-sm text-slate-300'>{data.label}</span>
            <div className="flex">
                <div className='flex flex-row w-72 h-72'>
                    <ResidualPlot data={state.modelActivations?.[data.realationId] ?? data.embed} width={width} height={height} />
                </div>
            </div>

            <Handle type="target" position={Position.Bottom} className="w-8 !bg-teal-500" />
            <Handle type="source" position={Position.Top} className="w-8 !bg-teal-500" />
        </div>
    )
};

export const ResidualNode = ({ data }) => {
    const state = useStore(selector, shallow);
    const width = 96*1.5;
    const height = 96*1.5;

    return (
        <div className="px-0 py-0 shadow-md rounded-md bg-slate-900 border-2 border-stone-950">
            <span className='px-2 py-1 text-sm text-slate-300'>Attention Residual</span>
            <div className="flex">
                <div className='flex flex-row '>
                    <ResidualPlot data={state.modelActivations?.[data.realationId] ?? data.residual} width={width} height={height} />
                </div>
            </div>

            <Handle type="target" position={Position.Bottom} className="w-8 !bg-teal-500" />
            <Handle type="source" position={Position.Top} className="w-8 !bg-teal-500" />
        </div>
    )
};