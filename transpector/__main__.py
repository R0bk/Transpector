import click
from transpector.launch import launch_server

@click.command()
def cli():
    launch_server()
