import requests
import json
import os
from uuid import uuid4

# Configuration
BASE_URL = "http://127.0.0.1:8000"
TEST_USER_ID = str(uuid4())

print("Testing Chatbot Functionality...")
print(f"Using test user ID: {TEST_USER_ID}")
print("="*60)

# Step 1: Try to register a test user first (to get a valid token)
print("\nStep 1: Creating a test user...")

try:
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
        user_data = register_response.json()
        print(f"   User ID: {user_data.get('id', 'N/A')}")
    else:
        print(f"   [WARNING] User creation failed: {register_response.status_code}")
        print(f"   Response: {register_response.text}")
        
        # Try to continue with the test user ID anyway
        print(f"   Continuing with test user ID: {TEST_USER_ID}")

except Exception as e:
    print(f"   [ERROR] Registration failed: {e}")
    print(f"   Continuing with test user ID: {TEST_USER_ID}")

# Step 2: Try to send a message to the chatbot
print(f"\nStep 2: Testing chatbot with user ID {TEST_USER_ID}...")

# Try without authentication first to see the error
try:
    chat_payload = {
        "message": "Hello, can you help me add a task?",
        "conversation_id": None
    }
    
    chat_response = requests.post(
        f"{BASE_URL}/api/{TEST_USER_ID}/chat",
        json=chat_payload,
        headers={'Content-Type': 'application/json'}
    )
    
    print(f"   Status Code: {chat_response.status_code}")
    if chat_response.status_code == 401:
        print("   [EXPECTED] Received 401 Unauthorized (need valid JWT token)")
    else:
        print(f"   Response: {chat_response.text}")
        
except Exception as e:
    print(f"   [ERROR] Chat request failed: {e}")

# Step 3: Try logging in to get a valid token
print(f"\nStep 3: Attempting to login with test credentials...")

try:
    login_payload = {
        "email": register_payload["email"],
        "password": register_payload["password"]
    }
    
    login_response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json=login_payload,
        headers={'Content-Type': 'application/json'}
    )
    
    if login_response.status_code == 200:
        login_data = login_response.json()
        auth_token = login_data.get('access_token')
        actual_user_id = login_data.get('user', {}).get('id', TEST_USER_ID)
        
        print("   [OK] Login successful")
        print(f"   Retrieved user ID: {actual_user_id}")
        
        # Step 4: Try to send a message with the valid token
        print(f"\nStep 4: Testing chatbot with valid authentication...")
        
        headers_with_auth = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {auth_token}'
        }
        
        chat_payload = {
            "message": "Hello, can you help me add a task?",
            "conversation_id": None
        }
        
        chat_response = requests.post(
            f"{BASE_URL}/api/{actual_user_id}/chat",
            json=chat_payload,
            headers=headers_with_auth
        )
        
        print(f"   Status Code: {chat_response.status_code}")
        
        if chat_response.status_code == 200:
            response_data = chat_response.json()
            print("   [SUCCESS] Chatbot responded successfully!")
            print(f"   Response: {response_data.get('response', 'N/A')}")
            print(f"   Conversation ID: {response_data.get('conversation_id', 'N/A')}")
            print(f"   Tool Calls: {len(response_data.get('tool_calls', []))}")
        else:
            print(f"   [ERROR] Chat request failed: {chat_response.status_code}")
            print(f"   Response: {chat_response.text}")
            
    else:
        print(f"   [ERROR] Login failed: {login_response.status_code}")
        print(f"   Response: {login_response.text}")

except Exception as e:
    print(f"   [ERROR] Login process failed: {e}")

print("\n" + "="*60)
print("Chatbot functionality test completed.")
print("If the test shows errors, check that:")
print("- COHERE_API_KEY is properly set in your .env file")
print("- The backend server is running on port 8000")
print("- The frontend is properly configured to send JWT tokens")