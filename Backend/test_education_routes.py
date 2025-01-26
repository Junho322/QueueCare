from routers.education_routes import generate_education_gumloop, SymptomInput

# Simulate frontend input with symptom input and patient ID
symptom_input = SymptomInput(
    symptom_input="cancer",
    patient_id=""  # Replace with a valid patient ID
)

# Call the function directly and print the output
try:
    result = generate_education_gumloop(symptom_input)
    print("Function Output:")
    print(result)  # Print the function's response for verification
except Exception as e:
    print(f"An error occurred: {e}")
