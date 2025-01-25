import openai

def generate_education_text(symptoms_list: list[str]) -> str:
    prompt = f"""
    You are a non-clinical assistant...
    The user has symptoms: {symptoms_list}...
    """
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        max_tokens=200,
        temperature=0.3
    )
    return response.choices[0].text.strip()
