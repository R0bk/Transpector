from model_setup import *
from transformer_lens import HookedTransformerConfig, ActivationCache
from transformer_lens.loading_from_pretrained import OFFICIAL_MODEL_NAMES, get_pretrained_model_config
from jaxtyping import Float

Logits = Float[t.Tensor, "batch", "position", "d_vocab"]

def get_available_models() -> list[HookedTransformerConfig]:
    return [get_pretrained_model_config(m) for m in OFFICIAL_MODEL_NAMES]

def load_model(model_name: str):
    return HookedTransformer.from_pretrained(model_name)
    
def per_token_losses(logits: Logits, tokens):
    log_probs = F.log_softmax(logits, dim=-1)
    pred_log_probs = t.gather(log_probs[:, :-1], -1, tokens[:, 1:, None])[..., 0]
    return -pred_log_probs[0]

def sliceByMinShape(*tensors: t.Tensor):
    return [slice(0, r) for r in min([t.shape for t in tensors])]

pattern_hook_names_filter = lambda name: name.endswith("pattern")

# gpt2_small.run_with_hooks(
#     rep_tokens_10, 
#     return_type=None, # For efficiency, we don't need to calculate the logits
#     fwd_hooks=[(
#         pattern_hook_names_filter,
#         induction_score_hook_filter
#     )]
# )

# gpt2_small = HookedTransformer.from_pretrained("gpt2-small")
# model_description_text = '''## Loading Models

# HookedTransformer comes loaded with >40 open source GPT-style models. You can load any of them in with `HookedTransformer.from_pretrained(MODEL_NAME)`. Each model is loaded into the consistent HookedTransformer architecture, designed to be clean, consistent and interpretability-friendly. 

# For this demo notebook we'll look at GPT-2 Small, an 80M parameter model. To try the model the model out, let's find the loss on this paragraph!'''

# loss, cache = gpt2_small.run_with_cache(model_description_text, return_type="loss")
# print(loss)



# from torchviz import make_dot
# print({x: y for x, y in gpt2_small.named_parameters()})
# print(len(list(gpt2_small.named_parameters())))
# print(cache.keys())
# dot = make_dot(loss)
# dot.format = 'png'
# dot.render('torchviz-sample')
# print("Model loss:", loss)
# print(gpt2_small.to_str_tokens("gpt2"))             # --> ['<|endoftext|>', 'g', 'pt', '2']
# print(gpt2_small.to_tokens("gpt2"))                 # --> tensor([[50256, 70, 457, 17]], device='cuda:0')
# print(gpt2_small.to_string([50256, 70, 457, 17]))   # --> '<|endoftext|>gpt2'