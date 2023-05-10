# uvicorn main:app --reload
# from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
from model import get_available_models, get_pretrained_model_config, load_model, ActivationCache

app = FastAPI()

class Modelling:
    model = load_model('gpt2')
    available_models = get_available_models()
    last_prompt: list[str] = []


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

# class Item(BaseModel):
#     name: str
#     price: float
#     is_offer: Union[bool, None] = None





@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/api/models/getModels")
def get_models(): 
    return Modelling.available_models

@app.get("/api/models/getModelConfig/{model_name}")
def get_model_config(model_name: str): 
    return {"config": get_pretrained_model_config(model_name)}

class ModelItem(BaseModel):
    model_name: str

@app.put("/api/models/setModel")
def set_models(model_name: ModelItem):
    print(f'Loading model: {model_name.model_name}')
    Modelling.model = load_model(model_name.model_name)
    print('Loaded model')
    return {"Loaded model": model_name}

class InputStringListItem(BaseModel):
    input: list[str]

class InputIntListItem(BaseModel):
    input: list[int]

@app.put("/api/tokenize/toStringTokens")
def tokenize_to_string_tokens(inputItem: InputStringListItem):
    return {"stringTokens": Modelling.model.to_str_tokens(inputItem.input)}

@app.put("/api/tokenize/toTokens")
def tokenize_to_tokens(inputItem: InputStringListItem) -> dict[str, list[list[int]]]:
    print('tokenizing', inputItem.input)
    Modelling.last_prompt = inputItem.input
    print('tokenizing', Modelling.model.to_tokens(inputItem.input).tolist())
    return {"tokens": Modelling.model.to_tokens(inputItem.input).tolist()}

@app.put("/api/tokenize/toString")
def tokenize_to_string(inputItem: InputIntListItem):
    return {"string": Modelling.model.to_tokens(inputItem.input)}

@app.get("/api/inference/run")
def inference_run():
    prompt = Modelling.last_prompt
    logits, cache = Modelling.model.run_with_cache(prompt)
    cleaned_cache = Modelling.clean_cache(cache)
    return {"activationData": cleaned_cache, "inferencePrompt": prompt}







# @app.get("/api/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}


# @app.put("/api/items/{item_id}")
# def update_item(item_id: int, item: Item):
#     return {"item_name": item.name, "item_id": item_id}