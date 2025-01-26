from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.queue_routes import router as queue_router
from routers.education_routes import router as education_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Mount the queue router
app.include_router(queue_router, prefix="/queue", tags=["Queue"])
# Mount the education router (which now includes /gumloop)
app.include_router(education_router, prefix="/education", tags=["Education"])

@app.get("/")
def root():
    return {"message": "Welcome to the ED Experience API"}
