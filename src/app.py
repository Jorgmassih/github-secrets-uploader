from typing import Optional
from fastapi import FastAPI, Header, File, UploadFile, Form
from fastapi.responses import FileResponse
from utils.create_secrets import SecretsManager
from utils.parse_ini import extract_secrets
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import io


app = FastAPI()


@app.get("/")
def default():
    return FileResponse("static/index.html")


@app.get("/static/{filename:path}")
def get_static(filename: str = "index.html"):
    return FileResponse(f"static/{filename}")	


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


