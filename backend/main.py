import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/")
def read_root():
    return {
        "message": "TaskFlow API is running!",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
