from typing import Optional
from fastapi import FastAPI, Header, File, UploadFile, Form, Query
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from os import path
from .secrets_manager import SecretsManager
from .utils import *
import io
import requests


app = FastAPI()

current_dir = path.dirname(path.abspath(__file__))
static_dir = path.join(current_dir, 'static')

@app.get("/")
def default():
    index_html = path.join(static_dir, 'index.html')
    return FileResponse(index_html)


@app.get('/oauth/github')
async def oauth(
    code: str = Query(..., description='Github code after authorization to get access token', example='2cb5c1dd95440b6789db'),
    installation_id: str = Query(...),
    setup_action: str = Query(...)):

    print(code, installation_id, setup_action)

    data = {
        "client_id": 'Iv1.ac8076346c86006b',
        "client_secret": "e9fcb864ed9bbaef0d2f215e753d827a6f1f15cf",
        "code": code
    }
    req = requests.post('https://github.com/login/oauth/access_token', data=data)
    print(req.text)
    

@app.get("/static/{filename:path}")
def get_static(filename: str = "index.html"):

    static_file = path.join(static_dir, filename)
    return FileResponse(static_file)	


@app.get('/github-client-id')
def get_client_id():
    return {
        'clientId':'724c2a848170c988b07c'
    }


@app.post("/submit/{submit_type}")
async def submission(submit_type: str,
                repo_name: str = Form (...), 
                github_token: str = Form (...), 
                repo_owner: str = Form (...), 
                text_area: Optional[str] = Form (None), 
                file: Optional[UploadFile] = File(None)):
    secrets = []
    if submit_type == "file":
        #content = await file.read()
        sfile = file
        #content = content.decode("utf-8")

    elif submit_type == "text":
        sfile = io.StringIO(text_area)

    else:
        return {"error": "Invalid submit type"}

    secrets = extract_secrets(sfile)
    
    if not secrets:
        return {"error": "No secrets found, Make sure you have a section in your file or it is a valid ini file"}

    #sm = SecretsManager(f'{repo_owner}/{repo_name}', github_token, secrets)
    #ci_tasks = sm.add_secrets_to_github()
    
    #return {'secrets': secrets, 'repo_name': repo_name, 'ci_tasks': ci_tasks}


