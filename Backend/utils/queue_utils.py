# utils/queue_utils.py

import requests

MOCK_API_URL = "https://ifem-award-mchacks-2025.onrender.com/queue"

def fetch_and_transform_queue_data():
    """
    Fetches queue data from the IFEM mock API and transforms it
    into a structure your frontend can easily use.
    """
    response = requests.get(MOCK_API_URL)
    response.raise_for_status()
    data = response.json()  # e.g. includes waitingCount, longestWaitTime, patients, etc.

    # Example: transform or filter the data
    # (you can do more advanced manipulation if you want)
    transformed_data = {
        "waitingCount": data["waitingCount"],
        "longestWaitTime": data["longestWaitTime"],
        "patients": data["patients"]
    }
    return transformed_data
