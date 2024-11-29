import os
import hashlib
import hmac
import requests
import time
import json

def get_access_token(ClientID, ClientSecret, BaseUrl, EmptyBodyEncoded, tuyatime, debug=False):
    """Get Access Token from Tuya API"""
    URL = "/v1.0/token?grant_type=1"

    StringToSign = f"{ClientID}{tuyatime}GET\n{EmptyBodyEncoded}\n\n{URL}"
    if debug:
        print("StringToSign is now", StringToSign)

    AccessTokenSign = hmac.new(ClientSecret.encode(), StringToSign.encode(), hashlib.sha256).hexdigest().upper()
    if debug:
        print("AccessTokenSign is now", AccessTokenSign)

    headers = {
        "sign_method": "HMAC-SHA256",
        "client_id": ClientID,
        "t": tuyatime,
        "mode": "cors",
        "Content-Type": "application/json",
        "sign": AccessTokenSign
    }

    AccessTokenResponse = requests.get(BaseUrl + URL, headers=headers).json()
    if debug:
        print("AccessTokenResponse is now", AccessTokenResponse)

    AccessToken = AccessTokenResponse.get("result", {}).get("access_token")
    if debug:
        print("Access token is now", AccessToken)

    return AccessToken

def get_device_info(ClientID, ClientSecret, BaseUrl, EmptyBodyEncoded, tuyatime, AccessToken, deviceList, debug=False):
    """Get information about the devices connected to Tuya IoT Cloud"""
    device_ids = ",".join(deviceList.keys())

    URL = f"/v2.0/cloud/thing/batch?device_ids={device_ids}"

    StringToSign = f"{ClientID}{AccessToken}{tuyatime}GET\n{EmptyBodyEncoded}\n\n{URL}"
    if debug:
        print("StringToSign is now", StringToSign)

    RequestSign = hmac.new(ClientSecret.encode(), StringToSign.encode(), hashlib.sha256).hexdigest().upper()
    if debug:
        print("RequestSign is now", RequestSign)

    headers = {
        "sign_method": "HMAC-SHA256",
        "client_id": ClientID,
        "t": tuyatime,
        "mode": "cors",
        "Content-Type": "application/json",
        "sign": RequestSign,
        "access_token": AccessToken
    }

    RequestResponse = requests.get(BaseUrl + URL, headers=headers).json()
    if debug:
        print("RequestResponse is now", RequestResponse)

    devices_info = RequestResponse.get("result", [])
    for device_info in devices_info:
        id = device_info.get("id")
        localKey = device_info.get("local_key")
        customName = device_info.get("custom_name")

        print(f"{id}\t{localKey}\t{customName}")

def turn_on_light(ClientID, ClientSecret, BaseUrl, EmptyBodyEncoded, tuyatime, AccessToken, device_id, debug=False):
    """Turn the light ON."""
    # API endpoint
    URL = f"/v1.0/iot-03/devices/{device_id}/commands"
    full_url = BaseUrl + URL

    # JSON payload to turn on the light
    payload = {
        "commands": [
            {
                "code": "switch_led",
                "value": True  # True to turn ON
            }
        ]
    }

    # Calculate the SHA256 hash of the payload
    payload_hash = hashlib.sha256(json.dumps(payload, separators=(',', ':')).encode('utf-8')).hexdigest()
    
    # Construct the StringToSign
    StringToSign = f"{ClientID}{AccessToken}{tuyatime}POST\n{payload_hash}\n\n{URL}"
    if debug:
        print("StringToSign is now:", StringToSign)

    # Generate the signature
    CommandSign = hmac.new(ClientSecret.encode(), StringToSign.encode(), hashlib.sha256).hexdigest().upper()
    if debug:
        print("CommandSign is now:", CommandSign)

    # Headers
    headers = {
        "sign_method": "HMAC-SHA256",
        "client_id": ClientID,
        "t": tuyatime,
        "mode": "cors",
        "Content-Type": "application/json",
        "sign": CommandSign,
        "access_token": AccessToken
    }

    # Send the POST request
    response = requests.post(full_url, headers=headers, json=payload).json()
    if debug:
        print("TurnOnLightResponse is now:", response)

    # Check response
    if response.get("success"):
        print("✅ Light turned ON successfully!")
    else:
        print(f"❌ Failed to turn ON the light: {response.get('msg')}")


# Set debug value to True or False to (de)activate output
debug = True

# Load configuration file
config_file = "config.secret.json" if os.path.exists("config.secret.json") else "config.json"
with open(config_file, "r") as jsonfile:
    configData = json.load(jsonfile)
    if debug:
        print("Read successful")

# Declare constants
ClientID = configData["ClientID"]
ClientSecret = configData["ClientSecret"]
BaseUrl = configData["BaseUrl"]
deviceList = configData["deviceList"]
device_id = list(deviceList.keys())[0]  # Use the first device in the list
EmptyBodyEncoded = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
tuyatime = str(int(time.time()) * 1000)

if debug:
    print("Tuyatime is now", tuyatime)

# Get Access Token
access_token = get_access_token(ClientID, ClientSecret, BaseUrl, EmptyBodyEncoded, tuyatime, debug)

# Get Device Information
get_device_info(ClientID, ClientSecret, BaseUrl, EmptyBodyEncoded, tuyatime, access_token, deviceList, debug)

# Turn the light ON
turn_on_light(ClientID, ClientSecret, BaseUrl, EmptyBodyEncoded, tuyatime, access_token, device_id, debug)
