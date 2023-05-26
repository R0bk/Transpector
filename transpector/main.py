# uvicorn main:app --reload
# from typing import Union

from functools import partial
from typing import Any, Callable, Literal, Optional, Union, Sequence
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from torchtyping import TensorType as TT
from model import get_available_models, get_pretrained_model_config, load_model, ActivationCache, HookPoint, Logits, per_token_losses, TensorType

app = FastAPI()

NamesFilter = Optional[Union[Callable[[str], bool], Sequence[str]]]
Hook = tuple[Union[str, Callable[..., Any]], Callable[..., Any]]


SliceType = list[int] # [from, to]
AblationTypes = Literal['zero', 'freeze']
ModelComponent = str
SliceName = str
AblationSliceComponents = Literal['slice', 'ablationType']
AblationsType = dict[ModelComponent, dict[SliceName, dict[AblationSliceComponents, list[SliceType] | AblationTypes ] ] ]



class Modelling:
    def __init__(self):
        self.logical_clock = 0

        self.model_name: str = 'gpt2'
        self.model = load_model(self.model_name)
        self.model_config = get_pretrained_model_config(self.model_name)
        self.available_models = get_available_models()
        self.last_prompt: list[str] = []

        self.ablations: AblationsType = {}
        self.fwd_ablation_hooks: list[Hook] = []
        self.bwd_ablation_hooks: list[Hook] = []

    @property
    def session_config(self):
        return {
            "model_config": self.model_config,
            "ablations": self.ablations
        }
    
    def set_model(self, model_name: str):
        self.model_name = model_name
        self.model = load_model(self.model_name)
        self.model_config = get_pretrained_model_config(self.model_name)

    def run_with_hooks(
            self,
            prompt,
            custom_fwd_hooks: Optional[list[Hook]]=None,
            custom_bwd_hooks: Optional[list[Hook]]=None,
            names_filter: NamesFilter = None,
            device: Optional[str]=None,
            remove_batch_dim: bool=False,
            incl_bwd: bool=False,
            reset_hooks_end: bool=True,
            clear_contexts: bool=False,
        ):
        cache_dict, fwd, bwd = self.model.get_caching_hooks(
            names_filter, incl_bwd, device, remove_batch_dim=remove_batch_dim
        )

        if custom_fwd_hooks:
            fwd.extend(custom_fwd_hooks)

        if custom_bwd_hooks:
            bwd.extend(custom_bwd_hooks)

        print('forward ablation hooks are')
        print(self.fwd_ablation_hooks)
        fwd = [*self.fwd_ablation_hooks, *fwd, *self.fwd_ablation_hooks]
        bwd.extend(self.bwd_ablation_hooks)
        print()
        print(fwd)


        with self.model.hooks(
            fwd_hooks=fwd,
            bwd_hooks=bwd,
            reset_hooks_end=reset_hooks_end,
            clear_contexts=clear_contexts,
        ):
            model_out_logits, model_out_loss = self.model(prompt, return_type='both')
            if incl_bwd:
                model_out.backward()

        return model_out_logits, model_out_loss, cache_dict
    
    def ablation_hook(
        self,
        result: TensorType,
        hook: HookPoint,
        slices: list[SliceType],
        ablation_type: AblationTypes='zero',
    ) -> TensorType:
        py_slice = [slice(r[0], r[1] if r[1]!=-1 else None) for r in slices]
        
        if ablation_type == 'zero':
            result[py_slice] = 0.0

        return result

    def head_ablation_hook(
        self,
        attn_result: TT["batch", "seq", "n_heads", "d_model"],
        hook: HookPoint,
    ) -> TT["batch", "seq", "n_heads", "d_model"]:
        
        layer: int = hook.layer()
        if layer in self.ablation_heads:
            attn_result[:, :, self.ablation_heads[layer], :] = 0.0

        return attn_result


    @classmethod
    def clean_cache(cls, cache: ActivationCache):
        """
        # Attrs to keep
        'hook_embed',
        'hook_pos_embed',
        'blocks.*.hook_resid_pre',
        'blocks.*.attn.hook_q',
        'blocks.*.attn.hook_k',
        'blocks.*.attn.hook_v',
        'blocks.*.attn.hook_pattern',
        'blocks.*.attn.hook_z',
        'blocks.*.hook_attn_out',
        'blocks.*.hook_resid_mid',
        'blocks.*.hook_mlp_out',
        'blocks.*.hook_resid_post',
        'ln_final.hook_scale',
        'ln_final.hook_normalized'

        # Attrs to remove
        'blocks.*.ln1.*'
        'blocks.*.ln2.*'
        'blocks.*.attn.hook_attn_scores',
        'blocks.*.mlp.hook_pre',
        'blocks.*.mlp.hook_post',
        """
        cache_copy = {}
        for key, value in cache.items():
            match key.split('.'):
                case ['hook_embed'] | ['hook_pos_embed'] | ['ln_final', 'hook_normalized']:
                    cache_copy[key] = value.tolist()
                case ['blocks', blockno, ('hook_resid_pre' | 'hook_attn_out' | 'hook_resid_mid' | 'hook_mlp_out' | 'hook_resid_post')]:
                    cache_copy[key] = value.tolist()
                case ['blocks', blockno, 'attn', ('hook_q' | 'hook_k' | 'hook_v' | 'hook_z' | 'hook_pattern')]:
                    cache_copy[key] = value.tolist()

        return cache_copy
    
    def clean_logits(self, logits: Logits):
        output_tokens: list[list[int]] = logits.argmax(dim=-1).squeeze()[:-1]
        if output_tokens.dim() == 1:
            output_tokens = output_tokens.unsqueeze(0)

        output_sub_words = [self.model.to_str_tokens(t) for t in output_tokens]
        output_logits: list[list[list[float]]] = logits.tolist()

        return  output_tokens.tolist(), output_sub_words, output_logits

    @classmethod
    def clean_loss(cls, loss: TensorType) -> float:
        return loss.item()
    
    @classmethod
    def clean_token_loss(cls, loss: TensorType) -> list[list[float]]:
        return loss.tolist()


ts = Modelling()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/api/models/getModels")
def get_models(): 
    return ts.available_models

@app.get("/api/models/getModelConfig/{model_name}")
def get_model_config(model_name: str): 
    return {
        "config": get_pretrained_model_config(model_name),
        "sessionConfig": ts.session_config 
    }

class ModelItem(BaseModel):
    model_name: str

@app.put("/api/models/setModel")
def set_models(model_name: ModelItem):
    print(f'Loading model: {model_name.model_name}')
    ts.set_model(model_name.model_name)
    print('Loaded model')
    return {"Loaded model": model_name}

class InputStringListItem(BaseModel):
    input: list[str]

class InputIntListItem(BaseModel):
    input: list[int]

@app.put("/api/tokenize/toStringTokens")
def tokenize_to_string_tokens(inputItem: InputStringListItem):
    return {"stringTokens": ts.model.to_str_tokens(inputItem.input)}

@app.put("/api/tokenize/toTokens")
def tokenize_to_tokens(inputItem: InputStringListItem) -> dict[str, list[list[int]]]:
    print('tokenizing', inputItem.input)
    ts.last_prompt = inputItem.input
    print('tokenizing', ts.model.to_tokens(inputItem.input).tolist())
    return {"tokens": ts.model.to_tokens(inputItem.input).tolist()}

@app.put("/api/tokenize/toString")
def tokenize_to_string(inputItem: InputIntListItem):
    return {"string": ts.model.to_tokens(inputItem.input)}


@app.get("/api/inference/run")
def inference_run():
    prompt = ts.last_prompt
    sub_words = ts.model.to_str_tokens(prompt)

    logits, loss, cache = ts.run_with_hooks(prompt)
    print('logtis are')
    print(logits)
    out_cache = ts.clean_cache(cache)
    out_tokens, out_sub_words, out_logits = ts.clean_logits(logits)
    out_final_loss = ts.clean_loss(loss)
    out_token_loss = ts.clean_token_loss(per_token_losses(logits, ts.model.to_tokens(prompt)))
    return {
        "activationData": out_cache,
        "inferencePrompt": prompt,
        "inferenceSubWords": sub_words,
        "logits": out_logits,
        "tokens": out_tokens,
        "subWords": out_sub_words,
        "finalLoss": out_final_loss,
        "tokenLoss": out_token_loss,
    }
    
class InputAblationState(BaseModel):
    ablations: AblationsType
    clientLogicalClock: int


@app.put("/api/ablation/sync")
def ablation_sync(input: InputAblationState):
    print('input', input)
    if input.clientLogicalClock >= ts.logical_clock:
        print('Im here')
        ts.logical_clock += 1

        ts.fwd_ablation_hooks = []

        for transformer_component_name, component_slices in input.ablations.items():
            print('transformer comp', transformer_component_name)
            print('transformer comp', component_slices)
            for _, hook_config in component_slices.items():
                print('hook config', hook_config)
                ablation_hook = partial(ts.ablation_hook, slices=hook_config['slice'], ablation_type=hook_config['ablationType'])
                ts.fwd_ablation_hooks.append((transformer_component_name, ablation_hook))

        ts.ablations = input.ablations

    return {
        "server_logical_clock": ts.logical_clock,
        "ablations": ts.ablations
    }

app.mount("/", StaticFiles(directory="/frontend_dist", html=True), name="out")
