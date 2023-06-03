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
import { assocPath, dissocPath } from 'ramda';
import * as tf from '@tensorflow/tfjs';

import { initNodes, initEdges } from './flowInit';
import { customConnectionStyle } from './FlowNodeEdge/customConnectionLine';

const removeKey = (key, {[key]: _, ...rest}) => rest;
const putMsg = {method: "PUT", headers: {"Content-Type": "application/json"}}

// interface VisualComponent {
//     modelComponent: string;
//     slice: string;
//     activationShape: number[];
//     weightShape?: number[];
//     graidentShape?: number[];
// }

interface modelComponentSlice {
  [modelComponent: string]: {
    [slice: string]: { slice: number[][] }
  };
}
interface modelComponentSlicePatches {
  [modelComponent: string]: {
    [slice: string]: { slice: number[][], edges: modelComponentSlice }
  };
}

interface modelComponentSliceAblations {
  [modelComponent: string]: {
    [slice: string]: { slice: number[][], ablationType: 'zero' | 'freeze' }
  };
}

type RFState = {
  logicalClock: number;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  availableModels: {}[];
  
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
  modelActivations: { [modelComponent: string]: tf.Tensor };
  
  // modelVisualComponents: VisualComponent[];

  modelAblations: modelComponentSliceAblations;
  syncAblations: (logicalClock: number, ablations: modelComponentSliceAblations) => void;

  modelPatches: modelComponentSlicePatches;
  syncPatches: (logicalClock: number, patches: modelComponentSlicePatches) => void;
  addPatch: (sourceRealationId: string, sourceSlice: any, targetRelationId: string, targetSlice: any) => void;
  rmPatch: (sourceRealationId: string, sourceSlice: any, targetRelationId: string, targetSlice: any) => void;

  // Purely for visual rendering, not server side sync
  patching: boolean;
  patchTargetNodes: Set<string>;
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
    console.log(connection);
    // Handle Patching
    const { source, target } = connection;
    const { nodes } = get();
    const sourceNode = nodes.find(({ id }) => id === source)!.data;
    const targetNode = nodes.find(({ id }) => id === target)!.data;

    // Add patch to backend
    get().addPatch(sourceNode.realationId, sourceNode.slice, targetNode.realationId, targetNode.slice);

    // Add patch style
    const edge = {
      ...connection,
      style: customConnectionStyle
    }

    set({
      edges: addEdge(edge, get().edges),
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

  availableModels: [],
  getAvailableModels() {
    fetch("/api/models/getModels")
    .then(r => r.json())
    .then((r) => {set({ availableModels: r })});
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
          Object.entries(r.activationData).map(([key, val]) => [key, tf.tensor(val as tf.TensorLike)]),
        ),
      })
      set({ inferencing: false });
    });    
  },


  modelPatches: {},
  syncPatches(logicalClock=get().logicalClock, patches={}) {
    fetch("/api/patch/sync", {
      ...putMsg,
      body: JSON.stringify({
        patches: patches,
        clientLogicalClock: logicalClock
      }),
    })
    .then(r => r.json())
    .then((r) => {
      set(state => ({
        modelPatches: { ...r.patches }, logicalClock: Math.max(logicalClock, r.server_logical_clock)+1
      }))    
    });
  },
  addPatch(sourceRealationId, sourceSlice, targetRelationId, targetSlice) {
    const { modelPatches, logicalClock } = get();
    const sourceAdded = assocPath([sourceRealationId, sourceSlice, 'slice'], sourceSlice, modelPatches);
    const targetAdded = assocPath(
      [sourceRealationId, sourceSlice, 'edges', targetRelationId, targetSlice],
      { slice: targetSlice },
      sourceAdded
    );

    get().syncPatches(logicalClock, targetAdded);
  },
  rmPatch(sourceRealationId, sourceSlice, targetRelationId, targetSlice) {
    const { modelPatches, logicalClock } = get();
    const updatedPatches = dissocPath([sourceRealationId, sourceSlice, 'edges', targetRelationId, targetSlice], modelPatches);
    
    get().syncPatches(logicalClock, updatedPatches);
  },

  patching: false,
  patchTargetNodes: new Set(),
  startPatchEdge(_, { nodeId }: { nodeId: string}) {
    const { nodes } = get();
    const sourceNode = nodes.find(({ id }) => id === nodeId)!.data.outputShapeStrings;
    
    set({
      patching: true,
      patchTargetNodes: new Set(
        nodes.filter(({ data }) => data?.inputShapeStrings?.join(',') === sourceNode.join(',')).map(({ id }) => id)
        )
      });
  },
  endPatchEdge(_) {
    set({ patching: false, patchTargetNodes: new Set() })
  },
  deletePatchEdge(edges: Edge[]) {
    const { nodes, rmPatch } = get();
    edges.map(({ source, target }) => {
      const sourceNode = nodes.find(({ id }) => id === source)!.data;
      const targetNode = nodes.find(({ id }) => id === target)!.data;
  
      rmPatch(sourceNode.realationId, sourceNode.slice, targetNode.realationId, targetNode.slice)}
    );
  },
  validPatchEdge({ source, target }) {
    const { nodes } = get();
    const sourceNode = nodes.find(({ id }) => id === source)!.data;
    const targetNode = nodes.find(({ id }) => id === target)!.data;
    return sourceNode.outputShapeStrings.join(',') === targetNode.inputShapeStrings.join(',');
  },


  modelAblations: {},
  syncAblations(logicalClock=get().logicalClock, ablations={}) {
    fetch("/api/ablation/sync", {
      ...putMsg,
      body: JSON.stringify({
        ablations: ablations,
        clientLogicalClock: logicalClock
      }),
    })
    .then(r => r.json())
    .then((r) => {
      set(state => ({
        modelAblations: { ...r.ablations }, logicalClock: Math.max(logicalClock, r.server_logical_clock)+1
      }))    
    });
  },
  addAblations(realationId, slices, ablationType) {
    const { modelAblations, logicalClock } = get()
    const updatedAblations = {
      ...modelAblations,
      [realationId]: {
        ...modelAblations?.[realationId],
        ...Object.assign({}, ...(slices.map(slice => ({[slice]: { slice: slice, ablationType: ablationType }}))).values())
      }
    }  

    get().syncAblations(logicalClock, updatedAblations);
  },
  rmAblations(realationId, slices) {
    const { modelAblations, logicalClock } = get()
    const updatedAblations = slices.reduce((currentAblations, slice) => {
      return {
        ...currentAblations,
        [realationId]: {
          ...removeKey(slice, currentAblations?.[realationId]),
        },
      };
    }, { ...modelAblations });
    
    get().syncAblations(logicalClock, updatedAblations);
  },
  

}));

export default useStore;
