import React from "react";
import { Handle, Position } from "reactflow";

export const MlpNode = ({ data }) => {
    return (
        <div className="px-2 py-2 w-[12em] shadow-md rounded-md bg-slate-900 border-2 border-stone-950">
            <span className='px-2 py-1 text-sm text-slate-300'>{data.label}</span>

            <Handle type="target" position={Position.Bottom} className="w-8 !bg-teal-500" />
            <Handle type="source" position={Position.Top} className="w-8 !bg-teal-500" />
        </div>
    )
};