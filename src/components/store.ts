import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import * as tf from '@tensorflow/tfjs';

import { initNodes, initEdges } from './flowInit';



type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  modelInputText: string[];
  modelInputTokens: number[][];
  modelInputSubWords: string[][];
  inferencePrompt: string;
  inferencing: boolean;
  // modelActivations: 
};

// this is our useStore hook that we can use in our
// components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  initNodes: initNodes,
  initEdges: initEdges,
  nodes: [...initNodes],
  edges: [...initEdges],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  createNodes( newNodes ) {
    set({ nodes: [...get().nodes, ...newNodes] });
  },

  createEdges( newEdges ) {
    set({ edges: [...get().edges, ...newEdges] });
  },
  resetFlow() {
    set({ nodes: initNodes, edges: initEdges })
  },

  modelInputText: [''],
  modelInputSubWords: [['This', 'is', 'an', 'ex', 'amp', 'le']],
  modelInputTokens: [[1, 2, 3, 4, 5]],
  updateModelInputText(newText: string) {
    set({ modelInputText: [newText] });
    
    fetch("/api/tokenize/toTokens", {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ input: [newText] }),
    })
    .then(r => r.json())
    .then((r) => {set({ modelInputTokens: r.tokens })});

    
    fetch("/api/tokenize/toStringTokens", {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ input: [newText] }),
    })
    .then(r => r.json())
    .then((r) => {set({ modelInputSubWords: r.stringTokens })});
  },
  updatemodelInputTokens(newTokens: number[][]) {
    set({ modelInputTokens: newTokens });
  },

  modelActivations: {},
  inferencePrompt: '',
  inferencing: false,
  inferenceModel() {
    set({ inferencing: true });

    fetch("/api/inference/run")
    .then(r => r.json())
    .then((r) => {
      console.log(r);
      set({ 
        inferencePrompt: r.inferencePrompt,
        modelActivations: Object.fromEntries(
          Object.entries(r.activationData).map(([key, val]) => [key, tf.tensor(val)]),
      )})
      set({ inferencing: false });
    });    
    
  }
}));

export default useStore;
