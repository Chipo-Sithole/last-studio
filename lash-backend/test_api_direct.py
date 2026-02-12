import requests
import json

# Test the API endpoint
url = "http://127.0.0.1:8000/api/appointments/available_slots/?date=2026-02-14"

try:
    response = requests.get(url)
    print(f"Status Code: {response.status_code}")
    print(f"\nResponse:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
