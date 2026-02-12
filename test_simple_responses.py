import requests
import json
from uuid import uuid4

# Configuration
BASE_URL = "http://127.0.0.1:8000"

print("Simple Chatbot Response Test")
print("="*40)

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

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {auth_token}'
}

conversation_id = None

# Test 1: Greeting
print(f"\nTest 1: Greeting")
chat_payload = {
    "message": "Hi there!",
    "conversation_id": conversation_id
}

chat_response = requests.post(
    f"{BASE_URL}/api/{user_id}/chat",
    json=chat_payload,
    headers=headers
)

if chat_response.status_code == 200:
    response_data = chat_response.json()
    conversation_id = response_data.get('conversation_id')
    print(f"   Response: '{response_data.get('response', 'NO RESPONSE')}'")
else:
    print(f"   [ERROR] Request failed: {chat_response.status_code}")

# Test 2: Add Task
print(f"\nTest 2: Add Task")
chat_payload = {
    "message": "Add a task: Buy groceries for the week",
    "conversation_id": conversation_id
}

chat_response = requests.post(
    f"{BASE_URL}/api/{user_id}/chat",
    json=chat_payload,
    headers=headers
)

if chat_response.status_code == 200:
    response_data = chat_response.json()
    conversation_id = response_data.get('conversation_id')
    print(f"   Response: '{response_data.get('response', 'NO RESPONSE')}'")
    print(f"   Tool Calls: {len(response_data.get('tool_calls', []))}")
else:
    print(f"   [ERROR] Request failed: {chat_response.status_code}")

# Test 3: List Tasks
print(f"\nTest 3: List Tasks")
chat_payload = {
    "message": "Show me my tasks",
    "conversation_id": conversation_id
}

chat_response = requests.post(
    f"{BASE_URL}/api/{user_id}/chat",
    json=chat_payload,
    headers=headers
)

if chat_response.status_code == 200:
    response_data = chat_response.json()
    conversation_id = response_data.get('conversation_id')
    print(f"   Response: '{response_data.get('response', 'NO RESPONSE')}'")
    print(f"   Tool Calls: {len(response_data.get('tool_calls', []))}")
else:
    print(f"   [ERROR] Request failed: {chat_response.status_code}")

print("\n" + "="*40)
print("Test completed. The chatbot should now provide")
print("more meaningful responses for task-related queries.")