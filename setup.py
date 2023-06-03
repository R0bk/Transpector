from setuptools import setup, find_packages

setup(
    name="transpector",
    version="0.1.6",
    author="Rob Kopel",
    license="LICENSE",
    description="Visually inspect, analyse and debug transformer models. Aimed at reducing cycle times for interpretability research and lowering the barrier to entry.",
    long_description=open("README.md").read(),
    long_description_content_type='text/markdown',
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
        "websockets",
        "jaxtyping"
    ],
    entry_points={"console_scripts": ["transpector=transpector.__main__:cli"]},
    packages=find_packages(exclude=["*.tests", "*.tests.*", "tests.*", "tests"]),
    include_package_data=True,
    setup_requires=['wheel']
)
