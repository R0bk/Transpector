# uvicorn main:app --reload
from bisect import insort
from functools import partial
from typing import Any, Callable, Literal, Optional, Union, Sequence, TypedDict
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from transpector.model import get_available_models, get_pretrained_model_config, load_model, HookPoint, Logits, per_token_losses, sliceByMinShape
from jaxtyping import Integer, Float
import torch as t

app = FastAPI()

HookName = str
Cache = dict[HookName, t.Tensor]

NamesFilter = Optional[Union[Callable[[str], bool], Sequence[str]]]
Hook = tuple[Union[HookName, Callable[..., Any]], Callable[..., Any]]


ModelComponentName = str # Id of a model compnent as a string
SliceName = str # Id of a slice as a string

Slice = list[int] # Slice of a single dinension[from, to]
TensorSlice = list[Slice] # Slice for a whole tensor
AblationTypes = Literal['zero', 'freeze'] # Types of ablation we support

class ModelComponentSlice(TypedDict):
    slice: TensorSlice
ModelComponent = dict[ModelComponentName, dict[SliceName, ModelComponentSlice]]

class AblationSliceComponents(TypedDict):
    slice: TensorSlice
    ablationType: AblationTypes
AblationsType = dict[ModelComponentName, dict[SliceName, AblationSliceComponents]]

ablation_priority: dict[AblationTypes, int] = {'freeze': 1, 'zero': 2}

class PatchSliceComponents(TypedDict):
    slice: TensorSlice
    edges: ModelComponent
PatchesType = dict[ModelComponentName, dict[SliceName, PatchSliceComponents]]



class Modelling:
    def __init__(self):
        self.logical_clock = 0

        self.model_name: str = 'gpt2'
        self.model = load_model(self.model_name)
        self.model_config = get_pretrained_model_config(self.model_name)
        self.available_models = get_available_models()
        self.last_prompt: list[str] = []

        self.live_cache: Cache = {}
        self.last_cache: Cache = {}

        self.ablations: AblationsType = {}
        self.fwd_ablation_hooks: list[Hook] = []
        self.bwd_ablation_hooks: list[Hook] = []

        self.patches: PatchesType = {}
        self.fwd_patch_hooks: list[Hook] = []
        self.bwd_patch_hooks: list[Hook] = []

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
            prompt: str | list[str],
            custom_fwd_hooks: Optional[list[Hook]]=None,
            custom_bwd_hooks: Optional[list[Hook]]=None,
            names_filter: NamesFilter = None,
            device: Optional[str]=None,
            remove_batch_dim: bool=False,
            incl_bwd: bool=False,
            reset_hooks_end: bool=True,
            clear_contexts: bool=False,
    ):
        """
        Modified version of run_with_hooks from Transformer Lens

        Prompts the model with specified forward and backward hooks and brings in all ablation
        and patching hooks set on the modelling object

        Args:
            prompt: Model prompt, can be batched list or single string 
            custom_fwd_hooks: A list of (name, hook), where name is
                either the name of a hook point or a boolean function on hook names, and hook is the
                function to add to that hook point. Hooks with names that evaluate to True are added
                respectively.
            custom_bwd_hooks: Same as fwd_hooks, but for the backward pass.
            names_filter: Limits the global cache using filter (this may impact ablation and 
                patching hooks)
            device: Device to run the model on
            remove_batch_dim: Strips the batch dimension
            incl_bwd: Enable doing a backward pass in addition to foward
            reset_hooks_end (bool): If True, all hooks are removed at the end, including those added
                during this run. Default is True.
            clear_contexts (bool): If True, clears hook contexts whenever hooks are reset. Default is
                False.

        Note:
            If you want to use backward hooks, set `reset_hooks_end` to False, so the backward hooks
            remain active. This function only runs a forward pass.
        """
        
        _, fwd, bwd = self.model.get_caching_hooks(
            names_filter, incl_bwd, device, remove_batch_dim=remove_batch_dim, cache=self.live_cache
        )

        if custom_fwd_hooks:
            fwd.extend(custom_fwd_hooks)

        if custom_bwd_hooks:
            bwd.extend(custom_bwd_hooks)

        # We want to do ablations before patches and patches before caching activations
        fwd = [*self.fwd_ablation_hooks, *self.fwd_patch_hooks, *fwd]
        bwd = [*self.bwd_ablation_hooks, *self.bwd_patch_hooks, *bwd]

        with self.model.hooks(
            fwd_hooks=fwd,
            bwd_hooks=bwd,
            reset_hooks_end=reset_hooks_end,
            clear_contexts=clear_contexts,
        ):
            model_out_logits, model_out_loss = self.model(prompt, return_type='both')
            if incl_bwd:
                model_out.backward()

        self.last_cache = self.live_cache.copy()
        self.live_cache = {} # Reset live cache after run

        return model_out_logits, model_out_loss, self.last_cache
    
    def patch_hook(
            self,
            result: t.Tensor,
            hook: HookPoint,
            source_component: ModelComponentName,
            source_slice: TensorSlice,
            target_component: ModelComponentName,
            target_slice: TensorSlice,
    ):
        """
        For the purpose of Transpector a patch is a hook that takes an activation from a slice of a
        model component and applies it to a slice of another model component.

        These two components are called the source and the target, source is where the copy happens
        and target is where the paste is applied. To do this we use our cache that has saved the source
        previously and add a hook on the target to apply from the saved cache.
        """

        source_py_slice = [slice(r0, r1 if r1!=-1 else None) for (r0, r1) in source_slice]
        target_py_slice = [slice(r0, r1 if r1!=-1 else None) for (r0, r1) in target_slice]

        if source_component in self.live_cache:
            result[target_py_slice] = self.live_cache[source_component][source_py_slice]
        elif source_component in self.last_cache and \
            result[target_py_slice].shape == self.last_cache[source_component][source_py_slice].shape:
            result[target_py_slice] = self.last_cache[source_component][source_py_slice]

        return result
    
    def ablation_hook(
        self,
        result: t.Tensor,
        hook: HookPoint,
        slices: TensorSlice,
        ablation_type: AblationTypes='zero',
    ) -> t.Tensor:
        assert hook.name
        py_slice = [slice(r0, r1 if r1!=-1 else None) for (r0, r1) in slices]

        if ablation_type == 'zero':
            print('albating', hook.name)
            result[py_slice] = 0.0
        elif ablation_type == 'freeze':
            
            print('freezing', hook.name)
            if hook.name not in self.last_cache:
                self.last_cache[hook.name] = result.clone().detach()

            cache_slice = self.last_cache[hook.name][py_slice]
            res_slice = result[py_slice]
            frozen = t.zeros_like(res_slice)
            frozen[sliceByMinShape(cache_slice, res_slice)] = cache_slice[sliceByMinShape(cache_slice, res_slice)]

            result[py_slice] = frozen

        return result



    @classmethod
    def clean_cache(cls, cache: Cache):
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
        cache_copy: dict[ModelComponentName, Float[list[float], "..."]] = {}
        for key, value in cache.items():
            match key.split('.'):
                case ['hook_embed'] | ['hook_pos_embed'] | ['ln_final', 'hook_normalized']:
                    cache_copy[key] = value.tolist()
                case ['blocks', _blockno, ('hook_resid_pre' | 'hook_attn_out' | 'hook_resid_mid' | 'hook_mlp_out' | 'hook_resid_post')]:
                    cache_copy[key] = value.tolist()
                case ['blocks', _blockno, 'attn', ('hook_q' | 'hook_k' | 'hook_v' | 'hook_z' | 'hook_pattern')]:
                    cache_copy[key] = value.tolist()
                case _:
                    pass

        return cache_copy
    
    def clean_logits(self, logits: Logits):
        tokens: Integer[t.Tensor, "batch seq"] | Integer[t.Tensor, "seq"] = logits.argmax(dim=-1).squeeze()[:-1]
        if tokens.dim() == 1:
            tokens = tokens.unsqueeze(0)

        output_tokens: list[list[int]] = tokens.tolist()
        sub_words: list[list[str]] = [self.model.to_str_tokens(t) for t in tokens]
        output_logits: list[list[list[float]]] = logits.tolist()

        return  output_tokens, sub_words, output_logits

    @classmethod
    def clean_loss(cls, loss: t.Tensor) -> float:
        return loss.item()
    
    @classmethod
    def clean_token_loss(cls, loss: t.Tensor) -> list[list[float]]:
        return loss.tolist()


ts = Modelling()


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
def tokenize_to_tokens(inputItem: InputStringListItem):
    ts.last_prompt = inputItem.input
    tokens: list[list[int]] = ts.model.to_tokens(inputItem.input).tolist()
    print('tokenizing', inputItem.input, 'to', tokens)
    return {"tokens": tokens}

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

    if input.clientLogicalClock >= ts.logical_clock:
        ts.logical_clock += 1

        temp_hooks_list: list[tuple[int, Hook]] = []

        for transformer_component_name, component_slices in input.ablations.items():
            print('transformer comp', transformer_component_name)
            print('transformer comp', component_slices)

            for _target_sub_component, hook_config in component_slices.items():
                print('hook config', hook_config)
                ablation_hook = partial(
                    ts.ablation_hook,
                    slices=hook_config['slice'],
                    ablation_type=hook_config['ablationType']
                )
                # Create a tuple with ablationType priority as the first element and the hook as the second
                hook_tuple = (ablation_priority[hook_config['ablationType']], (transformer_component_name, ablation_hook))
                
                # Use insort to insert the tuple in the correct place in the list
                insort(temp_hooks_list, hook_tuple, key=lambda x: x[0])

                ts.fwd_ablation_hooks.append((transformer_component_name, ablation_hook)) # TODO, can kill this line?

        # Reassign fwd_ablation_hooks to contain only the second element of each tuple (preserving the original format)
        ts.fwd_ablation_hooks = [hook for _, hook in temp_hooks_list]

        ts.ablations = input.ablations

    return {
        "server_logical_clock": ts.logical_clock,
        "ablations": ts.ablations
    }


class InputPatchState(BaseModel):
    patches: PatchesType
    clientLogicalClock: int

@app.put("/api/patch/sync")
def patch_sync(input: InputPatchState):
    """
    Sync hook patches between frontend and backend code

    For the purpose of Transpector a patch is a hook that takes an activation from a slice of a
    model component and applies it to a slice of another model component.

    These two components are called the source and the target, source is where the copy happens
    and target is where the paste is applied. To do this we use our cache that has saved the source
    previously and add a hook on the target to apply from the saved cache.
    """

    if input.clientLogicalClock >= ts.logical_clock:
        ts.logical_clock += 1

        temp_hooks_list: list[Hook] = []

        for source_component_name, source_slices in input.patches.items():
            print('transformer comp', source_component_name)
            print('transformer comp', source_slices)

            for _source_slice_id, source_slice_info in source_slices.items():
                print('hook config', source_slice_info)

                for target_component_name, target_slices in source_slice_info['edges'].items():
                    for _target_slice_id, target_slice_config in target_slices.items():

                        # When creating a patch we want to read from the source and transfer the
                        # activations to the target, so the hook has to be triggered on the
                        # target's name not the sources
                        patch_hook = partial(
                            ts.patch_hook,
                            source_component=source_component_name,
                            source_slice=source_slice_info['slice'],
                            target_component=target_component_name,
                            target_slice=target_slice_config['slice']
                        )
                        temp_hooks_list.append((target_component_name, patch_hook))

        ts.fwd_patch_hooks = temp_hooks_list

        ts.patches = input.patches

    return {
        "server_logical_clock": ts.logical_clock,
        "patches": ts.patches
    }

app.mount("/", StaticFiles(directory="/frontend_dist", html=True), name="out")
