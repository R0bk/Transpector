import asyncio
import json
import random
import re
import sys
import threading
import time
from typing import Any, Optional

import requests
import websockets
from tqdm import tqdm
from jupyter_server.serverapp import main as jupyter_main

from os.path import join, dirname




def start_jupyter_server():
    sys.argv = ['jupyter-server', f'--config={join(dirname(__file__), "jupyter_server_config.py")}']
    sys.argv[0] = re.sub(r'(-script\.pyw|\.exe)?$', '', sys.argv[0])
    jupyter_main()


def launch_script():
    # Give the server time to start up
    time.sleep(10)

    # Create a session, which can store cookies
    session = requests.Session()

    # The base URL for requests
    base_url = "http://localhost:8686/api"

    # Specify headers
    headers = {
        "Authorization": "token 60c1661cc408f978c309d04157af55c9588ff9557c9380e4fb50785750703da6",
        "Content-Type": "application/json",
    }

    # Send an OPTIONS request
    options_url = base_url + "/jupyter/api"
    session.options(options_url, headers=headers)

    # Send a GET request
    get_url = base_url + "/jupyter/api"
    get_response = session.get(get_url, headers=headers)

    # Start a new session
    session_name = 'my_fav_session'
    session_url = base_url + "/jupyter/api/sessions"
    session_response = session.post(session_url, headers=headers, json={
        "kernel": {"name": "python3"},
        "notebook": {"path": "main.ipynb"},
        "name": session_name,
        "type": "python3"
    })
    # print(session_response.json())

    # Get the kernel ID
    kernel_id = session_response.json()['kernel']['id']
    session_id = session_response.json()['id']
    # print('trying kernel id', kernel_id)






    async def run_code(kernel_id, code):
        uri = f"ws://localhost:8686/api/jupyter/api/kernels/{kernel_id}/channels?session_id={session_id}&token=60c1661cc408f978c309d04157af55c9588ff9557c9380e4fb50785750703da6"
        async with websockets.connect(uri) as websocket:
            # Send an execute_request message
            execute_request = {
                "header": {
                    "msg_id": str(random.randrange(0,100000000000000)),
                    "username": "username",
                    "session": f"{session_id}",
                    "msg_type": "execute_request",
                    "version": "5.2",
                },
                "parent_header": {},
                "metadata": {},
                "content": {
                    "code": code,
                    "silent": False,
                    "store_history": True,
                    "user_expressions": {},
                    "allow_stdin": False
                },
                "buffers": [],
                "channel": "shell",
            }
            await websocket.send(json.dumps(execute_request))

            # Initialize an empty string to store the output
            output = ""

            # Initialize execute_reply_received flag
            execute_reply_received = False

            # Get messages until an execute_result message is received
            while True:
                message = json.loads(await websocket.recv())
                # print(message)
                if message["msg_type"] == "stream":
                    # If the message type is 'stream', append the 'text' from the message to the output
                    output += message["content"]["text"]
                elif message["msg_type"] == "execute_result":
                    # If the message type is 'execute_result', return the data along with any output from 'stream' messages
                    output += str(message["content"]["data"])
                elif message["msg_type"] == "execute_reply":
                    # Set the flag when execute_reply is received
                    execute_reply_received = True
                    status = message["content"]["status"]
                    if status == "ok" and execute_reply_received:
                        break
                elif message["msg_type"] == "display_data":
                    # handle display_data message
                    data = message["content"]["data"]
                    # assuming data is a dictionary
                    for key, value in data.items():
                        output += f"{key}: {value}\n"
                elif message["msg_type"] == "error":
                    # handle error message
                    error_msg = message["content"]["ename"] + ": " + message["content"]["evalue"]
                    for traceback_line in message["content"]["traceback"]:
                        error_msg += "\n" + traceback_line
                    raise Exception("Error in kernel:\n" + error_msg)
                elif message["msg_type"] == "status":
                    # handle status message
                    status = message["content"]["execution_state"]
                    if status == "idle" and execute_reply_received:
                        break
                time.sleep(1)

            return output


    # Start a new event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)


    def run_all_cells(notebook_data: dict[str, Any], messages: Optional[list[str]]=None):
        total_cells = len(notebook_data["content"]["cells"])
        if messages is None:
            messages = [''] * total_cells

        progress_bar = tqdm(total=total_cells, desc="Setting up Notebook", dynamic_ncols=True)

        for i, (cell, message) in enumerate(zip(notebook_data["content"]["cells"], messages)):
            progress_bar.set_description(f"Running cells: {message}")
            result = loop.run_until_complete(run_code(kernel_id, cell["source"]))

            # Update the cell
            cell["execution_count"] = i

            # Update the cell's output
            cell["outputs"] = [{
                "output_type": "execute_result",
                "execution_count": i,
                "data": {
                    "text/plain": result,
                },
                "metadata": {}
            }]

            # Update the notebook file
            # notebook["content"]["cells"][-1] = new_cell

            progress_bar.update(1)

        progress_bar.close()

        put_url = base_url + f"/jupyter/api/contents/{path}"
        put_response = session.put(put_url, headers=headers, json=notebook_data)


    def add_new_cell_and_run(notebook_data: dict[str, Any]):
        # Add a new cell to the notebook
        new_cell = {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": 
                "print('Hello, world!')\n" \
                "x = 5\n" \
                "y = 8\n" \
                "print(x+y)\n" # code of the new cell
        }
        notebook_data["content"]["cells"].append(new_cell)

        # Send a PUT request to update the notebook
        put_url = base_url + f"/jupyter/api/contents/{path}"
        put_response = session.put(put_url, headers=headers, json=notebook_data)

        # Execute the cell
        result = loop.run_until_complete(run_code(kernel_id, new_cell["source"]))

        # Update the cell's output
        new_cell["outputs"] = [{
            "output_type": "execute_result",
            "execution_count": new_cell["execution_count"],
            "data": {
                "text/plain": result,
            },
            "metadata": {}
        }]

        # Update the notebook file
        notebook_data["content"]["cells"][-1] = new_cell
        put_url = base_url + f"/jupyter/api/contents/{path}"
        put_response = session.put(put_url, headers=headers, json=notebook_data)


    # Specify the path of the notebook
    path = "main.ipynb"

    # Send a GET request to get the current state of the notebook
    get_url = base_url + f"/jupyter/api/contents/{path}"
    get_response = session.get(get_url, headers=headers)
    notebook = get_response.json()

    run_all_cells(
        notebook,
        messages=['Initialising', 'Loading Libs', 'Setting Types', 'Loading Model', 'Loading endpoints', 'Starting Server']
    )
    print('Transpector loaded')




def launch_server():
    # Run the launch script
    launch_script_thread = threading.Thread(target=launch_script, daemon=True)
    launch_script_thread.start()

    # Starts jupyter server
    start_jupyter_server()


if __name__ == "__main__":
    launch_server()