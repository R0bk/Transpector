import { Handle, Position } from 'reactflow';
import useStore from '../store';
import React, { useState, useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import 'd3-transition';
import { shallow } from 'zustand/shallow';


const outputSelector = (state) => ({
    modelOutputlogits: state.modelOutputlogits,
    modelOutputTokens: state.modelOutputTokens,
    modelOutputSubWords: state.modelOutputSubWords,
    modelOutputLoss: state.modelOutputLoss,
    inferenceSubWords: state.inferenceSubWords,
});


export const OutputNode = ({ data }) => {
    const { modelOutputSubWords, modelOutputLoss, inferenceSubWords } = useStore(outputSelector, shallow);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const svgRef = useRef(null);

    const width = 96*6;
    const height = 96*1;
    const padding = 10; // Padding for the first bar

    useEffect(() => {
        if (!svgRef.current) return;

        // Reset SVG
        select(svgRef.current).selectAll("*").remove();

        // SVG size
        const barPadding = 8; // Adjust to add padding between bars

        // Create x and y scales
        const xScale = scaleLinear().domain([0, modelOutputLoss.length]).range([padding, width-padding]);
        const yScale = scaleLinear().domain([0, Math.max(...modelOutputLoss)]).range([height, 0]);

        // Create bars
        const svg = select(svgRef.current)
            .attr("width", width)
            .attr("height", height);


        const bars = svg.selectAll("rect")
            .data(modelOutputLoss)
            .join("rect");

        bars.attr("x", (d, i) => xScale(i))
            .attr("y", (d) => yScale(d as number))
            .attr("width", width / modelOutputLoss.length - barPadding)
            .attr("height", (d) => height - yScale(d as number))
            .attr("fill", (d, i) => (i === hoveredIndex ? "#d73027" : "rgba(214, 39, 40, 0.2)"));

        // Add mouseover event
        bars.on("mouseover", (_, i) => setHoveredIndex(i as number))
            .on("mouseout", () => setHoveredIndex(null))
            .append("title")
            .text((d) => `Loss: ${d}`);

        const lines = svg.selectAll("line")
            .data(modelOutputLoss)
            .join("line");

        lines.attr("x1", (d, i) => xScale(i))
            .attr("y1", (d) => yScale(d as number))
            .attr("x2", (d, i) => xScale(i) + width / modelOutputLoss.length - barPadding)
            .attr("y2", (d) => yScale(d as number))
            .attr("stroke", (d, i) => (i === hoveredIndex ? "#d73027" : "rgba(214, 39, 40, 0.2)"))
            .attr("stroke-width", 2);

    }, [modelOutputLoss, hoveredIndex]);

    useEffect(() => {
        if (svgRef.current) {
            const svg = select(svgRef.current);
            svg.selectAll("rect")
                .attr("fill", (d, i) => (i === hoveredIndex ? "#d73027" : "rgba(214, 39, 40, 0.2)"));
            svg.selectAll("line")
                .attr("stroke", (d, i) => (i === hoveredIndex ? "#d73027" : "rgba(214, 39, 40, 0.2)"));
        }
    }, [hoveredIndex]);


    return (
        <div className="px-6 py-4 shadow-md rounded-md bg-slate-900 border-2 border-stone-950">
            <div className='py-2'><svg ref={svgRef} /></div>
            <div className="flex flex-wrap w-[576px] py-2">
                {modelOutputSubWords.length > 0 && modelOutputSubWords[0].map((ele, index) => (
                    <div key={index} className="px-1">
                        <span
                            id={`word-${index}`}
                            className={`text-xs ${hoveredIndex === index ? 'text-red-500' : 'text-slate-600'}`}
                        >
                            {index+1 < inferenceSubWords[0].length && inferenceSubWords[0][index+1]}
                        </span>
                        <br/>
                        <span
                            className={`text-sm ${hoveredIndex === index ? 'text-red-500' : 'text-slate-300'}`}
                            onMouseOver={() => setHoveredIndex(index)}
                            onMouseOut={() => setHoveredIndex(null)}
                        >
                            {ele}
                        </span>
                    </div>
                ))}
            </div>

            <Handle type="target" position={Position.Bottom} className="w-16 !bg-teal-500" />
            <Handle type="source" position={Position.Top} className="w-16 !bg-teal-500" />
        </div>
    )
};

