import React, { useEffect, useMemo } from 'react'
import ReactFlow, { Background, MiniMap, Controls, BezierEdge, Position } from 'reactflow';
import 'reactflow/dist/base.css';
import { shallow } from 'zustand/shallow';
import useStore from './store';
import { TokenNode, SubWordsNode } from './FlowNodeEdge/TokenNode';
import { TextInputNode, TextInputPopup } from './FlowNodeEdge/TextInputNode';
import { KeyQueryVectorNode } from './FlowNodeEdge/KeyQueryVectorNode';
import { ButtonEdge } from './FlowNodeEdge/ButtonEdge';
import { LayerNormNode } from './FlowNodeEdge/layerNormNode';
import { ResidualNode, EmbedNode } from './FlowNodeEdge/ResidualNodes';
import { PatternNode, ResultNode } from './FlowNodeEdge/PatternNode';
import { OutputNode } from './FlowNodeEdge/OutputNode';

import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then((res) => res.json())


import * as tf from '@tensorflow/tfjs';
import { MlpNode } from './FlowNodeEdge/MlpNode';




interface Position {
    x: number;
    y: number;
  }

  interface Style {
    width?: number;
    height?: number;
    backgroundColor?: string;
    textAlign?: 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit';
    fontSize?: string;
    padding?: string;
    color?: string;
  }

  interface GroupData {
    label: string;
  }
  
  interface PatternData {
    label: string;
    layerNumber: number,
    realationId: string;
    relationSliceId?: number;
    colourId: number;
    pattern: tf.Tensor;
  }
  
  interface ResidualData {
    label: string;
    realationId: string;
    residual: tf.Tensor;
  }
  interface KqvData {
    label: string;
    realationId: string;
    kqv: tf.Tensor;
  }

  interface ResultData {
    label: string;
    realationId: string;
    result: tf.Tensor;
  }
  
  interface LayerNormData {
    label: string;
    realationId: string;
    LayerNorm: tf.Tensor;
  }
  

  interface BaseNode {
    id: string;
    type?: string;
    data: PatternData | ResidualData | KqvData | ResultData | GroupData;
    position: Position;
    parentNode?: string;
    extent?: 'parent';
    style?: Style;
    targetPosition?: Position.Top | Position.Bottom;
    sourcePosition?: Position.Top | Position.Bottom;
  }
  
  type ModelNode = BaseNode;
  
  interface ModelEdge {
    id: string;
    source: string;
    target: string;
  }

const createEdge = (source: string, target: string): ModelEdge => (
    { id: `${source}-${target}`, source: source, target: target }
)

const initialiselLayerConstants = (i, attnOnly) => {
    const layerId = `blocks.${i}`;
    const prevLayerId = `blocks.${i-1}`;

    return ({
        layerId: layerId,
        prevLayerResidualId: attnOnly ? `${prevLayerId}.hook_resid_mid` : `${prevLayerId}.hook_resid_post`,
        attnLayerNormNodeId: `${layerId}.ln1`, // e.g. from Transformer Lens blocks.0.ln1.hook_normalized
        patternId: `${layerId}.pattern`,
        resultId: `${layerId}.result`,
        residualId: `${layerId}.hook_resid_mid`,
        mlpLayerNormId: `${layerId}.ln2`,
        mlpId:`${layerId}.mlp`,
        mlpResidualId:`${layerId}.hook_resid_post`,
        modelOutputId: `output`,

})}

const initialiseModelConstants = (modelConfig) => ({
    xOffset: 120,
    layerPadding: 500,
    layerInternalPadding: 20,
    layerWidth: 20*2 + modelConfig.n_heads * 120,
    layerHeight: 900,
    xStartOffset:  -400,
})

const createGroupNode = (i, { layerId }, { layerWidth, xStartOffset, layerHeight, layerPadding }): BaseNode => ({
    id: layerId,
    // type: 'group',
    data: { label: `Layer ${i+1}` },
    position: { x: -layerWidth + xStartOffset, y: -(i+1)*(layerHeight+layerPadding) },
    sourcePosition: Position.Top,
    targetPosition: Position.Bottom,
    style: { width: layerWidth, height: layerHeight, backgroundColor: 'rgba(255, 0, 128, 0.05)', textAlign: 'left', fontSize: '32px', padding: '24px', color: '#e2e8f080' },
})

const createAttnLayerNormNode = ({ layerId, attnLayerNormNodeId }, { layerWidth  }): BaseNode => ({
    id: attnLayerNormNodeId,
    type: 'layerNorm',
    data: { label: `Layer Norm` },
    position: { x: layerWidth/2 - 50, y: 850 },
    sourcePosition: Position.Top,
    targetPosition: Position.Bottom,
    parentNode: layerId,
    extent: 'parent',
})

const createKqvNode = (type, index, nHeads, { layerId }, { layerInternalPadding  }): BaseNode => ({
    id: `${layerId}.${type}`,
    type,
    data: {
        label: `${type}`,
        realationId: `${layerId}.attn.hook_${type[0]}`,
        kqv: tf.randomNormal([1, 5, nHeads, 5]),
    },
    position: { x: 20 + index * 400, y: layerInternalPadding+ (type==='value' ? 200 : 700) },
    parentNode: layerId,
    extent: 'parent',
})

const createPatternNode = (nHeads, { layerId, patternId }, { layerInternalPadding }, i): BaseNode => ({
    id: patternId,
    type: 'pattern',
    data: {
        label: `Pattern`,
        layerNumber: i,
        realationId: `${layerId}.attn.hook_pattern`,
        colourId: 0,
        pattern: tf.randomNormal([1, nHeads, 5, 5]),
    },
    position: { x: 600, y: 200+layerInternalPadding },
    parentNode: layerId,
    extent: 'parent',
})

const createHeadPatternNodes = (nHeads, { layerId }, { xOffset, layerInternalPadding  }, i): BaseNode[] => (
    Array.from({ length: nHeads }, (_, j) => {
        const headId = `${layerId}.headPattern${j}`;
        return {
            id: headId,
            type: 'headPattern',
            data: {
                label: `Head ${j}`,
                layerNumber: i,
                realationId: `${layerId}.attn.hook_pattern`,
                relationSliceId: j,
                colourId: j,
                pattern: tf.randomNormal([1, nHeads, 5, 5]),
            },
            position: { x: 20 + j * xOffset, y: 400+layerInternalPadding },
            parentNode: layerId,
            extent: 'parent',
        };
    })
)

const createResultNode = (nHeads, { layerId, resultId }, { layerInternalPadding  }): BaseNode => ({
    id: resultId,
    type: 'result',
    data: {
        label: `Result`,
        realationId: `${layerId}.attn.hook_z`,
        result: tf.randomNormal([1, nHeads, 5, 5])
    },
    position: { x: 600, y: layerInternalPadding },
    parentNode: layerId,
    extent: 'parent',
})

const createAttnResidualNode = ({ layerId, residualId }, { layerHeight, layerPadding }, i): BaseNode => ({
    id: residualId,
    type: 'residual',
    data: {
        label: `Residual`,
        realationId: `${layerId}.hook_resid_mid`,
        residual: tf.randomNormal([1, 5, 5]),
    },
    position: { x: 0, y: -layerHeight - layerPadding - i * (layerHeight+layerPadding) -200},
})

const createMlPNode = ({ mlpId }, { xStartOffset, layerHeight, layerPadding, layerWidth  }, i): BaseNode => ({
    id: mlpId,
    type: 'mlp',
    data: { label: `MLP` },
    position: { x: (-layerWidth)/2.5, y: -(i+1)*(layerHeight+layerPadding) -320 },
})

const createMlpLayerNormNode = ({ mlpLayerNormId }, { xStartOffset, layerHeight, layerPadding, layerWidth  }, i): BaseNode => ({
    id: mlpLayerNormId,
    type: 'layerNorm',    
    data: { label: `Layer Norm` },
    position: { x: (-layerWidth)/2.5, y: -(i+1)*(layerHeight+layerPadding) -220 },
})

const createMlpResidualNode = ({ layerId, mlpResidualId }, { layerHeight, layerPadding }, i): BaseNode => ({
    id: mlpResidualId,
    type: 'residual',
    data: {
        label: `Residual`,
        realationId: `${layerId}.hook_resid_post`,
        residual: tf.randomNormal([1, 5, 5]),
    },
    position: { x: 0, y: -layerHeight - layerPadding - i * (layerHeight+layerPadding) -500},
})

const createModelOutputNode = ({ modelOutputId }, { layerHeight, layerPadding }, i): BaseNode => ({
    id: modelOutputId,
    type: 'modelOutput',
    data: {
        label: `Output`,
    },
    position: { x: -200, y: -layerHeight - layerPadding - i * (layerHeight+layerPadding) -500-300},
})



  
const calculateInitialNodeAndEdges = (modelConfig) => {
    const modelConstants = initialiseModelConstants(modelConfig);

    var modelNodes: ModelNode[] = [];
    var modelEdges: ModelEdge[] = [];

    for (let i = 0; i < modelConfig.n_layers; i++) {
        const lc = initialiselLayerConstants(i, modelConfig.attn_only);

        modelNodes = [
            ...modelNodes,
            createGroupNode(i, lc, modelConstants),
            createAttnLayerNormNode(lc, modelConstants),
            ...['query', 'key', 'value'].map((type, index) => createKqvNode(type, index, modelConfig.n_heads, lc, modelConstants)),
            createPatternNode(modelConfig.n_heads, lc, modelConstants, i),
            ...createHeadPatternNodes(modelConfig.n_heads, lc, modelConstants, i),
            createResultNode(modelConfig.n_heads, lc, modelConstants),
            createAttnResidualNode(lc, modelConstants, i),
            ...(!modelConfig.attn_only ? [
                createMlpLayerNormNode(lc, modelConstants, i),
                createMlPNode(lc, modelConstants, i),
                createMlpResidualNode(lc, modelConstants, i),
            ] : []),
            ...(i ===  modelConfig.n_layers-1 ? [createModelOutputNode(lc, modelConstants, i)] : []),
        ]

        modelEdges = [
            ...modelEdges,

            // Add connection from previous layer
            ...(i > 0 ? [createEdge(lc.prevLayerResidualId, lc.layerId)] : []),

            // Add links from keys queries and values to heads and from layernorm
            ...['query', 'key'].flatMap(type => Array.from({ length: modelConfig.n_heads }, (_, j) => createEdge(`${lc.layerId}.${type}`, `${lc.layerId}.headPattern${j}`))),
            ...['query', 'key', 'value'].map(type => createEdge(lc.attnLayerNormNodeId, `${lc.layerId}.${type}`)),

            // Add links from heads to pattern
            ...Array.from({ length: modelConfig.n_heads }, (_, j) => createEdge(`${lc.layerId}.headPattern${j}`, lc.patternId)),

            // Add head pattern to result edge and value to result edge
            createEdge(lc.patternId, lc.resultId),
            createEdge(`${lc.layerId}.value`, lc.resultId),

            // Add result to residual and residual
            createEdge(lc.resultId, lc.residualId),
            createEdge(lc.prevLayerResidualId, lc.residualId),
            
            // Add MLP edges if mlp is enabled
            ...(!modelConfig.attn_only ? [
                createEdge(lc.residualId, lc.mlpResidualId),
                createEdge(lc.residualId, lc.mlpLayerNormId),
                createEdge(lc.mlpLayerNormId, lc.mlpId),
                createEdge(lc.mlpId, lc.mlpResidualId),
            ] : []),

            // Add link to final node
            ...(i ===  modelConfig.n_layers-1 ? [createEdge(lc.mlpResidualId, lc.modelOutputId)] : []),
        ]
    }

    return [modelNodes, modelEdges]
}


const flowSelector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  createNodes: state.createNodes,
  createEdges: state.createEdges,
  resetFlow: state.resetFlow,
});


const Flow = ({ modelConfig }) => {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, createNodes, createEdges, resetFlow } = useStore(flowSelector, shallow);

    // Model info          
    const edgeTypes = useMemo(() => ({ button: ButtonEdge, default: BezierEdge }), []);
    const nodeTypes = useMemo(() => ({
        textInput: TextInputNode,
        tokenizedWords: SubWordsNode,
        token: TokenNode,
        embed: EmbedNode,
        key: KeyQueryVectorNode,
        query: KeyQueryVectorNode,
        value: KeyQueryVectorNode,
        headPattern: PatternNode,
        pattern: PatternNode,
        result: ResultNode,
        residual: ResidualNode,
        layerNorm: LayerNormNode,
        mlp: MlpNode,
        modelOutput: OutputNode,
    }), []);

      
    useEffect(() => {
      const [modelNodes, modelEdges] = calculateInitialNodeAndEdges(modelConfig);
      resetFlow();
      createNodes(modelNodes);
      createEdges(modelEdges);
    }, [modelConfig]);

    const proOptions = { hideAttribution: true };


    return (
    <div style={{ width: '100%', height: '100vh' }}>
        <ReactFlow
            // onlyRenderVisibleElements={true}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            className="bg-gray-950"
            minZoom={0.05}
            proOptions={proOptions}
        >
            <TextInputPopup layerCount={modelConfig.n_layers} headCount={modelConfig.n_heads} />
            <MiniMap maskColor={'rgb(2 6 23)'}  nodeColor={'rgb(4 47 46)'} style={{backgroundColor: '#0f172a'}} />
            {/* <Controls /> */}
            <Background variant="dots" gap={24} size={1} />
        </ReactFlow>
    </div>
)
}

const modelSelector = (state) => ({
    syncAblations: state.syncAblations,
});

export const ModelFlow = ({ selectedModel='gpt2' }) => {
  const { syncAblations } = useStore(modelSelector, shallow);
  const { data, error } = useSWR(`/api/models/getModelConfig/${selectedModel}`, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  syncAblations();

  const modelConfig = data.config;

  return (
    <Flow modelConfig={modelConfig}/>
  );
};
