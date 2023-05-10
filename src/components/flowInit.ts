import * as tf from '@tensorflow/tfjs';

export const initNodes = [
    {
      id: 'text',
      type: 'textInput',
      data: { text: 'Jane Doe' },
      position: { x: -200, y: 400 },
    },
    {
      id: 'tokenizedWords',
      type: 'tokenizedWords',
      data: { tokenizedWords: [['This', 'is', 'an', 'ex', 'amp', 'le']], pattern: tf.randomNormal([1, 12, 7, 7])},
  
      position: { x: -200, y: 300 },
    },
    {
      id: 'tokens',
      type: 'token',
      data: { tokens: [1,2,3,4,5]},
  
      position: { x: -200, y: 200 },
    },
    {
      id: 'we',
      type: 'embed',
      data: { label: 'Textual Embedding', realationId: 'hook_embed', embed: tf.randomNormal([1, 5, 5])},
      position: { x: -200, y: -200 },
    },
    {
      id: 'pos',
      type: 'embed',
      data: { label: 'Positional Embedding', realationId: 'hook_pos_embed', embed: tf.randomNormal([1, 5, 5])},
      position: { x: 200, y: -200 },
    },
];
  
export const initEdges = [
    { id: 'e1', source: 'text', target: 'tokenizedWords', },
    { id: 'e2', source: 'tokenizedWords', target: 'tokens', },
    { id: 'e3', source: 'tokens', target: 'we', type: 'button' },
    { id: 'e4', source: 'tokens', target: 'pos', type: 'button' },
    { id: 'e5', source: 'we', target: 'blocks.1.query', },
    { id: 'e6', source: 'we', target: 'blocks.1.key', },
    { id: 'e7', source: 'we', target: 'blocks.1.value', },
    { id: 'e8', source: 'we', target: 'blocks.1.residual', },
    { id: 'e9', source: 'pos', target: 'blocks.1.query', },
    { id: 'e10', source: 'pos', target: 'blocks.1.key', },
    { id: 'e11', source: 'pos', target: 'blocks.1.value', },
    { id: 'e12', source: 'pos', target: 'blocks.1.residual', },
];