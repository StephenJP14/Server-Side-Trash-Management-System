import requests
import json

url = "http://localhost:3000/login"
headers = {
    "Content-Type": "application/json"
}

data = {
    "email": "depran80@gmail.com",
    "password": "123456"
}

response = requests.post(url, headers=headers, data=json.dumps(data))

print(f"Status Code: {response.status_code}")
print(f"Response Body: {response.json()}")
