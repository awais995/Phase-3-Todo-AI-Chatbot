import requests
import json
from uuid import uuid4
import time

# Configuration
BASE_URL = "http://127.0.0.1:8000"

def run_verification_test():
    print("Running Detailed Verification Test...")
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
    
    # Step 2: Add a task via chatbot
    print(f"\nStep 2: Adding a task via chatbot...")
    
    chat_payload = {
        "message": "Add a task: Buy groceries for dinner",
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
        print(f"   Response: '{response_data.get('response', '')}'")
        
        # Check if the response indicates success
        response_text = response_data.get('response', '').lower()
        if "sorry" in response_text or "couldn't" in response_text:
            print("   [ISSUE] Task addition may have failed based on response")
        else:
            print("   [OK] Task addition response looks positive")
    else:
        print(f"   [ERROR] Task addition failed: {chat_response.status_code}")
        return False

    # Small delay to ensure task is processed
    time.sleep(2)

    # Step 3: List tasks to verify the task was added
    print(f"\nStep 3: Verifying task was added by listing tasks...")

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
        print(f"   Response: '{response_data.get('response', '')}'")
        
        # Also make a direct API call to verify
        direct_response = requests.get(
            f"{BASE_URL}/api/{user_id}/tasks",
            headers=headers
        )
        
        if direct_response.status_code in [200, 201]:
            tasks = direct_response.json()
            print(f"   Direct API check: Found {len(tasks)} tasks")
            for task in tasks:
                print(f"     - Task ID: {task['id']}, Title: {task['title']}, Completed: {task['completed']}")
            
            if len(tasks) > 0:
                print("   [OK] Task was successfully added to database")
                first_task_id = tasks[0]['id']
            else:
                print("   [ERROR] No tasks found in database")
                return False
        else:
            print(f"   [ERROR] Direct API call failed: {direct_response.status_code}")
            return False
    else:
        print(f"   [ERROR] Task listing failed: {chat_response.status_code}")
        return False

    # Small delay
    time.sleep(2)

    # Step 4: Update the task
    print(f"\nStep 4: Updating the task...")
    
    chat_payload = {
        "message": f"Update the task with ID {first_task_id} to 'Buy groceries for family dinner tonight'",
        "conversation_id": conversation_id
    }

    chat_response = requests.post(
        f"{BASE_URL}/api/{user_id}/chat",
        json=chat_payload,
        headers=headers
    )

    if chat_response.status_code == 200:
        response_data = chat_response.json()
        print(f"   Response: '{response_data.get('response', '')}'")
        
        response_text = response_data.get('response', '').lower()
        if "sorry" in response_text or "couldn't" in response_text:
            print("   [ISSUE] Task update may have failed based on response")
        else:
            print("   [OK] Task update response looks positive")
    else:
        print(f"   [ERROR] Task update failed: {chat_response.status_code}")
        return False

    # Small delay to ensure update is processed
    time.sleep(2)

    # Step 5: Verify the update
    print(f"\nStep 5: Verifying task was updated...")

    direct_response = requests.get(
        f"{BASE_URL}/api/{user_id}/tasks",
        headers=headers
    )
    
    if direct_response.status_code in [200, 201]:
        tasks = direct_response.json()
        print(f"   Direct API check: Found {len(tasks)} tasks after update")
        for task in tasks:
            print(f"     - Task ID: {task['id']}, Title: {task['title']}, Completed: {task['completed']}")
        
        if len(tasks) > 0 and tasks[0]['title'] == 'Buy groceries for family dinner tonight':
            print("   [OK] Task was successfully updated in database")
        else:
            print("   [ERROR] Task was not updated properly")
            return False
    else:
        print(f"   [ERROR] Direct API call failed: {direct_response.status_code}")
        return False

    # Small delay
    time.sleep(2)

    # Step 6: Complete the task
    print(f"\nStep 6: Completing the task...")

    chat_payload = {
        "message": f"Complete the task with ID {first_task_id}",
        "conversation_id": conversation_id
    }

    chat_response = requests.post(
        f"{BASE_URL}/api/{user_id}/chat",
        json=chat_payload,
        headers=headers
    )

    if chat_response.status_code == 200:
        response_data = chat_response.json()
        print(f"   Response: '{response_data.get('response', '')}'")
        
        response_text = response_data.get('response', '').lower()
        if "sorry" in response_text or "couldn't" in response_text:
            print("   [ISSUE] Task completion may have failed based on response")
        else:
            print("   [OK] Task completion response looks positive")
    else:
        print(f"   [ERROR] Task completion failed: {chat_response.status_code}")
        return False

    # Small delay to ensure completion is processed
    time.sleep(2)

    # Step 7: Verify the completion
    print(f"\nStep 7: Verifying task was completed...")

    direct_response = requests.get(
        f"{BASE_URL}/api/{user_id}/tasks",
        headers=headers
    )
    
    if direct_response.status_code in [200, 201]:
        tasks = direct_response.json()
        print(f"   Direct API check: Found {len(tasks)} tasks after completion")
        for task in tasks:
            print(f"     - Task ID: {task['id']}, Title: {task['title']}, Completed: {task['completed']}")
        
        if len(tasks) > 0 and tasks[0]['completed']:
            print("   [OK] Task was successfully completed in database")
        else:
            print("   [ERROR] Task was not completed properly")
            return False
    else:
        print(f"   [ERROR] Direct API call failed: {direct_response.status_code}")
        return False

    # Small delay
    time.sleep(2)

    # Step 8: Delete the task
    print(f"\nStep 8: Deleting the task...")

    chat_payload = {
        "message": f"Delete the task with ID {first_task_id}",
        "conversation_id": conversation_id
    }

    chat_response = requests.post(
        f"{BASE_URL}/api/{user_id}/chat",
        json=chat_payload,
        headers=headers
    )

    if chat_response.status_code == 200:
        response_data = chat_response.json()
        print(f"   Response: '{response_data.get('response', '')}'")
        
        response_text = response_data.get('response', '').lower()
        if "sorry" in response_text or "couldn't" in response_text:
            print("   [ISSUE] Task deletion may have failed based on response")
        else:
            print("   [OK] Task deletion response looks positive")
    else:
        print(f"   [ERROR] Task deletion failed: {chat_response.status_code}")
        return False

    # Small delay to ensure deletion is processed
    time.sleep(2)

    # Step 9: Verify the deletion
    print(f"\nStep 9: Verifying task was deleted...")

    direct_response = requests.get(
        f"{BASE_URL}/api/{user_id}/tasks",
        headers=headers
    )
    
    if direct_response.status_code in [200, 201]:
        tasks = direct_response.json()
        print(f"   Direct API check: Found {len(tasks)} tasks after deletion")
        
        if len(tasks) == 0:
            print("   [OK] Task was successfully deleted from database")
        else:
            print("   [ERROR] Task was not deleted properly")
            return False
    else:
        print(f"   [ERROR] Direct API call failed: {direct_response.status_code}")
        return False

    print("\n" + "="*60)
    print("Detailed Verification Test Completed!")
    print("All operations (Add, Update, Complete, Delete) have been verified in the database.")
    return True

if __name__ == "__main__":
    success = run_verification_test()
    if success:
        print("\n✅ All operations verified successfully in the database!")
    else:
        print("\n❌ Some operations failed verification.")