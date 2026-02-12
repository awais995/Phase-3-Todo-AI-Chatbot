from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.tasks import router as tasks
from routes.auth import router as auth
from routes.chat import router as chat
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
from db import engine
import os
from dotenv import load_dotenv
from config import SECRET_KEY

# Load environment variables from .env file
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    SQLModel.metadata.create_all(engine)
    yield
    # Cleanup on shutdown if needed
    pass

app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:8000", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:8000", "https://localhost:3000", "https://localhost:3001", "https://localhost:8000"],  # Allow specific origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Include the auth, tasks, and chat routers
app.include_router(auth)
app.include_router(tasks)
app.include_router(chat)

@app.get("/")
def read_root():
    return {"message": "Todo Backend API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "database_url": os.getenv("DATABASE_URL", "not set")}

@app.get("/debug/secret")
def debug_secret():
    return {"secret_key": SECRET_KEY[:20] + "...", "full_length": len(SECRET_KEY)}