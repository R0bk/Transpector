// import Jupyter from '@datalayer/jupyter-react/lib/jupyter/Jupyter';
// import Cell from '@datalayer/jupyter-react/lib/components/cell/Cell';
// import Notebook from '@datalayer/jupyter-react/lib/components/Notebook/Notebook';

// const source = `import matplotlib.pyplot as plt
// data = {'apple': 10, 'orange': 15, 'lemon': 5, 'lime': 20}
// names = list(data.keys())
// values = list(data.values())
// fig, axs = plt.subplots(1, 3, figsize=(9, 3), sharey=True)
// axs[0].bar(names, values)
// axs[1].scatter(names, values)
// axs[2].plot(names, values)
// fig.suptitle('Categorical Plotting')`

const NOTEBOOK_UID = 'notebook-uid-example';



import {useDispatch} from 'react-redux';
import {Button} from '@primer/react';
import {PlayIcon} from '@primer/octicons-react';
import {FileIcon} from '@primer/octicons-react';
import {Text} from '@primer/react';
import {notebookActions, Jupyter, Notebook} from '@datalayer/jupyter-react';
import React from 'react';

const NotebookSimpleToolbar = (props: {notebookId: string}) => {
  const {notebookId} = props;
  const dispatch = useDispatch();
  return (
    <div className='h-[4em] flex flex-row px-6 py-3'>
      {/* <Text as="h3">Notebook Example</Text> */}
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
          // color="secondary"
          leadingIcon={FileIcon}
          onClick={() =>
            dispatch(notebookActions.save.started({uid: notebookId, date: new Date()}))
          }
        >
          Save
        </Button>
      </div>
      <Text as="h3">
        {/* Notebook: {notebook.notebookChange.cellsChange} */}
      </Text>
    </div>
  );
};
      
      

export default function NotebookWrapper() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between" style={{overflowY: 'scroll'}}>
      <Jupyter
        terminals={false} useRunningKernelIndex={0}
        jupyterServerHttpUrl="http://127.0.0.1:8686/api/jupyter"
        jupyterServerWsUrl="ws://127.0.0.1:8686/api/jupyter"
        jupyterToken="60c1661cc408f978c309d04157af55c9588ff9557c9380e4fb50785750703da6"
      >
        {/* <Layers /> */}
        <NotebookSimpleToolbar notebookId={NOTEBOOK_UID} />
        <Notebook uid={NOTEBOOK_UID}  path="main.ipynb" ipywidgets="classic"/>
        {/* <Cell source={source}/> */}
      </Jupyter>

    </div>
  )
};