from typing import Callable
from transformer_lens import HookedTransformer, HookedTransformerConfig, ActivationCache
from transformer_lens.hook_points import HookPoint
from transformer_lens.loading_from_pretrained import OFFICIAL_MODEL_NAMES, get_pretrained_model_config
from jaxtyping import Float
import torch as t
import torch.nn.functional as F

Logits = Float[t.Tensor, "batch position d_vocab"]
Tokens = Float[t.Tensor, "batch position"]

def get_available_models() -> list[HookedTransformerConfig]:
    return [get_pretrained_model_config(m) for m in OFFICIAL_MODEL_NAMES]

def load_model(model_name: str):
    return HookedTransformer.from_pretrained(model_name)
    
def per_token_losses(logits: Logits, tokens: Tokens):
    log_probs = F.log_softmax(logits, dim=-1)
    pred_log_probs = t.gather(log_probs[:, :-1], -1, tokens[:, 1:, None])[..., 0]
    return -pred_log_probs[0]

def sliceByMinShape(*tensors: t.Tensor):
    return [slice(0, r) for r in min([t.shape for t in tensors])]

pattern_hook_names_filter: Callable[[str], bool] = lambda name: name.endswith("pattern")
