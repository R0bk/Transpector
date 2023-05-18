import {useDispatch} from 'react-redux';
import {Button} from '@primer/react';
import {PlayIcon} from '@primer/octicons-react';
import {FileIcon} from '@primer/octicons-react';
import {Text} from '@primer/react';
import CellSidebarComponent from './NotebookCellSidebar';
import {notebookActions, Jupyter, Notebook} from '@datalayer/jupyter-react';
import React from 'react';

const NOTEBOOK_UID = 'notebook-uid-example';


const NotebookSimpleToolbar = (props: {notebookId: string}) => {
  const {notebookId} = props;
  const dispatch = useDispatch();
  return (
    <div className='h-[4em] flex flex-row px-6 py-3'>
      <div className='px-2'>
        <Button
          sx={{backgroundColor: 'rgb(15 23 42);'}}
          variant="outline"
          color="secondary"
          leadingIcon={PlayIcon}
          onClick={() => dispatch(notebookActions.run.started(notebookId))}
        >
          Run
        </Button>
      </div>
      <div className='px-2'>
        <Button
          sx={{backgroundColor: 'rgb(15 23 42);'}}
          variant="outline"
          leadingIcon={FileIcon}
          onClick={() =>
            dispatch(notebookActions.save.started({uid: notebookId, date: new Date()}))
          }
        >
          Save
        </Button>
      </div>
      <Text as="h3">
      </Text>
    </div>
  );
};
      
      

export default function NotebookWrapper() {
  return (
    <div className="flex min-h-screen max-h-screen flex-col items-center justify-between" >
      <Jupyter
        terminals={false} useRunningKernelIndex={0} startDefaultKernel={false}
        jupyterServerHttpUrl="http://127.0.0.1:8686/api/jupyter"
        jupyterServerWsUrl="ws://127.0.0.1:8686/api/jupyter"
        jupyterToken="60c1661cc408f978c309d04157af55c9588ff9557c9380e4fb50785750703da6"
      >
        {/* <Layers /> */}
        <NotebookSimpleToolbar notebookId={NOTEBOOK_UID} />
        <Notebook
          uid={NOTEBOOK_UID}
          path="main.ipynb"
          ipywidgets="classic"
          CellSidebar={CellSidebarComponent}
        />
      </Jupyter>
    </div>
  )
};