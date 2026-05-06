import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv

from routes.auth import router as auth_router
from routes.projects import router as projects_router
from routes.tasks import router as tasks_router

from database import Base, engine
import models

load_dotenv()

ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "http://localhost:5173")

app = FastAPI(
    title="TaskFlow API",
    version="1.0.0",
    description="Team Task Manager API"
)

origins = [ALLOWED_ORIGIN]
if "http://localhost:5173" not in origins:
    origins.append("http://localhost:5173")
if "http://localhost:3000" not in origins:
    origins.append("http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    SECRET_KEY = os.getenv("SECRET_KEY")
    if ENVIRONMENT == "production" and (not SECRET_KEY or SECRET_KEY == "taskflow-super-secret-key-change-this"):
        raise RuntimeError("SECRET_KEY must be properly configured in production environment!")
    Base.metadata.create_all(bind=engine)
    print("All tables created successfully")


app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(tasks_router)

# SPA catch-all and Static Assets
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")

if os.path.isdir(STATIC_DIR):
    # Mount assets directory for JS/CSS bundles
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")

# SPA catch-all — MUST be after all API routes
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    file_path = os.path.join(STATIC_DIR, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    # Default to index.html for client-side routing
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.isfile(index_path):
        return FileResponse(index_path)
    return {"message": "API is running. Build frontend to serve UI.", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
