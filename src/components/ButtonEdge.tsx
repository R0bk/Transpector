import React from 'react';
import { getBezierPath } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useStore from './store';

const selector = (state) => ({
    inferenceModel: state.inferenceModel,
});

const foreignObjectSize = 48;

const onEdgeClick = (evt, id, state) => {
  state.inferenceModel();
  evt.stopPropagation();
  // alert(`remove ${id}`);
};

export function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const state = useStore(selector);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className="edgebutton-foreignobject w-12 h-12 flex flex-center"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className='m-1 h-10 w-10 justify-center items-center flex'>
          <button className="edgebutton rounded-full p-2 justify-center bg-slate-800 items-center ring-1 ring-slate-200/20 shadow-lg w-10 h-10" onClick={(event) => onEdgeClick(event, id, state)}>
            <svg className="w-6 h-6 text-green-500 rotate-180" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </button>
        </div>
      </foreignObject>
    </>
  );
}
