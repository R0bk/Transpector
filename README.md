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

- [ ] Add ability to split each token into seperate node
- [ ] Add icons on the edges
- [ ] Node resizing and rerendering (for canvas nodes)
- [ ] Weight Analysis: Visualise weights
- [ ] Weight Analysis: What is the OV circuit trying to copy given a token
- [ ] Weight Analysis: What is the KQ circuit attention position distribution 
- [ ] Inferencing layer cutoff
- [ ] Causal tracing
- [ ] Knowledge editing
- [ ] Visual layer folding
- [ ] Pattern visual grouping
- [ ] Model Pane Upgrade
- [ ] Layer and node type filters
- [ ] Minimap collision with text pane
- [ ] Text pane visibility
- [ ] Text pane batch input
- [ ] Full dataset input
- [ ] Autoencoder polysemic decoding
- [ ] Research replication using transpector
- [ ] Optimisation: GPU rendering
- [ ] Optimisation: Remove dead data
- [ ] Visual spacing optimisation
- [ ] Non blocking model updating
- [ ] Display wide batch selector
- [ ] Jupyter popups
- [ ] KQV composition visualisation
- [ ] Residual stream analysis visualisation
- [ ] Notebook autosaving
- [ ] Notebook scrolling bugs
- [ ] Notebook bring in all jupyterlab features
- [ ] Websockets for push pull state between py/js
- [ ] Improve typing coverage
- [ ] Improve global state control
- [ ] Next static export
- [ ] Python kickoff script
- [ ] Python package 
- [ ] Make gifs of features
- [ ] Custom model support
- [ ] GPU flag
- [ ] Add correct shortformer positional embedding links
- [ ] Select many nodes
- [ ] Nodes disabled, default and highlighted feature
- [ ] Move to same data structure in py/ js and ws for syncing
- [ ] Add in app credits
- [ ] Individual activation level ablations
- [x] Ablations
- [x] Canvas summed pattern and result rendering
- [x] Add readme credits
- [x] Model Outputs
- [x] MLP nodes
- [x] Layernorm nodes
- [x] Notebook loading pre existing kernel
- [x] Jupyter-UI upgrade
- [x] Refactor Nodes and edges code
- [x] Layernaming bugs

## Credits
This work has only been possible through the usage of Transformer Lens by Neel Nanda and has been heavily inspired by circuitviz by Alan Cooney