from typing import Optional
from fastapi import FastAPI, Header, File, UploadFile, Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from os import path
from .secrets_manager import SecretsManager
from .utils import *
import io


app = FastAPI()

current_dir = path.dirname(path.abspath(__file__))
static_dir = path.join(current_dir, 'static')

@app.get("/")
def default():
    index_html = path.join(static_dir, 'index.html')
    return FileResponse(index_html)


@app.get("/static/{filename:path}")
def get_static(filename: str = "index.html"):

    static_file = path.join(static_dir, filename)
    return FileResponse(static_file)	


@app.post("/submit/{submit_type}")
async def submission(submit_type: str,
                repo_name: str = Form (...), 
                github_token: str = Form (...), 
                repo_owner: str = Form (...), 
                text_area: Optional[str] = Form (None), 
                file: Optional[UploadFile] = File(None)):
    secrets = []
    if submit_type == "file":
        sfile = await file.read()
        sfile = sfile.decode("utf-8")
        sfile = io.StringIO(sfile)
        

    elif submit_type == "text":
        sfile = io.StringIO(text_area)

    else:
        return {"error": "Invalid submit type"}

    secrets = await extract_secrets(sfile)
    
    if not secrets:
        return {"error": "No secrets found, Make sure you have a section in your file or it is a valid ini file"}

    sm = SecretsManager(f'{repo_owner}/{repo_name}', github_token, secrets)
    ci_step = await sm.add_secrets_to_github()

    return {'ciStep': ci_step}


