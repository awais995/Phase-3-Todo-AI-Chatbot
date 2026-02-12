import requests
import json
from uuid import uuid4

# Configuration
BASE_URL = "http://127.0.0.1:8000"

print("Testing Chatbot Detailed Response...")
print("="*60)

# Step 1: Create a test user and login
print("\nStep 1: Creating and logging in test user...")

# Register a temporary user
register_payload = {
    "email": f"testuser_{uuid4().hex[:8]}@example.com",
    "name": "Test User",
    "password": "securepassword123"
}

register_response = requests.post(
    f"{BASE_URL}/api/auth/register",
    json=register_payload,
    headers={'Content-Type': 'application/json'}
)

if register_response.status_code == 200:
    print("   [OK] Test user created successfully")
else:
    print(f"   [ERROR] User creation failed: {register_response.status_code}")
    exit(1)

# Login to get token
login_response = requests.post(
    f"{BASE_URL}/api/auth/login",
    json={
        "email": register_payload["email"],
        "password": register_payload["password"]
    },
    headers={'Content-Type': 'application/json'}
)

if login_response.status_code == 200:
    login_data = login_response.json()
    auth_token = login_data.get('access_token')
    user_id = login_data.get('user', {}).get('id')
    print(f"   [OK] Login successful, User ID: {user_id}")
else:
    print(f"   [ERROR] Login failed: {login_response.status_code}")
    exit(1)

# Step 2: Test adding a task with detailed output
print(f"\nStep 2: Testing task addition with detailed output...")

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {auth_token}'
}

chat_payload = {
    "message": "Add a task: Buy groceries for the week",
    "conversation_id": None
}

chat_response = requests.post(
    f"{BASE_URL}/api/{user_id}/chat",
    json=chat_payload,
    headers=headers
)

if chat_response.status_code == 200:
    response_data = chat_response.json()
    print("   [OK] Task addition request successful")
    print(f"   Full Response Data: {json.dumps(response_data, indent=2)}")
    
    # Check if tool was called
    tool_calls = response_data.get('tool_calls', [])
    if tool_calls:
        print(f"   Tool called: {tool_calls[0]['name']}")
        print(f"   Arguments: {tool_calls[0]['arguments']}")
    else:
        print("   No tool calls were made")
else:
    print(f"   [ERROR] Task addition failed: {chat_response.status_code}")
    print(f"   Response: {chat_response.text}")

# Step 3: Test listing tasks
print(f"\nStep 3: Testing task listing...")

chat_payload = {
    "message": "Show me my tasks",
    "conversation_id": response_data.get('conversation_id')
}

chat_response = requests.post(
    f"{BASE_URL}/api/{user_id}/chat",
    json=chat_payload,
    headers=headers
)

if chat_response.status_code == 200:
    response_data = chat_response.json()
    print("   [OK] Task listing request successful")
    print(f"   Response: '{response_data.get('response', 'NO RESPONSE')}'")
    print(f"   Tool Calls: {len(response_data.get('tool_calls', []))}")
else:
    print(f"   [ERROR] Task listing failed: {chat_response.status_code}")
    print(f"   Response: {chat_response.text}")

print("\n" + "="*60)
print("Detailed chatbot response test completed.")