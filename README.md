# 🔬 Transpector
Visually inspect, analyse and debug transformer models. Aimed at accelerating interpretability research and reducing the barrier to entry.

![](https://github.com/R0bk/Transpector/blob/main/docs/transpector1.gif)
## Getting Started
### Using Transpector
To use Transpector first install the package `pip install transpector` then you can start it from the command line with `transpector`. Once it's ready, navigate to `http://127.0.0.1:8000/index.html` to get started.

### Features
Analyse, ablate and freeze attention heads (See what each head is predicting below).
![](https://github.com/R0bk/Transpector/blob/main/docs/transpector2.gif)

Patch activations from heads, residuals, keys or any node by drawing connections.
![](https://github.com/R0bk/Transpector/blob/main/docs/transpector5.gif)

Analyse loss (See how loss drops on a random repeated sequence below).
![](https://github.com/R0bk/Transpector/blob/main/docs/transpector3.gif)

Select any model supported by Transformer Lens (some models e.g. shortformers aren't fully supported as of yet).
![](https://github.com/R0bk/Transpector/blob/main/docs/transpector4.gif)

Interactive jupyter notebook for codeing and adding custom hooks to be reflected into Transpector.
![](https://github.com/R0bk/Transpector/blob/main/docs/transpector6.gif)

### Supported Models
The GPT-2, Pythia, Opt, Llama and several other common model families are supported. Please the full listing [here](https://github.com/R0bk/Transpector/blob/main/docs/supportedModels.md)

### Motivations
Through determined effort [several](https://arxiv.org/abs/2211.00593) [groups](https://arxiv.org/abs/2301.05217) [have](https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html) (not exhaustive, only illustrative) been able to decode probable circuits and algorithms within transformers. Doing so has required significant technical knowledge, experience and time. This, in my eyes doesn't necessarily have to be true hence the foundational question of transpector - How can we reduce the iteration time and barrier of entry for useful mechanistic analysis of transformer models?

## Contributing and Developing locally

### Contributing

Transpector's code base is designed to be extended, and it's easy too see how much opportunity there is to take it further. So if you've got some great ideas, want to tie in your research, or just help out with the todo list, please join in!

### Developing locally

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
- [ ] ROME/ MEMIT style search and replace engine for MLP knowledge
- [ ] Automatic node graph generation based on model graph
- [ ] [Ability to mix in copy and mix in pinned activations](https://www.alignmentforum.org/posts/5spBue2z2tw4JuDCx/steering-gpt-2-xl-by-adding-an-activation-vector)
- [ ] Add ability to split each token into seperate node
- [ ] Inferencing layer cutoff (both where to start and end)
- [ ] Add graident visualisations (What would be useful here?)
- [ ] Basic Layernorm visuals (what would be useful?)
- [ ] Individual activation level ablations
- [ ] Autoencoder polysemic decoding node attachment
- [ ] Text pane batch input
- [ ] Dataset upload and controls
- [ ] Batch example selector across app
- [ ] Jupyter cell popups for adding mid model hooks
- [ ] Notebook autosaving
- [ ] Notebook bring in all jupyterlab features
- [ ] Websockets for push pull state between py/js
- [ ] Move to vector logical clocks for everything
- [ ] Multi-node selection menu
- [ ] Architecture diagram
- [ ] Add correct shortformer positional embedding links
- [ ] Research replication using transpector
- [ ] Ability to add notes to activations, weights and nodes

#### Milestone 1️⃣
- [ ] Add icons on the edges
- [ ] Weight Analysis: Visualise weights (What would be useful?)
- [ ] Weight Analysis: What is the OV circuit trying to copy given a token
- [ ] Weight Analysis: What is the KQ circuit attention position distribution 
- [ ] Visual layer folding
- [ ] Attention pattern similarity search
- [ ] Layer and node type filters
- [ ] Residual stream analysis visualisation
- [ ] Move to same data structure in py/ js and ws for syncing
- [ ] Compute/ GPU flags/controls from UI
- [ ] Basic MLP visuals (what would be useful? Dictionary learning, key-value? Neuron view?)
- [x] Edge editing automatically performs patching
- [x] Activation freezing
- [x] Ablations
- [x] Canvas summed pattern and result rendering
- [x] Add readme credits
- [x] Model Outputs
- [x] MLP nodes
- [x] KQV basic visualisation
- [x] Layernorm nodes
- [x] Notebook loading pre existing kernel
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
- [x] Layer groups
- [x] Attention head nodes
- [x] Combined attention node
- [x] Text input node
- [x] Tokenization node
- [x] Residual stream node
- [x] Attention text visualisation

### Chores
- [ ] Basic usage tutorial
- [ ] Minimap collision with text pane
- [ ] Reloading webpage loses some state
- [ ] Optimisation: OffscreenCanvas
- [ ] Optimisation: WebGPU rendering
- [ ] Optimisation: Remove dead data
- [ ] Non blocking model updating
- [ ] Non blocking rendering
- [ ] Improve global state control
- [ ] Favicon
- [ ] Settings pane
- [ ] Support running on remote servers
- [ ] Support import into standard notebook
- [ ] Make gif of resizing
- [ ] Keyboard shortcuts
- [ ] Add in app credits
- [x] Make gif of patching
- [x] Make gif of notebook
- [x] Cleanup slices
- [x] Cleanup activation passing
- [x] Node resizing for all visual nodes
- [x] Make gifs for each key feature
- [x] Launcher cleanup
- [x] Make main gif
- [x] Text pane visibility
- [x] Model selection bugs
- [x] Layernaming bugs
- [x] Notebook scrolling bugs
- [x] Visual spacing optimisation



## Credits
This work has only been possible through the usage of Transformer Lens by Neel Nanda (also thanks to Redwood Research for Easy Transformer). It has also been heavily inspired by circuitviz by Alan Cooney and Anthropic's visualisation work.


## Citation
If transpector aided in your research, you can cite transpector as:

```
@misc{kopeltranspector,
    title  = {Transpector},
    author = {Kopel, Rob},
    url    = {https://github.com/R0bk/Transpector},
    year   = {2023}
}
```

Furthermore, please look through the above credits as transpector would not be possible without them. If you have any questions or would like to collaborate please feel free  to reach out to me at rob.kopel on gmail.