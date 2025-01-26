from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncio
from typing import Optional
import httpx

router = APIRouter()

class SymptomInput(BaseModel):
    symptom_input: Optional[str] = "no input was given. don't answer"
    patient_id: Optional[str]  # Add patient_id as an optional input


@router.post("/gumloop")
async def generate_education_gumloop(symptom_data: SymptomInput):
    """
    Receives symptom input and patient ID, starts a Gumloop pipeline, polls for the result,
    and returns the final outputs when the pipeline is complete.
    """
    # Gumloop API endpoints
    start_pipeline_url = "https://api.gumloop.com/api/v1/start_pipeline"
    poll_run_url = "https://api.gumloop.com/api/v1/get_pl_run"
    patient_details_url = "https://ifem-award-mchacks-2025.onrender.com/api/v1/patient"

    # API key and headers
    headers = {
        "Authorization": "Bearer 291dc2abf10040b88689a26669a0e3f8",  # Replace with your secure key
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        # Prepare tasks for parallel execution
        patient_details_task = (
            client.get(f"{patient_details_url}/{symptom_data.patient_id}", headers=headers)
            if symptom_data.patient_id else None
        )
        start_pipeline_task = client.post(
            start_pipeline_url,
            json={
                "user_id": "nNT0CHmkWLaXOcu1pYJJ9TRiUQl1",
                "saved_item_id": "phkmt24rSRMMWDorzJSsSt",
                "pipeline_inputs": [
                    {"input_name": "symptom_input", "value": symptom_data.symptom_input},
                    {"input_name": "patient_id", "value": symptom_data.patient_id or "no patient_id provided"},
                ]
            },
            headers=headers
        )

        # Execute tasks concurrently
        try:
            responses = await asyncio.gather(
                patient_details_task,
                start_pipeline_task,
                return_exceptions=True
            )

            # Process start pipeline response
            start_response = responses[1]
            if isinstance(start_response, httpx.Response):
                start_response.raise_for_status()
                pipeline_data = start_response.json()
            else:
                raise HTTPException(status_code=500, detail="Error starting the pipeline.")

            # Extract run_id and proceed to polling
            run_id = pipeline_data.get("run_id")
            if not run_id:
                raise HTTPException(status_code=500, detail="No run_id provided in the pipeline response.")

            poll_params = {"run_id": run_id, "user_id": "nNT0CHmkWLaXOcu1pYJJ9TRiUQl1"}
            for _ in range(20):  # Poll up to 10 times
                poll_response = await client.get(poll_run_url, headers=headers, params=poll_params)
                poll_response.raise_for_status()
                run_status = poll_response.json()

                state = run_status.get("state")
                if state == "DONE":
                    outputs = run_status.get("outputs", {})
                    response_text = outputs.get("response", "No response available.")
                    return response_text  # Return only the response string
                elif state in {"FAILED", "TERMINATED"}:
                    raise HTTPException(status_code=500, detail=f"Pipeline ended with state: {state}")

                await asyncio.sleep(0.5)

            raise HTTPException(status_code=500, detail="Pipeline did not complete in time.")

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error during processing: {e}")
