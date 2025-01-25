# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.queue_routes import router as queue_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Attach the queue router at the prefix "/queue"
app.include_router(queue_router, prefix="/queue", tags=["Queue"])

@app.get("/")
def root():
    return {"message": "Welcome to the ED Experience API"}
