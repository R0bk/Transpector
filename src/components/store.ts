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
  logicalClock: number;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  modelInputText: string[];
  modelInputTokens: number[][];
  modelInputSubWords: string[][];

  inferencePrompt: string;
  inferenceSubWords: string[];
  inferencing: boolean;
  modelOutputlogits: number[][][];
  modelOutputTokens: number[][];
  modelOutputSubWords: string[][];
  modelOutputLoss: number[][];
  modelOuputFinalLoss: number;
  // modelActivations: 

  modelAblationHeads: { [layer: number]: Set<number> };
};

// this is our useStore hook that we can use in our
// components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  logicalClock: 0,
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
  inferenceSubWords: [],
  inferencing: false,
  modelOutputlogits: [],
  modelOutputTokens: [],
  modelOutputSubWords: [],
  modelOutputLoss: [],
  modelOuputFinalLoss: 0.,
  inferenceModel() {
    set({ inferencing: true });

    fetch("/api/inference/run")
    .then(r => r.json())
    .then((r) => {
      console.log(r);
      set({ 
        inferencePrompt: r.inferencePrompt,
        inferenceSubWords: r.inferenceSubWords,
        modelOutputlogits: r.logits,
        modelOutputTokens: r.tokens,
        modelOutputSubWords: r.subWords,
        modelOutputLoss: r.tokenLoss,
        modelOuputFinalLoss: r.finalLoss,
        modelActivations: Object.fromEntries(
          Object.entries(r.activationData).map(([key, val]) => [key, tf.tensor(val)]),
      )})
      set({ inferencing: false });
    });    
  },

  modelAblationHeads: {},
  addAblationHead: (modelAblationHeads, layer, head) => {
    // If the layer doesn't exist yet in the object, create an empty array for it
    if (!modelAblationHeads[layer]) {
      modelAblationHeads[layer] = new Set<number>();
    }

    // Add the head to the array for this layer
    modelAblationHeads[layer].add(head);
    set({ modelAblationHeads: modelAblationHeads })
  },

}));

export default useStore;
