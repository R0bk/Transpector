# Transpector

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

- [ ] Ablations
- [ ] MLP nodes
- [ ] Layernorm nodes
- [ ] Refactor Nodes and edges code
- [ ] Add ability to split each token into seperate node
- [ ] Model Outputs
- [ ] Add icons on the edges
- [ ] Node resizing and rerendering (for canvas nodes)
- [ ] Weight Analysis: Visualise weights
- [ ] Weight Analysis: Matrix Factorisation
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
- [ ] Residual effect visualisation
- [ ] Jupyter-UI upgrade and non dynamic import
- [ ] Notebook autosaving
- [ ] Notebook scrolling bugs
- [ ] Notebook bring in all jupyterlab features
- [ ] Websocket connection for push pull state between py/js
- [ ] Improve typing coverage
- [ ] Improve global state control
- [ ] Next static export
- [ ] Python kickoff script
- [ ] Python package 
- [ ] Make gifs of features
- [ ] Custom model support
- [ ] GPU flag

