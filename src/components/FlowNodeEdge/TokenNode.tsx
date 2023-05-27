import { Handle, Position } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useStore from '../store';
import { useState } from 'react';
import * as d3 from 'd3';
import * as tf from '@tensorflow/tfjs';
import React from 'react';


const selector = (state) => ({
  updatemodelInputTokens: state.updatemodelInputTokens,
  modelInputTokens: state.modelInputTokens,
  modelInputSubWords: state.modelInputSubWords,
  modelInputText: state.modelInputText,
  modelActivations: state.modelActivations,
  inferencePrompt: state.inferencePrompt,
});


export const TokenNode = ({ data }) => {
  const state = useStore(selector, shallow);
  
  return (
    <div className="px-6 py-4 shadow-md rounded-md bg-slate-900 border-2 border-stone-950">
    <div className="flex">
    <div className='flex flex-row w-[48em]'>
    <span className="block text-xs text-slate-400 py-2">[{
      state.modelInputTokens[0].map((ele, index) => (<span key={index} className='px-px'>{String(ele)}, </span>))
    }]</span>
    </div>
    </div>
    
    <Handle type="target" position={Position.Bottom} className="w-16 !bg-teal-500" />
    <Handle type="source" position={Position.Top} className="w-16 !bg-teal-500" />
    </div>
  )
};


const getColorInterpolator = ( colourId: number, headCount: number=12 ) => {
  const hue = (colourId * (360/headCount)) % 360; // Generate a hue value based on colourId
  return d3.interpolateHsl(`hsla(${hue}, 1%, 0%, 0.0)`, `hsla(${hue}, 100%, 60%, 1.0)`); // Interpolator for the hue
};
  
const getColorScaleArray = (noColors: number, minMax) => {
  return Array.from(
    { length: noColors },
    (_, i) => d3.scaleSequential().interpolator(getColorInterpolator(i)).domain(minMax)
  )
};

function blendColorsWithOpacity(colors) {
  let [r, g, b, a] = [0, 0, 0, 0];
  
  colors.map(parseRGBorRGBA).forEach(({r: r1, g: g1, b: b1, a: a1}) => {
    const a2 = 1 - a1;
    r = r1 * a1 + r * a2;
    g = g1 * a1 + g * a2;
    b = b1 * a1 + b * a2;
    a = a1 + a2 * (1 - a1);
  });
  
  return [r, g, b, a].map((v) => Math.round(v));
}

function rgbToCss([r, g, b, a]) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function parseRGBorRGBA(cssColor) {
  const regex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.e-]+))?\)/;
  const result = regex.exec(cssColor);
  if (!result) return;
  
  const [, r, g, b, a] = result;
  return {
    r: parseInt(r),
    g: parseInt(g),
    b: parseInt(b),
    a: a ? parseFloat(a) : 1,
  };
}

const getBackgroundGetter = ( data, head, hoveredIndex, direction ) => {
  if (!data) 
  return (..._) => '';
  
  const pattern = data?.transpose([0,1,3,2]);
  
  const [B, H, T1, T2] = pattern.shape;
  const meandData = pattern.mean(0); 
    
  
  const sliceData = head === -1
  ? meandData
  : tf.squeeze(tf.slice(meandData, [head,0,0], [1, T1, T2]), [0])
  
  const minMax = [sliceData.min().dataSync()[0], sliceData.max().dataSync()[0]];
  
  const syncData = meandData.arraySync();
  const syncDataT = meandData.transpose([0,2,1]).arraySync();
  
  const colorScales = getColorScaleArray(H, minMax);
  
  return (wordIndex: number, headIndex: number) => {
    const dataSource = direction === 'Key → Query' ? syncData : syncDataT;
    const finalIndex = hoveredIndex !== null ? hoveredIndex : wordIndex; 
    
    const colorList = headIndex === -1
    ? colorScales.map((cScale, i) => cScale(dataSource[i][wordIndex][finalIndex]))
    : [colorScales[headIndex](dataSource[headIndex][wordIndex][finalIndex])]
    
    return rgbToCss(blendColorsWithOpacity(colorList) as [number, number, number, number])
  };
}

export const SubWordDisplay = ({ layer=1, head=-1, direction='Key → Query', formatting='text' }) => {
  const state = useStore(selector, shallow);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const attentionRelationId = `blocks.${layer}.attn.hook_pattern`
  
  
  const seqLength = state.modelActivations?.[attentionRelationId]?.shape?.[2];
  
  const getBackgroundColor = getBackgroundGetter(
    state.modelActivations?.[attentionRelationId], head, hoveredIndex, direction
  )
    
  return (
    <div className="flex">
      <div className='flex flex-row w-[48em]'>
        <span className="block text-xs text-slate-400 py-2">{formatting === 'array' && '['}{
          state.modelInputSubWords[0].map((ele, index) => (
            <span
            key={index}
            id={`word-${index}`}
            className="px-px"
            style={{
              backgroundColor:
              state.inferencePrompt[0] === state.modelInputText[0] &&
              seqLength === state.modelInputSubWords[0].length
              ? getBackgroundColor(index, head)
              : '',
            }}
            onMouseOver={() => setHoveredIndex(index)}
            onMouseOut={() => setHoveredIndex(null)}
            >
            {ele}{formatting === 'array' && ','}
            </span>
            ))
          }{formatting === 'array' && ']'}
        </span>
      </div>
    </div>
  )
};
      
export const SubWordsNode = ({ data }) => {
  const direction = 'Key → Query';
  const layer = 1;
  const head = -1;
  
  return (
    <div className="px-6 py-4 shadow-md rounded-md bg-slate-900 border-2 border-stone-950">
      <SubWordDisplay layer={layer} head={head} direction={direction} formatting={'array'}/>
      
      <Handle type="target" position={Position.Bottom} className="w-16 !bg-teal-500" />
      <Handle type="source" position={Position.Top} className="w-16 !bg-teal-500" />
    </div>
  )
}