# routers/queue_routes.py

from fastapi import APIRouter, HTTPException
from utils.queue_utils import fetch_and_transform_queue_data

router = APIRouter()

@router.get("/info")
def get_queue_info():
    try:
        # Use the utility function to get your transformed data
        data = fetch_and_transform_queue_data()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
