import urllib.request
import json

try:
    # Test the root endpoint
    response = urllib.request.urlopen('http://127.0.0.1:8000/')
    data = response.read().decode('utf-8')
    print("Server response:", data)
    print("Server is accessible!")
except Exception as e:
    print(f"Error accessing server: {e}")