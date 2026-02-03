import requests
import json

url = "http://127.0.0.1:8000/dashboard-data"

try:
    response = requests.get(url)
    print(f"Status: {response.status_code}")
    print("Data Sample:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
