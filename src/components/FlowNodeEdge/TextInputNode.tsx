import { Handle, Position } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useStore from '../store';
import { useVisibleNodes } from './utils';
import { SubWordDisplay } from './TokenNode'
import { useState } from 'react';
import React from 'react';


const selector = (state) => ({
  modelInputText: state.modelInputText,
  updateModelInputText: state.updateModelInputText,
  inferencing: state.inferencing,
  inferenceModel: state.inferenceModel,

});


export const TextInputNode = () => {
  const state = useStore(selector, shallow);

  return (
    <div className="px-6 py-4 shadow-md rounded-md bg-slate-900 border-2 border-stone-950">
      <div className="flex">
        <div className='flex flex-row'>
          <label className="w-[48em] block">
            <input
              className="text-slate-300 bg-slate-900 shadow-sm border-0 focus:outline-none focus:border-0 placeholder-slate-400 text-sm py-2 px-3 w-full "
              placeholder="Example input..."
              value={state.modelInputText}
              onChange={(e) => state.updateModelInputText(e.target.value)}
            />
          </label>
        </div>
      </div>

      <Handle type="source" position={Position.Top} className="w-16 !bg-teal-500" />
    </div>
  )
}



export const TextInputPopup = ({ layerCount=5, headCount=5 }) => {
  const state = useStore(selector, shallow);
  const [layer, setLayer] = useState("2");
  const [head, setHead] = useState("2");
  const [direction, setDirection] = useState('Key → Query');


  const layerOptions = [...Array(layerCount).keys()].map((_, i) =>
    <option key={i} value={i}>{`Layer ${i}`}</option>
  );
  const headOptions = [{ value: "-1", text: "All" },
  ...[...Array(headCount).keys()].map((_, i) => ({ value: i, text: `Head ${i}` }))].map(({ value, text }) =>
    <option key={value} value={value}>{text}</option>
  );

  //›

  const toggleDirection = () => {
    setDirection(prevDirection =>
      prevDirection === 'Key → Query' ? 'Key ← Query' : 'Key → Query'
    );
  }

  // Easy to optimise this in the future
  // const nodes = useVisibleNodes(true);
  // const result = nodes.some(n => n?.id === 'text');

  // console.log(nodes)
  return (
    <div className='absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-slate-400'>
      <div className='flex flex-row'>
        <div className="flex flex-col px-2 mx-4 py-4 w-[8em] shadow-md rounded-md bg-slate-900 border-2 border-stone-950">
          <div className='flex flex-row justify-center  px-0 py-1 h-1/3'>
            <select
              className='text-xs bg-slate-900 border-0 focus:ring-0 focus:outline-none focus:border-0 '
              value={layer}
              onChange={(e) => { setLayer(e.target.value) }}
            >
              {layerOptions}
            </select>
          </div>
          <div className='flex flex-row justify-center px-0 py-1 h-1/3'>
            <select
              className='text-xs  bg-slate-900 border-0 focus:ring-0 focus:outline-none focus:border-0 '
              value={head}
              onChange={(e) => { setHead(e.target.value) }}
            >
              {headOptions}
            </select>
          </div>
          <div className='flex flex-row justify-center py-1 h-1/3'>
            <button className='text-xs bg-slate-900 border-0 focus:ring-0 focus:outline-none focus:border-0' onClick={toggleDirection}>
              {direction}
            </button>
          </div>
        </div>
        <div className="px-6 py-4 shadow-md rounded-md bg-slate-900 border-2 border-stone-950">
          <div className="flex flex-col">
            <div className='flex flex-row px-5 py-1'>
              <SubWordDisplay layer={parseInt(layer)} head={parseInt(head)} direction={direction} />
            </div>
            <div className='flex flex-row relative'>
              <label className="w-[48em] block">
                <input
                  className="bg-slate-900 shadow-sm border-0 focus:outline-none focus:border-0 placeholder-slate-400 text-sm py-2 px-3 w-full "
                  placeholder="Example input..."
                  value={state.modelInputText}
                  onChange={(e) => state.updateModelInputText(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500"
                onClick={() => state.inferenceModel()}
                disabled={state.inferencing}
              >
                {state.inferencing ?
                  (<svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>)
                  :
                  (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>)
                }
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
};
