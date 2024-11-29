from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import hashlib
import hmac
import time

# Tuya API credentials
CLIENT_ID = "5pdtm7ynqv7q9m4nkatk"
CLIENT_SECRET = "98cef96e4cb6434883ae81f000e76a62"
DEVICE_ID = "50088717d8bfc0c220ea"
BASE_URL = "https://openapi.tuyaus.com"  

def get_access_token():
    """Get an access token from Tuya API"""
    timestamp = str(int(time.time() * 1000))
    sign = hmac.new(
        CLIENT_SECRET.encode("utf-8"),
        f"{CLIENT_ID}{timestamp}".encode("utf-8"),
        hashlib.sha256
    ).hexdigest().upper()

    url = f"{BASE_URL}/v1.0/token?grant_type=1"
    headers = {
        "client_id": CLIENT_ID,
        "sign": sign,
        "t": timestamp,
        "sign_method": "HMAC-SHA256",
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    return data["result"]["access_token"]

def control_light(access_token, color):
    """Send a command to control the light color"""
    url = f"{BASE_URL}/v1.0/devices/{DEVICE_ID}/commands"
    headers = {
        "client_id": CLIENT_ID,
        "access_token": access_token,
        "sign_method": "HMAC-SHA256",
    }
    payload = {
        "commands": [
            {"code": "color", "value": color}  # Adjust based on the light's API
        ]
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

class QuizSubmitView(APIView):
    def post(self, request):
        user_answer = request.data.get("answer")
        correct_answer = "Random Access Memory"  # Replace with dynamic logic if needed
        access_token = get_access_token()

        if user_answer.strip().lower() == correct_answer.lower():
            # Correct answer: turn light green
            color = {"h": 120, "s": 1000, "v": 1000}  # Green
            control_light(access_token, color)
            return Response({"result": "correct", "message": "Light turned green!"}, status=status.HTTP_200_OK)
        else:
            # Wrong answer: turn light red
            color = {"h": 0, "s": 1000, "v": 1000}  # Red
            control_light(access_token, color)
            return Response({"result": "incorrect", "message": "Light turned red!"}, status=status.HTTP_200_OK)