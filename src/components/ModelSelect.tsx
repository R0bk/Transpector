import React, { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow';
import useStore from './store';

const selector = (state) => ({
  availableModels: state.availableModels,
  getAvailableModels: state.getAvailableModels,
})


export const ModelSelect = ({ onSelect }) => {
  const { availableModels, getAvailableModels } = useStore(selector, shallow);

  const [selectedModelIndex, setSelectedModelIndex] = useState(null);

  useEffect(() => {
    getAvailableModels();
  }, [getAvailableModels]);

  const handleClick = (index) => {
    setSelectedModelIndex(selectedModelIndex === index ? null : index);
  };

  const handleSelect = async (modelName) => {
    try {
      await fetch(`/api/models/setModel`, { method: 'PUT', headers: { 'Content-type': 'application/json' }, body: JSON.stringify({ 'model_name': modelName }) });
      console.log(`Selected model: ${modelName}`);
      onSelect(modelName);
    } catch (error) {
      console.error('Failed to select the model:', error);
    }
  };



  if (!availableModels.length) return <div>Loading...</div>

  return (
    <div className="p-0 max-h-[90vh] overflow-y-auto rounded-sm text-slate-300">
      {availableModels.map((model, index) => (
        <div className="text-sm bg-slate-800 m-1 w-[600px]" key={index}>
          <div className="bg-gray-700 p-1 flex justify-between items-center rounded-sm">
            <div className="px-0.5" onClick={() => handleClick(index)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '10px' }}>{selectedModelIndex === index ? '-' : '+'}</div>
              <p>{model.model_name}</p>
            </div>
            <button
              className="bg-slate-500/20 text-xs py-1 px-2 rounded-sm"
              onClick={() => handleSelect(model.model_name)}
            >
              Load
            </button>
          </div>
          {selectedModelIndex === index && (
            <div className="p-1">
              <table>
                <tbody className='text-xs'>
                  {Object.entries(model).map(([key, value], i) => (
                    <tr key={i}>
                      <td className="text-gray-300 pr-2">{key}:</td>
                      <td className="text-gray-200">{JSON.stringify(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export const ModelSelectPopup = ({ onClose, selectedModel }) => {
  return (
    <div className="z-50 fixed top-0 left-0 w-full h-full bg-black bg-opacity-25 flex items-center">
      <div className="ml-12 bg-gray-800 rounded-lg relative">
        <button
          className="absolute top-[-16px] right-[-8px] text-white text-xl font-semibold"
          onClick={() => onClose(selectedModel)}
        >
          &times;
        </button>
        <ModelSelect onSelect={onClose} />
      </div>
    </div>
  );
};

export const OpenButton = ({ onClick, selectedModel }) => {
  return (
    <button
      className="bg-slate-900 shadow-lg outline rounded-md outline-2 outline-slate-200/20 w-10 h-10 font-semibold fixed top-4 left-4"
      onClick={onClick}
    >
      <span className='text-xs text-slate-300 font-light'>{selectedModel}</span>
    </button>
  );
};