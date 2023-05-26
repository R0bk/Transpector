
from setuptools import setup, find_packages
import glob

setup(
    name="transpector",
    version="0.1.0",
    # packages=["transpector"],
    author="Rob Kopel",
    license="LICENSE",
    description="Visually inspect, analyse and debug transformer models. Aimed at reducing cycle times for interpretability research and lowering the barrier to entry.",
    long_description=open("README.md").read(),
    install_requires=[
        "fastapi",
        "uvicorn[standard]",
        "transformer_lens",
        "circuitsvis",
        "einops",
        "fancy_einsum",
        "torchtyping",
        "jupyterlab",
        "nbclient",
        "websockets"
    ],
    entry_points={"console_scripts": ["transpector=transpector.__main__:cli"]},
    packages=find_packages(exclude=["*.tests", "*.tests.*", "tests.*", "tests"]),
    include_package_data=True,
    # package_data={'': ['frontend_dist/*']},
    # data_files=glob.glob('project/frontend_dist/**')
)
