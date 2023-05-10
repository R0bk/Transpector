import React, { useRef, useEffect, useMemo } from 'react'
import ReactFlow, { Background, MiniMap, Controls, BezierEdge } from 'reactflow';
import 'reactflow/dist/base.css';
import { Handle, Position } from 'reactflow';
import { shallow } from 'zustand/shallow';
import useStore from './store';
import { TokenNode, SubWordsNode } from './TokenNode';
import { TextInputNode, TextInputPopup } from './TextInputNode';
import { KeyQueryVectorNode } from './KeyQueryVectorNode';
import { ButtonEdge } from './ButtonEdge';
import { ResidualNode, EmbedNode } from './ResidualNodes';
import { PatternNode, ResultNode } from './PatternNode';

import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then((res) => res.json())


import * as d3 from 'd3';
import * as tf from '@tensorflow/tfjs';




function CustomNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex">
        <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
            {data.label}
          {data.emoji}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.name}</div>
          <div className="text-gray-500">{data.job}</div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
  );
}



const calculateInitialNodeAndEdges = (modelConfig) => {
    // Create heads
    const xOffset = 120;
    const layerPadding = 200;
    const layerInternalPadding = 20;
    const layerWidth = 20*2 + modelConfig.n_heads * xOffset;
    const layerHeight = 1000;
    const xStart = -layerWidth - 400;
    const yStart = -layerHeight - layerPadding;
    const modelNodes = [];
    const modelEdges = [];

    for (let i = 0; i < modelConfig.n_layers; i++) {
        const layerId = `blocks.${i + 1}`;
        const prevLayerId = `blocks.${i}`;
        const prevLayerResidualId = `${prevLayerId}.residual`;

        // Add layer group
        modelNodes.push({
            id: layerId,
            // type: 'group',
            data: { label: `Layer ${i+1}` },
            position: { x: xStart, y: yStart - i * (layerHeight+layerPadding) },
            style: { width: layerWidth, height: layerHeight, backgroundColor: 'rgba(255, 0, 128, 0.05)', textAlign: 'left', fontSize: '32px', padding: '24px', color: '#e2e8f080' },
        });

        // Add query, key, and value nodes
        ['query', 'key', 'value'].forEach((type, index) => {
            const nodeId = `${layerId}.${type}`;
            modelNodes.push({
                id: nodeId,
                type,
                data: {
                    label: `${type}`,
                    realationId: `${layerId}.attn.hook_${type[0]}`,
                    kqv: tf.randomNormal([1, 5, modelConfig.n_heads, 5]),
                },
                position: { x: 20 + index * 400, y: type==='value' ? 200+layerInternalPadding : 700+layerInternalPadding  },
                parentNode: layerId,
                extent: 'parent',
            });

            // Add edges between key/query and heads
            if (type === 'query' || type === 'key') {
                for (let j = 0; j < modelConfig.n_heads; j++) {
                    const headId = `${layerId}.headPattern${j}`;
                    const edgeId = `${nodeId}-${headId}`;
                    modelEdges.push({ id: edgeId, source: nodeId, target: headId });
                }
            }

            // Add edges to previous residual
            if (i > 0) {
                modelEdges.push({ id: `${prevLayerResidualId}-${nodeId}`, source: prevLayerResidualId, target: nodeId });
            }
        });



        // Add summed head pattern
        const patternId = `${layerId}.pattern`;
        modelNodes.push({
            id: patternId,
            type: 'pattern',
            data: {
                label: `Pattern`,
                realationId: `${layerId}.attn.hook_pattern`,
                colourId:0,
                pattern: tf.randomNormal([1, modelConfig.n_heads, 5, 5]),
                summedPattern: true,
            },
            position: { x: 600, y: 200+layerInternalPadding },
            parentNode: layerId,
            extent: 'parent',
        });


        // Add head nodes
        for (let j = 0; j < modelConfig.n_heads; j++) {
            const headId = `${layerId}.headPattern${j}`;
            modelNodes.push({
                id: headId,
                type: 'headPattern',
                data: {
                    label: `Head ${j}`,
                    realationId: `${layerId}.attn.hook_pattern`,
                    relationSliceId: j,
                    colourId: j,
                    pattern: tf.randomNormal([1, modelConfig.n_heads, 5, 5]),
                    summedPattern: false,
                },
                position: { x: 20 + j * xOffset, y: 400+layerInternalPadding },
                parentNode: layerId,
                extent: 'parent',
            });

            // Add edges from each head to pattern
            const edgeId = `${headId}-${patternId}`;
            modelEdges.push({ id: edgeId, source: headId, target: patternId });
        }


        // Add result node
        const resultId = `${layerId}.result`;
        modelNodes.push({
            id: resultId,
            type: 'result',
            data: {
                label: `Result`,
                realationId: `${layerId}.attn.hook_z`,
                result: tf.randomNormal([1, modelConfig.n_heads, 5, 5])
            },
            position: { x: 600, y: layerInternalPadding },
            parentNode: layerId,
            extent: 'parent',
        });

        // Add head pattern to result edge and value to result edge
        modelEdges.push({ id: `${patternId}-${resultId}`, source: patternId, target: resultId });
        const valueId = `${layerId}.value`;
        modelEdges.push({ id: valueId, source: valueId, target: resultId });

        // Add residual node 
        const residualId = `${layerId}.residual`;
        modelNodes.push({
            id: residualId,
            type: 'residual',
            data: {
                label: `Residual`,
                realationId: `${layerId}.hook_resid_post`,
                residual: tf.randomNormal([1, 5, 5]),
            },
            position: { x: 0, y: yStart - i * (layerHeight+layerPadding) -200},
        });

        // Add result to residual and residual
        modelEdges.push({ id: `${resultId}-${residualId}`, source: resultId, target: residualId });
        modelEdges.push({ id: `${prevLayerResidualId}-${residualId}`, source: prevLayerResidualId, target: residualId });
    }

    return [modelNodes, modelEdges]
}


const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  createNodes: state.createNodes,
  createEdges: state.createEdges,
  resetFlow: state.resetFlow,
});

const nodeTypes = {
    custom: CustomNode,
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
};

const Flow = ({ modelConfig }) => {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, createNodes, createEdges, resetFlow } = useStore(selector, shallow);

    // Model info          
    const edgeTypes = useMemo(() => ({ button: ButtonEdge, default: BezierEdge }), []);
      
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
            <TextInputPopup/>
            <MiniMap maskColor={'rgb(2 6 23)'}  nodeColor={'rgb(4 47 46)'} style={{backgroundColor: '#0f172a'}} />
            {/* <Controls /> */}
            <Background variant="dots" gap={24} size={1} />
        </ReactFlow>
    </div>
)
}

export const ModelFlow = ({ selectedModel='gpt2' }) => {

  const { data, error } = useSWR(`/api/models/getModelConfig/${selectedModel}`, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const modelConfig = data.config;
  console.log(modelConfig);

  return (
    <Flow modelConfig={modelConfig}/>
  );
};
