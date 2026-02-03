import requests

url = "http://127.0.0.1:8000/feedback"
data = {
    "student_id": "test_student",
    "category": "Academics",
    "text": "The course is great but too fast."
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
