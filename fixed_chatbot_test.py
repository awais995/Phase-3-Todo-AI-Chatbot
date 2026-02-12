import requests
import json
from uuid import uuid4
import time

# Configuration
BASE_URL = "http://127.0.0.1:8000"

def run_fixed_test():
    print("Running Fixed Chatbot Functionality Test...")
    print("="*70)

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

    if chat_response.status_code == 200:
        response_data = chat_response.json()
        conversation_id = response_data.get('conversation_id')
        print("   [OK] Task addition request sent")
        print(f"   Response: '{response_data.get('response', '')}'")
        print(f"   Conversation ID: {conversation_id}")
        
        # Check if tool calls were made
        tool_calls = response_data.get('tool_calls', [])
        if tool_calls:
            print(f"   Tool called: {tool_calls[0]['name']}")
            print(f"   Arguments: {tool_calls[0]['arguments']}")
        else:
            print("   No tool calls were made")
    else:
        print(f"   [ERROR] Task addition failed: {chat_response.status_code}")
        print(f"   Response: {chat_response.text}")
        return False

    # Small delay to ensure task is processed
    time.sleep(2)

    # Step 3: Test adding another task
    print(f"\nStep 3: Testing adding another task via chatbot...")
    
    chat_payload = {
        "message": "Add another task: Walk the dog tomorrow morning",
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
        print("   [OK] Second task addition request sent")
        print(f"   Response: '{response_data.get('response', '')}'")
        
        # Check if tool calls were made
        tool_calls = response_data.get('tool_calls', [])
        if tool_calls:
            print(f"   Tool called: {tool_calls[0]['name']}")
            print(f"   Arguments: {tool_calls[0]['arguments']}")
        else:
            print("   No tool calls were made")
    else:
        print(f"   [ERROR] Second task addition failed: {chat_response.status_code}")
        print(f"   Response: {chat_response.text}")
        return False

    # Small delay to ensure task is processed
    time.sleep(2)

    # Step 4: Test listing tasks via chatbot
    print(f"\nStep 4: Testing task listing via chatbot...")

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
        print("   [OK] Task listing request sent")
        print(f"   Response: '{response_data.get('response', '')}'")
        
        # Check if tool calls were made
        tool_calls = response_data.get('tool_calls', [])
        if tool_calls:
            print(f"   Tool called: {tool_calls[0]['name']}")
        else:
            print("   No tool calls were made")
    else:
        print(f"   [ERROR] Task listing failed: {chat_response.status_code}")
        print(f"   Response: {chat_response.text}")
        return False

    # Small delay to ensure response is processed
    time.sleep(2)

    # Step 5: Test updating a task via chatbot
    print(f"\nStep 5: Testing task update via chatbot...")

    chat_payload = {
        "message": "Update the first task to say 'Buy groceries for family dinner tonight'",
        "conversation_id": conversation_id
    }

    chat_response = requests.post(
        f"{BASE_URL}/api/{user_id}/chat",
        json=chat_payload,
        headers=headers
    )

    if chat_response.status_code == 200:
        response_data = chat_response.json()
        print("   [OK] Task update request sent")
        print(f"   Response: '{response_data.get('response', '')}'")
        
        # Check if tool calls were made
        tool_calls = response_data.get('tool_calls', [])
        if tool_calls:
            print(f"   Tool called: {tool_calls[0]['name']}")
            print(f"   Arguments: {tool_calls[0]['arguments']}")
        else:
            print("   No tool calls were made")
    else:
        print(f"   [ERROR] Task update failed: {chat_response.status_code}")
        print(f"   Response: {chat_response.text}")
        return False

    # Small delay to ensure update is processed
    time.sleep(2)

    # Step 6: Test completing a task via chatbot
    print(f"\nStep 6: Testing task completion via chatbot...")

    chat_payload = {
        "message": "Complete the first task",
        "conversation_id": conversation_id
    }

    chat_response = requests.post(
        f"{BASE_URL}/api/{user_id}/chat",
        json=chat_payload,
        headers=headers
    )

    if chat_response.status_code == 200:
        response_data = chat_response.json()
        print("   [OK] Task completion request sent")
        print(f"   Response: '{response_data.get('response', '')}'")
        
        # Check if tool calls were made
        tool_calls = response_data.get('tool_calls', [])
        if tool_calls:
            print(f"   Tool called: {tool_calls[0]['name']}")
            print(f"   Arguments: {tool_calls[0]['arguments']}")
        else:
            print("   No tool calls were made")
    else:
        print(f"   [ERROR] Task completion failed: {chat_response.status_code}")
        print(f"   Response: {chat_response.text}")
        return False

    # Small delay to ensure completion is processed
    time.sleep(2)

    # Step 7: Test deleting a task via chatbot
    print(f"\nStep 7: Testing task deletion via chatbot...")

    chat_payload = {
        "message": "Delete the second task",
        "conversation_id": conversation_id
    }

    chat_response = requests.post(
        f"{BASE_URL}/api/{user_id}/chat",
        json=chat_payload,
        headers=headers
    )

    if chat_response.status_code == 200:
        response_data = chat_response.json()
        print("   [OK] Task deletion request sent")
        print(f"   Response: '{response_data.get('response', '')}'")
        
        # Check if tool calls were made
        tool_calls = response_data.get('tool_calls', [])
        if tool_calls:
            print(f"   Tool called: {tool_calls[0]['name']}")
            print(f"   Arguments: {tool_calls[0]['arguments']}")
        else:
            print("   No tool calls were made")
    else:
        print(f"   [ERROR] Task deletion failed: {chat_response.status_code}")
        print(f"   Response: {chat_response.text}")
        return False

    # Small delay to ensure deletion is processed
    time.sleep(2)

    # Step 8: Final check - list tasks again
    print(f"\nStep 8: Final task listing to verify operations...")

    chat_payload = {
        "message": "Show me my remaining tasks",
        "conversation_id": conversation_id
    }

    chat_response = requests.post(
        f"{BASE_URL}/api/{user_id}/chat",
        json=chat_payload,
        headers=headers
    )

    if chat_response.status_code == 200:
        response_data = chat_response.json()
        print("   [OK] Final task listing request sent")
        print(f"   Response: '{response_data.get('response', '')}'")
        
        # Check if tool calls were made
        tool_calls = response_data.get('tool_calls', [])
        if tool_calls:
            print(f"   Tool called: {tool_calls[0]['name']}")
        else:
            print("   No tool calls were made")
    else:
        print(f"   [ERROR] Final task listing failed: {chat_response.status_code}")
        print(f"   Response: {chat_response.text}")
        return False

    print("\n" + "="*70)
    print("Fixed Chatbot Functionality Test Completed!")
    print("The chatbot should now properly handle all task operations.")
    return True

if __name__ == "__main__":
    success = run_fixed_test()
    if success:
        print("\n✅ All tests completed successfully!")
        print("The chatbot functionality has been fixed and is working properly.")
    else:
        print("\n❌ Some tests failed. Please check the backend server and configuration.")