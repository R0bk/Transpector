import Jupyter from '@datalayer/jupyter-react/lib/jupyter/Jupyter';
import Cell from '@datalayer/jupyter-react/lib/components/cell/Cell';
import Notebook from '@datalayer/jupyter-react/lib/components/Notebook/Notebook';

const source = `import matplotlib.pyplot as plt
data = {'apple': 10, 'orange': 15, 'lemon': 5, 'lime': 20}
names = list(data.keys())
values = list(data.values())
fig, axs = plt.subplots(1, 3, figsize=(9, 3), sharey=True)
axs[0].bar(names, values)
axs[1].scatter(names, values)
axs[2].plot(names, values)
fig.suptitle('Categorical Plotting')`

const NOTEBOOK_UID = 'notebook-uid-example';



import {useDispatch} from 'react-redux';
import {Button} from '@primer/react';
import {PlayIcon} from '@primer/octicons-react';
import {FileIcon} from '@primer/octicons-react';
import {Text} from '@primer/react';
import {notebookActions} from '@datalayer/jupyter-react';

const NotebookSimpleToolbar = (props: {notebookId: string}) => {
  const {notebookId} = props;
  const dispatch = useDispatch();
  return (
    <div className='h-[2em] flex flex-row px-6 py-3'>
      wtf
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



// export const color0 = "#d87c7c"
// export const color1 = "#919e8b"
// export const color2 = "#d7ab82"
// export const color3 = "#6e7074"
// export const color4 = "#61a0a8"


// const Layers = (props: any) => (
//   <svg xmlns="http://www.w3.org/2000/layers" width="100%" height="20">
//     <linearGradient id="a">
//       <stop offset="0" stopColor={color0} />
//       <stop offset="1" stopColor={color1} />
//     </linearGradient>
//     <linearGradient id="b">
//       <stop offset="0" stopColor={color2} />
//       <stop offset=".5" stopColor={color3 }/>
//       <stop offset="1" stopColor={color4} />
//     </linearGradient>
//     <rect fill="url(#b)" width="100%" height="20" />
//     <rect fill="url(#a)" width="100%" height="10" />
//   </svg>
// )
      
      
      

export default function NotebookWrapper() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <Jupyter
      collaborative={false} terminals={false}
        // jupyterServerHttpUrl="https://datalayer-studio.datalayer.run/api/jupyter"
        // jupyterServerWsUrl="wss://datalayer-studio.datalayer.run/api/jupyter"
        // jupyterToken="60c1661cc408f978c309d04157af55c9588ff9557c9380e4fb50785750703da6"
        jupyterServerHttpUrl="http://127.0.0.1:8686/api/jupyter"
        jupyterServerWsUrl="ws://127.0.0.1:8686/api/jupyter"
        jupyterToken="60c1661cc408f978c309d04157af55c9588ff9557c9380e4fb50785750703da6"
      >
        {/* <Layers /> */}
        <NotebookSimpleToolbar notebookId={NOTEBOOK_UID} />
        <Notebook uid={NOTEBOOK_UID}  path="one.ipynb"  ipywidgets="classic"  ></Notebook>
        {/* <Cell source={source}/> */}
      </Jupyter>

    </div>
  )
}