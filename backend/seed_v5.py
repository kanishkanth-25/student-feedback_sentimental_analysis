import requests
import datetime
import random

url = "http://127.0.0.1:8000/feedback"
locations = ["Main Block", "Hostel A", "Sports Complex", "Library", "Canteen"]
categories = ["Academics", "Facilities", "Sports", "Hostel", "Placements"]
feedbacks = [
    "The library needs more charging ports.",
    "Professor Smith is excellent!",
    "Hostel food quality has improved.",
    "The sports ground is poorly maintained.",
    "Placement training was very helpful.",
    "Too much noise in the main block corridor.",
    "Wifi in hostel is very slow.",
    "Labs are well equipped but crowded."
]

for i in range(15):
    # This won't actually change the date in SQLite via API since created_at is default
    # But for the demo, submitting them now is fine.
    data = {
        "student_id": f"STU-00{i}",
        "category": random.choice(categories),
        "location": random.choice(locations),
        "text": random.choice(feedbacks)
    }
    try:
        requests.post(url, json=data)
    except:
        pass

print("Seeding complete.")
