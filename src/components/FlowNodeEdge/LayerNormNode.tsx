import React from "react";
import { Handle, Position } from "reactflow";
import { shallow } from 'zustand/shallow';
import useStore from '../store';

const selector = (state) => ({
  modelActivations: state.modelActivations,
  patchTargetNodes: state.patchTargetNodes,
  patching: state.patching,
});

export const LayerNormNode = ({ id, data }) => {
    const { modelActivations, patchTargetNodes, patching } = useStore(selector, shallow);
    const grayScale = patching && !patchTargetNodes.has(id);

    return (
        <div className={`px-2 py-2 w-[12em] shadow-md rounded-md bg-slate-900 border-2 border-stone-950 ${grayScale ? 'grayscale-[95%]' : ''}`} >
            <span className='px-2 py-1 text-sm text-slate-300'>{data.label}</span>

            <Handle type="target" position={Position.Bottom} className="w-8 !bg-teal-500" />
            <Handle type="source" position={Position.Top} className="w-8 !bg-teal-500" />
        </div>
    )
};