import asyncio
from routers.education_routes import generate_education_gumloop, SymptomInput

# Test the generate_education_gumloop function
async def test_generate_education_gumloop():
    # Prepare input
    test_input = SymptomInput(
        symptom_input="Symptom A Symptom B",
        patient_id="test_patient_id"
    )
    
    # Call the function and await the result
    result = await generate_education_gumloop(test_input)
    
    # Extract and print only the response part
    response_text = result.get("final_outputs", {}).get("response", "No response found")
    print("Extracted Response:")
    print(response_text)

# Run the test
if __name__ == "__main__":
    asyncio.run(test_generate_education_gumloop())
