# 🔬 Transpector
Visually inspect, analyse and debug transformer models. Aimed at reducing cycle times for interpretability research and lowering the barrier to entry.
## Getting Started

To use Transpector first install the package `pip install transpector` then you can start it from the command line with `transpector`. Once it's ready, navigate to `http://127.0.0.1:8000/index.html` to get started.

#### Using Transpector

Coming soon!
## Developing locally

For efficient development, we want to enable hot reloading of both the typescript and python sides. We can do this for py by `pip install -e .` (from the root directory of this project) to install the python package based out of this directory, meaning when we change a file in this dir we also change the package. From the next.js TS side we can start up a dev server using `npm run dev`, (also in the root dir of this project as per the pip install). This will be hosted at a different point (currently `:80`) but will proxy all api requests to the same port where the standard python backend runs, so if you are only working on the TS you can just use the `transpector` command to start up the backend.

A short note on the py backend, you can examine how transpector starts by looking through launch.py, but in breif:

1. We start a jupyter-server in a thread
1. Connect to it through http
1. Create a IPython kernal and start it
1. Connect to it through websockets
1. Load our starter notebook
1. Execute the first few cells in the starter notebook, loading our model of interest
1. Execute the last few cells in our starter notebook, spawning a fastAPI backend in the same event loop as the IPython Kernal
1. Host our static bundle of next.js along with our backend api from that fastAPI backend

To run Next JS
```bash
npm run dev
```

To manually launch the python side
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
transpector
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
- [ ] Edge editing to reflect in model computations
- [ ] Architecture diagram
- [ ] Add correct shortformer positional embedding links
- [ ] Research replication using transpector
- [ ] Ability to add notes to activations, weights and nodes



#### Milestone 1️⃣
- [ ] Add icons on the edges
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
- [ ] Improve global state control
- [ ] Compute/ GPU flags/controls from UI
- [ ] Move to same data structure in py/ js and ws for syncing
- [ ] Basic usage tutorial
- [ ] Make gifs of features
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
- [x] Notebook scrolling bugs
- [x] Pypi package
- [x] Upgrade model selection pane
- [x] Improve typing coverage
- [x] Next static export
- [x] Python kickoff script
- [x] Python static hosting
- [x] Python package 
- [x] Model Pane Upgrade
- [x] Nodes disabled, default and highlighted feature
- [x] Jupyter-UI upgrade
- [x] Node resizing and rerendering (for canvas nodes)
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