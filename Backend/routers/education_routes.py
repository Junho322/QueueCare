# routers/education_routes.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import openai  # if using OpenAI

router = APIRouter()

# Example input model
class SymptomInput(BaseModel):
    symptoms: List[str]

@router.post("/generate")
def generate_education(symptom_input: SymptomInput):
    """
    Receives a list of symptoms and returns an LLM-generated
    "educational" explanation or possible conditions (non-clinical).
    """
    try:
        # Construct your prompt
        prompt = f"""
        You are a non-clinical assistant. The user has these symptoms:
        {", ".join(symptom_input.symptoms)}
        Provide a short educational overview of possible next steps
        in an Emergency Department, disclaimers included. 
        Do NOT provide direct medical advice.
        """

        # Call your LLM (OpenAI example)
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            max_tokens=200,
            temperature=0.3
        )

        text_output = response.choices[0].text.strip()

        return {
            "educationalInfo": text_output,
            "disclaimer": "This is for educational purposes only, not medical advice."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
