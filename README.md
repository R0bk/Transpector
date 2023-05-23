# Transpector
Visually inspect, analyse and debug transformer models. Aimed at reducing cycle times for interpretability research and lowering the barrier to entry.
## Getting Started

In it's development setting currently you have to run two parts, a python script kicking off Jupyter Server (this spawns a fastAPI backend in the same event loop as the IPython Kernal), and a Next JS Server. Next JS will be compiled and served as a static file from fastAPI eventually.

To run Next JS
```bash
npm run dev
```

To run the Jupyter server directly
```bash
jupyter server --config=jupyter_server_config.py
```

## To Do

### Milestone 2
- [ ] Add ability to split each token into seperate node
- [ ] Inferencing layer cutoff
- [ ] Causal tracing
- [ ] Knowledge editing
- [ ] Basic Layernorm visuals (what would be useful?)
- [ ] Text pane batch input
- [ ] Full dataset input
- [ ] Autoencoder polysemic decoding
- [ ] Display wide batch selector
- [ ] Jupyter popups
- [ ] Notebook autosaving
- [ ] Notebook bring in all jupyterlab features
- [ ] Websockets for push pull state between py/js
- [ ] Move to vector logical clocks for everything
- [ ] Custom model support
- [ ] Select many nodes and multi-node selection menus
- [ ] Research replication using transpector
- [ ] Ability to add notes to activations, weights and nodes



### Milestone 1
- [ ] Add icons on the edges
- [ ] Node resizing and rerendering (for canvas nodes)
- [ ] Weight Analysis: Visualise weights
- [ ] Weight Analysis: What is the OV circuit trying to copy given a token
- [ ] Weight Analysis: What is the KQ circuit attention position distribution 
- [ ] Visual layer folding
- [ ] Pattern visual grouping
- [ ] Layer and node type filters
- [ ] Minimap collision with text pane
- [ ] Optimisation: WebGPU rendering
- [ ] Optimisation: Remove dead data
- [ ] Non blocking model updating
- [ ] KQV composition visualisation
- [ ] Residual stream analysis visualisation
- [ ] Notebook scrolling bugs
- [ ] Improve typing coverage
- [ ] Improve global state control
- [ ] Next static export
- [ ] Python package 
- [ ] Make gifs of features
- [ ] Compute/ GPU flags/controls from UI
- [ ] Add correct shortformer positional embedding links
- [ ] Move to same data structure in py/ js and ws for syncing
- [ ] Add in app credits
- [ ] Individual activation level ablations
- [ ] Basic MLP visuals (what would be useful?)
- [x] Ablations
- [x] Canvas summed pattern and result rendering
- [x] Add readme credits
- [x] Model Outputs
- [x] MLP nodes
- [x] Layernorm nodes
- [x] Text pane visibility
- [x] Notebook loading pre existing kernel
- [x] Upgrade model selection pane
- [x] Python kickoff script
- [x] Model Pane Upgrade
- [x] Nodes disabled, default and highlighted feature
- [x] Jupyter-UI upgrade
- [x] Refactor Nodes and edges code
- [x] Layernaming bugs
- [x] Visual spacing optimisation
- [x] Layer groups
- [x] Attention head nodes
- [x] Combined attention node
- [x] Text input node
- [x] Tokenization node
- [x] Residual stream node
- [x] Attention text visualisation


## Credits
This work has only been possible through the usage of Transformer Lens by Neel Nanda and has been heavily inspired by circuitviz by Alan Cooney