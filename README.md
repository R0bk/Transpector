# 🔬 Transpector
Visually inspect, analyse and debug transformer models. Aimed at reducing cycle times for interpretability research and lowering the barrier to entry.
## Getting Started

To use Transpector first install the package `pip install transpector` then you can start it from the command line with `transpector`. Once it's ready, navigate to `http://127.0.0.1:8000/index.html` to get started.

#### Using Transpector

Coming soon!
## Developing locally

In it's development setting currently you have to run two parts, a python script kicking off Jupyter Server (this spawns a fastAPI backend in the same event loop as the IPython Kernal), and a Next JS Server. Next JS will be compiled and served as a static file from fastAPI eventually.

To run Next JS
```bash
npm run dev
```

To launch the python side
```bash
python launch.py
```

### Building the package

First build the next js into a static output doing
```
npm run build
```

Then copy the static out folder from `./out` to `./transpector/frontend_dist`.

Now you can build the python package by doing.

```
python setup.py bdist_wheel sdist
```
You should see that the static files are included in the distribution from the output from the build command. Now we can install the package using

```
pip install dist/<build-name>
```

And finally, use our installed package to run the server:
```
transpector run
```

## To Do

#### Milestone 2️⃣
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



#### Milestone 1️⃣
- [ ] Add icons on the edges
- [ ] Node resizing and rerendering (for canvas nodes)
- [ ] Weight Analysis: Visualise weights
- [ ] Weight Analysis: What is the OV circuit trying to copy given a token
- [ ] Weight Analysis: What is the KQ circuit attention position distribution 
- [ ] Visual layer folding
- [ ] Activation freezing
- [ ] Pattern visual grouping
- [ ] Layer and node type filters
- [ ] Minimap collision with text pane
- [ ] Optimisation: WebGPU rendering
- [ ] Optimisation: Remove dead data
- [ ] Non blocking model updating
- [ ] KQV composition visualisation
- [ ] Residual stream analysis visualisation
- [ ] Notebook scrolling bugs
- [ ] Improve global state control
- [ ] Compute/ GPU flags/controls from UI
- [ ] Add correct shortformer positional embedding links
- [ ] Move to same data structure in py/ js and ws for syncing
- [ ] Basic usage tutorial
- [ ] Make gifs of features
- [ ] Baisc architecture diagram
- [ ] Pypi package
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
- [x] Improve typing coverage
- [x] Next static export
- [x] Python kickoff script
- [x] Python static hosting
- [x] Python package 
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