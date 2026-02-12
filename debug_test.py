import requests
import json
from uuid import uuid4
import time

# Configuration
BASE_URL = "http://127.0.0.1:8000"

def run_debug_test():
    print("Running Debug Chatbot Test...")
    print("="*50)

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
        print(f"   Response: {register_response.text}")
        return False

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
        print(f"   Response: {login_response.text}")
        return False

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {auth_token}'
    }

    # Store conversation ID for continuity
    conversation_id = None
    
    # Step 2: Test adding a task via chatbot
    print(f"\nStep 2: Testing task addition via chatbot...")
    
    chat_payload = {
        "message": "Add a task: Buy groceries for dinner tonight",
        "conversation_id": conversation_id
    }

    chat_response = requests.post(
        f"{BASE_URL}/api/{user_id}/chat",
        json=chat_payload,
        headers=headers
    )

    print(f"Response status: {chat_response.status_code}")
    print(f"Response: {chat_response.text}")

    return True

if __name__ == "__main__":
    run_debug_test()
    print("\nCheck the backend server console for debug output.")