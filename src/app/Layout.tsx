import React, { useState } from 'react';
import { ModelFlow } from '../components/Graph';
import { ModelSelectPopup, OpenButton } from '../components/ModelSelect';
import dynamic from 'next/dynamic';
export const AllotmentCmp = dynamic(
  () => import('@/components/Allotment'),
  { ssr: false }
)
export const NotebookWrapper = dynamic(
  () => import('@/app/NotebookWrapper'),
  { ssr: false }
)
import "allotment/dist/style.css";

export const Layout = () => {
  const [showModelSelect, setShowModelSelect] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt2');

  return (
    <div className='w-[100vw] h-[100vh]'>
      <AllotmentCmp>
        <div>
          <ModelFlow selectedModel={selectedModel}/>
            {showModelSelect && <ModelSelectPopup onClose={() => setShowModelSelect(false)} />}
          <OpenButton onClick={() => setShowModelSelect(true)} selectedModel={selectedModel} />
        </div>
        <NotebookWrapper />
      </AllotmentCmp>
    </div>
  );
};
