import React, { useState } from 'react';
import { ModelFlow } from '../components/Graph';
import { ModelSelectPopup, OpenButton } from '../components/ModelSelect';
import dynamic from 'next/dynamic';
export const AllotmentWrapper = dynamic(
  () => import('@/components/reImportWrappers/Allotment'),
  { ssr: false }
)
export const AllotmentPaneWrapper = dynamic(
  () => import('@/components/reImportWrappers/AllotmentPane'),
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
      <AllotmentWrapper>
        <AllotmentPaneWrapper minSize={200}>
          <div>
            <ModelFlow selectedModel={selectedModel}/>
              {showModelSelect && 
                <ModelSelectPopup
                  selectedModel={selectedModel}
                  onClose={(newModelSelection) => {setShowModelSelect(false); setSelectedModel(newModelSelection ?? selectedModel)}}
                />
              }
            <OpenButton onClick={() => setShowModelSelect(true)} selectedModel={selectedModel} />
          </div>
        </AllotmentPaneWrapper>

        <AllotmentPaneWrapper snap={true}>
          <NotebookWrapper />
        </AllotmentPaneWrapper>
      </AllotmentWrapper>
    </div>
  );
};
