import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"

payload = {
    "payment_id": 12,
    "success": True,
    "transaction_id": "MOCK_TEST_12"
}

response = requests.post(f"{BASE_URL}/payments/callback/", json=payload)
print(response.status_code)
print(response.json())
