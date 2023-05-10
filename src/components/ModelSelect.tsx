import React, { useState} from 'react'

import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export const ModelSelect = ({ onSelect }) => {
    const { data, error } = useSWR('/api/models/getModels', fetcher)

    const [selectedModelIndex, setSelectedModelIndex] = useState(null);

    const handleClick = (index) => {
        setSelectedModelIndex(selectedModelIndex === index ? null : index);
    };

    const handleSelect = async (modelName) => {
        try {
          await fetch(`/api/models/setModel`, { method: 'PUT', headers: {'Content-type': 'application/json'}, body: JSON.stringify({'model_name': modelName}) });
          console.log(`Selected model: ${modelName}`);
          onSelect(modelName); // Add this line to close the popup after selecting a model
        } catch (error) {
          console.error('Failed to select the model:', error);
        }
      };
    

  
    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>
  
    return (
        <div className="bg-gray-900 p-3 max-h-[90vh] overflow-y-auto">
            {data.map((model, index) => (
                <div className="text-sm bg-gray-800 m-1" key={index} style={{ width: '600px' }}>
                    <div className="bg-gray-700 p-1 flex justify-between items-center">
                        <div className="px-0.5" onClick={() => handleClick(index)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <div style={{ marginRight: '10px' }}>{selectedModelIndex === index ? '-' : '+'}</div>
                            <p>{model.model_name}</p>
                        </div>
                        <button
                            className="bg-gray-950/50 text-xs text-white py-1 px-2"
                            onClick={() => handleSelect(model.model_name)}
                        >
                            Load
                        </button>
                    </div>
                    {selectedModelIndex === index && (
                        <div className="p-1">
                            <table>
                                <tbody>
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

export const ModelSelectPopup = ({ onClose }) => {
    return (
      <div className="z-50 fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center">
        <div className="ml-12 bg-gray-800 rounded-lg relative">
          <button
            className="absolute top-1 right-1 text-white text-xl font-semibold"
            onClick={onClose}
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
      className="bg-slate-800 shadow-lg outline outline-2 outline-slate-200/20 w-10 h-10  font-semibold fixed top-4 left-4"
      onClick={onClick}
      >
        <span className='text-xs text-slate-300 font-light'>{selectedModel}</span>
      </button>
    );
  };