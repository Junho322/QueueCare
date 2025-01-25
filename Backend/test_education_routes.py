from routers.education_routes import generate_education_gumloop, SymptomInput

# Simulate frontend input
symptom_input = SymptomInput(symptom_input="headache, fever, chill, cough")

# Call the function directly
try:
    result = generate_education_gumloop(symptom_input)
    print("Function Output:")
    print(result)  # Print the function's response for verification
except Exception as e:
    print(f"An error occurred: {e}")
