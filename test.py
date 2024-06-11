import requests
import json

url = "https://backendtrash-production.up.railway.app/requestpickup"
headers = {
    "Content-Type": "application/json"
}

data = {
    "qty": 15,
    "trashType": "Plastic",
    "trashDetail": "Coke Bottle",
    "userId": "5f9b1b3b1f1b1b1b1b1b1b1b",
    "location": {
        "latitude": 37.78825,
        "longitude": -122.4324
    }
}

response = requests.post(url, headers=headers, data=json.dumps(data))

print(f"Status Code: {response.status_code}")
print(f"Response Body: {response.json()}")
