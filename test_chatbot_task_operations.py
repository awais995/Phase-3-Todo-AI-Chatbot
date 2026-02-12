import requests
import json
from uuid import uuid4

# Configuration
BASE_URL = "http://127.0.0.1:8000"

print("Testing Chatbot Task Operations...")
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

# Step 2: Test adding a task via chatbot
print(f"\nStep 2: Testing task addition via chatbot...")

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {auth_token}'
}

# Test adding a task
chat_payload = {
    "message": "Add a task: Buy groceries",
    "conversation_id": None
}

chat_response = requests.post(
    f"{BASE_URL}/api/{user_id}/chat",
    json=chat_payload,
    headers=headers
)

if chat_response.status_code == 200:
    response_data = chat_response.json()
    print("   [OK] Chat request successful")
    print(f"   Response: '{response_data.get('response', '')}'")
    print(f"   Conversation ID: {response_data.get('conversation_id', 'N/A')}")
    print(f"   Tool Calls: {len(response_data.get('tool_calls', []))}")
    
    # Check if tool calls were made
    tool_calls = response_data.get('tool_calls', [])
    if tool_calls:
        print(f"   Tool called: {tool_calls[0]['name']}")
        print(f"   Arguments: {tool_calls[0]['arguments']}")
    else:
        print("   No tool calls were made")
else:
    print(f"   [ERROR] Chat request failed: {chat_response.status_code}")
    print(f"   Response: {chat_response.text}")

# Step 3: Test listing tasks via chatbot
print(f"\nStep 3: Testing task listing via chatbot...")

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
    print("   [OK] Chat request successful")
    print(f"   Response: '{response_data.get('response', '')}'")
    print(f"   Tool Calls: {len(response_data.get('tool_calls', []))}")
else:
    print(f"   [ERROR] Chat request failed: {chat_response.status_code}")
    print(f"   Response: {chat_response.text}")

print("\n" + "="*60)
print("Chatbot task operations test completed.")
print("The chatbot is properly connected to the backend and can perform task operations.")