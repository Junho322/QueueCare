from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import time
from typing import Optional

router = APIRouter()

class SymptomInput(BaseModel):
    symptom_input: Optional[str] = "no input was given. don't answer"

@router.post("/gumloop")
def generate_education_gumloop(symptom_data: SymptomInput):
    """
    Receives symptom input, starts a Gumloop pipeline, polls for the result,
    and returns the final outputs when the pipeline is complete.
    """
    # Gumloop API endpoints
    start_pipeline_url = "https://api.gumloop.com/api/v1/start_pipeline"
    poll_run_url = "https://api.gumloop.com/api/v1/get_pl_run"

    # API key and headers
    headers = {
        "Authorization": "Bearer 291dc2abf10040b88689a26669a0e3f8",  # Replace with your secure key
        "Content-Type": "application/json"
    }

    # Step 1: Start the pipeline
    payload = {
        "user_id": "nNT0CHmkWLaXOcu1pYJJ9TRiUQl1",
        "saved_item_id": "phkmt24rSRMMWDorzJSsSt",
        "pipeline_inputs": [
            {
                "input_name": "symptom_input",
                "value": symptom_data.symptom_input
            }
        ]
    }

    try:
        # Start the pipeline
        start_response = requests.post(start_pipeline_url, json=payload, headers=headers)
        start_response.raise_for_status()
        pipeline_data = start_response.json()

        # Extract the run_id and URL
        run_id = pipeline_data.get("run_id")
        if not run_id:
            raise HTTPException(status_code=500, detail="No run_id provided in the pipeline response.")

        # Step 2: Poll for the result
        poll_params = {
            "run_id": run_id,
            "user_id": "nNT0CHmkWLaXOcu1pYJJ9TRiUQl1"
        }

        for _ in range(20):  # Poll up to 20 times
            poll_response = requests.get(poll_run_url, headers=headers, params=poll_params)
            poll_response.raise_for_status()
            run_status = poll_response.json()

            # Extract the state and outputs
            state = run_status.get("state")
            if state == "DONE":
                outputs = run_status.get("outputs", {})
                return {
                    "initial_response": pipeline_data,
                    "final_outputs": outputs
                }
            elif state in {"FAILED", "TERMINATED"}:
                raise HTTPException(status_code=500, detail=f"Pipeline ended with state: {state}")

            # Wait 2 seconds before the next poll
            time.sleep(2)

        # If the pipeline does not complete within the polling attempts
        raise HTTPException(status_code=500, detail="Pipeline did not complete in time.")

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"API request error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")
