import plotly.express as px
# import plotly.io as pio
import plotly.graph_objects as go
# pio.renderers.default = "notebook_connected" # or use "browser" if you want plots to open with browser
import torch as t
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import einops
from fancy_einsum import einsum
from torchtyping import TensorType as TT
from typing import List, Optional, Callable, Tuple, Union
import functools
from tqdm import tqdm
# from IPython.display import display

from transformer_lens.hook_points import HookPoint
from transformer_lens import utils, HookedTransformer, HookedTransformerConfig, FactoredMatrix, ActivationCache
import circuitsvis as cv

# Saves computation time, since we don't need it for the contents of this notebook
t.set_grad_enabled(False)

def imshow(tensor, renderer=None, xaxis="", yaxis="", caxis="", **kwargs):
    return px.imshow(utils.to_numpy(tensor), color_continuous_midpoint=0.0, color_continuous_scale="RdBu", labels={"x":xaxis, "y":yaxis, "color":caxis}, **kwargs)

def line(tensor, renderer=None, xaxis="", yaxis="", **kwargs):
    return px.line(utils.to_numpy(tensor), labels={"x":xaxis, "y":yaxis}, **kwargs)

def scatter(x, y, xaxis="", yaxis="", caxis="", renderer=None, **kwargs):
    x = utils.to_numpy(x)
    y = utils.to_numpy(y)
    return px.scatter(y=y, x=x, labels={"x":xaxis, "y":yaxis, "color":caxis}, **kwargs)

def plot_comp_scores(model: HookedTransformer, comp_scores: TT["heads", "heads"], title: str = "", baseline: Optional[t.Tensor] = None) -> go.Figure:
    return px.imshow(
        utils.to_numpy(comp_scores),
        y=[f"L0H{h}" for h in range(model.cfg.n_heads)],
        x=[f"L1H{h}" for h in range(model.cfg.n_heads)],
        labels={"x": "Layer 1", "y": "Layer 0"},
        title=title,
        color_continuous_scale="RdBu" if baseline is not None else "Blues",
        color_continuous_midpoint=baseline if baseline is not None else None,
        zmin=None if baseline is not None else 0.0,
    )

# def enable_plotly_in_cell():
#   import IPython
#   from plotly.offline import init_notebook_mode
#   display(IPython.core.display.HTML('''<script src="/static/components/requirejs/require.js"></script>'''))
#   init_notebook_mode(connected=False)

t.set_grad_enabled(False)

def solutions_get_ablation_scores(model: HookedTransformer, tokens: TT["batch", "seq"]) -> TT["n_layers", "n_heads"]:
    ablation_scores = t.zeros((model.cfg.n_layers, model.cfg.n_heads), device=model.cfg.device)
    logits = model(tokens, return_type="logits")
    loss_no_ablation = cross_entropy_loss(logits, tokens)
    for layer in tqdm(range(model.cfg.n_layers)):
        for head in range(model.cfg.n_heads):
            temp_hook_fn = functools.partial(head_ablation_hook, head_index_to_ablate=head)
            patched_logits = model.run_with_hooks(tokens, fwd_hooks=[
                (utils.get_act_name("result", layer), temp_hook_fn)
            ])
            loss = cross_entropy_loss(patched_logits, tokens)
            ablation_scores[layer, head] = loss - loss_no_ablation
    return ablation_scores

def solutions_mask_scores(attn_scores: TT["query_d_model", "key_d_model"]):
    mask = t.tril(t.ones_like(attn_scores)).bool()
    neg_inf = t.tensor(-1.0e6).to(attn_scores.device)
    masked_attn_scores = t.where(mask, attn_scores, neg_inf)
    return masked_attn_scores

def solutions_decompose_attn_scores(decomposed_q: t.Tensor, decomposed_k: t.Tensor) -> t.Tensor:
    return einsum("q_comp q_pos d_model, k_comp k_pos d_model -> q_comp k_comp q_pos k_pos", decomposed_q, decomposed_k)

def solutions_find_K_comp_full_circuit(model: HookedTransformer, prev_token_head_index: int, ind_head_index: int) -> FactoredMatrix:
    W_E = model.W_E
    W_Q = model.W_Q[1, ind_head_index]
    W_K = model.W_K[1, ind_head_index]
    W_O = model.W_O[0, prev_token_head_index]
    W_V = model.W_V[0, prev_token_head_index]
    Q = W_E @ W_Q
    K = W_E @ W_V @ W_O @ W_K
    return FactoredMatrix(Q, K.T)

def solutions_get_comp_score(
    W_A: TT["in_A", "out_A"], 
    W_B: TT["out_A", "out_B"]
) -> float:
    W_A_norm = W_A.pow(2).sum().sqrt()
    W_B_norm = W_B.pow(2).sum().sqrt()
    W_AB_norm = (W_A @ W_B).pow(2).sum().sqrt()
    return (W_AB_norm / (W_A_norm * W_B_norm)).item()

def test_get_ablation_scores(ablation_scores: TT["layer", "head"], model: HookedTransformer, rep_tokens: TT["batch", "seq"]):
    ablation_scores_expected = solutions_get_ablation_scores(model, rep_tokens)
    t.testing.assert_close(ablation_scores, ablation_scores_expected)
    print("All tests in `test_get_ablation_scores` passed!")

def test_full_OV_circuit(OV_circuit: FactoredMatrix, model: HookedTransformer, layer: int, head: int):
        W_E = model.W_E
        W_OV = FactoredMatrix(model.W_V[layer, head], model.W_O[layer, head])
        W_U = model.W_U
        OV_circuit_expected = W_E @ W_OV @ W_U
        t.testing.assert_close(OV_circuit.get_corner(20), OV_circuit_expected.get_corner(20))
        print("All tests in `test_full_OV_circuit` passed!")

def test_pos_by_pos_pattern(pattern: TT["n_ctx", "n_ctx"], model: HookedTransformer, layer: int, head: int):
    W_pos = model.W_pos
    W_QK = model.W_Q[layer, head] @ model.W_K[layer, head].T
    score_expected = W_pos @ W_QK @ W_pos.T
    masked_scaled = solutions_mask_scores(score_expected / model.cfg.d_head ** 0.5)
    pattern_expected = t.softmax(masked_scaled, dim=-1)
    t.testing.assert_close(pattern[:50, :50], pattern_expected[:50, :50])
    print("All tests in `test_full_OV_circuit` passed!")

def test_decompose_attn_scores(decompose_attn_scores: Callable, q: t.Tensor, k: t.Tensor):
    decomposed_scores = decompose_attn_scores(q, k)
    decomposed_scores_expected = solutions_decompose_attn_scores(q, k)
    t.testing.assert_close(decomposed_scores, decomposed_scores_expected)
    print("All tests in `test_decompose_attn_scores` passed!")

def test_find_K_comp_full_circuit(find_K_comp_full_circuit: Callable, model: HookedTransformer):
    K_comp_full_circuit: FactoredMatrix = find_K_comp_full_circuit(model, 7, 4)
    K_comp_full_circuit_expected: FactoredMatrix = solutions_find_K_comp_full_circuit(model, 7, 4)
    assert isinstance(K_comp_full_circuit, FactoredMatrix), "Should return a FactoredMatrix object!"
    t.testing.assert_close(K_comp_full_circuit.get_corner(20), K_comp_full_circuit_expected.get_corner(20))
    print("All tests in `test_find_K_comp_full_circuit` passed!")

def test_get_comp_score(get_comp_score: Callable):
    W_A = t.rand(3, 4)
    W_B = t.rand(4, 5)
    comp_score = get_comp_score(W_A, W_B)
    comp_score_expected = solutions_get_comp_score(W_A, W_B)
    assert isinstance(comp_score, float)
    assert abs(comp_score - comp_score_expected) < 1e-5
    print("All tests in `test_get_comp_score` passed!")