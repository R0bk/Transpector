import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@primer/octicons-react';
import {XIcon} from '@primer/octicons-react';
import {Text} from '@primer/react';
import {PanelLayout} from '@lumino/widgets';
import {
  notebookActions,
  CellSidebarProps,
  selectActiveCell,
} from '@datalayer/jupyter-react';
import React from 'react';

const CELL_HEADER_DIV_CLASS = 'dla-CellHeader-Container';

const CellSidebarComponent = (props: CellSidebarProps) => {
  const {notebookId, cellId} = props;
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const activeCell = selectActiveCell(notebookId);
  const layout = (activeCell?.layout);
  if (layout) {
    const cellWidget = (layout as PanelLayout).widgets[0];
    if (!visible && (cellWidget?.node.id === cellId)) {
      setVisible(true);
    }
    if (visible && (cellWidget?.node.id !== cellId)) {
      setVisible(false);
    }
  }
  if (!visible) {
    return <div></div>
  }
  return (
    <div className={CELL_HEADER_DIV_CLASS}>
      <div
        onClick={e => {
          e.preventDefault();
          dispatch(notebookActions.run.started(notebookId));
        }}
      >
        <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
          <ChevronRightIcon size={16} fill='#bbb' />
          <Text as="p" color="#bbb">
            Run
          </Text>
        </span>
      </div>
      <div
        onClick={e => {
          e.preventDefault();
          dispatch(
            notebookActions.insertAbove.started({
              uid: notebookId,
              cellType: 'code',
            })
          );
        }}
      >
        <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
          <ChevronUpIcon size={16} fill='#bbb' />

          <Text as="p" color="#bbb">
            Add above
          </Text>
        </span>
      </div>
      <div
        onClick={e => {
          e.preventDefault();
          dispatch(
            notebookActions.insertBelow.started({
              uid: notebookId,
              cellType: 'code',
            })
          );
        }}
      >
        <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
          <ChevronDownIcon size={16} fill='#bbb' />
          <Text as="p" color="#bbb">
            Add below
          </Text>
        </span>
      </div>
      <div
        onClick={e => {
          e.preventDefault();
          dispatch(notebookActions.delete.started(notebookId));
        }}
      >
        <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
          <XIcon size={16} fill='#bbb' />
          <Text as="p" color="#bbb">
            Delete
          </Text>
        </span>
      </div>
    </div>
  );
};

export default CellSidebarComponent;
