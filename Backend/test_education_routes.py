from routers.education_routes import generate_education_gumloop, SymptomInput
import asyncio

async def test_generate_education_gumloop():
    test_input = SymptomInput(question_input="say", patient_id="test_patient_id")
    result = await generate_education_gumloop(test_input)
    
    # Extract the response part from the final_outputs
    response = result.get("final_outputs", {}).get("response", "No response found")
    print("Extracted Response:", response)

# Run the test
asyncio.run(test_generate_education_gumloop())
