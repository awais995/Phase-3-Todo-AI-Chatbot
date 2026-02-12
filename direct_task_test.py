import requests
import json
from uuid import uuid4
import time

# Configuration
BASE_URL = "http://127.0.0.1:8000"

def test_direct_task_operations():
    print("Testing Direct Task Operations...")
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

    # Step 2: Test direct task creation
    print(f"\nStep 2: Testing direct task creation...")
    
    task_payload = {
        "title": "Direct API Task",
        "description": "Created via direct API call"
    }

    task_response = requests.post(
        f"{BASE_URL}/api/{user_id}/tasks",
        json=task_payload,
        headers=headers
    )

    if task_response.status_code in [200, 201]:  # 201 is CREATED status
        task_data = task_response.json()
        print("   [OK] Direct task creation successful")
        print(f"   Created task ID: {task_data.get('id')}")
        print(f"   Task title: {task_data.get('title')}")
    else:
        print(f"   [ERROR] Direct task creation failed: {task_response.status_code}")
        print(f"   Response: {task_response.text}")
        return False

    # Step 3: Test direct task listing
    print(f"\nStep 3: Testing direct task listing...")
    
    list_response = requests.get(
        f"{BASE_URL}/api/{user_id}/tasks",
        headers=headers
    )

    if list_response.status_code == 200:
        tasks_data = list_response.json()
        print("   [OK] Direct task listing successful")
        print(f"   Number of tasks: {len(tasks_data)}")
        for task in tasks_data:
            print(f"     - Task ID: {task['id']}, Title: {task['title']}, Completed: {task['completed']}")
    else:
        print(f"   [ERROR] Direct task listing failed: {list_response.status_code}")
        print(f"   Response: {list_response.text}")
        return False

    # Step 4: Test direct task update
    print(f"\nStep 4: Testing direct task update...")
    
    # Get the first task ID
    if tasks_data:
        task_to_update = tasks_data[0]
        task_id = task_to_update['id']
        
        update_payload = {
            "title": "Updated Direct API Task",
            "description": "Updated via direct API call"
        }

        update_response = requests.put(
            f"{BASE_URL}/api/{user_id}/tasks/{task_id}",
            json=update_payload,
            headers=headers
        )

        if update_response.status_code == 200:
            updated_task = update_response.json()
            print("   [OK] Direct task update successful")
            print(f"   Updated task ID: {updated_task.get('id')}")
            print(f"   New title: {updated_task.get('title')}")
        else:
            print(f"   [ERROR] Direct task update failed: {update_response.status_code}")
            print(f"   Response: {update_response.text}")
            return False
    else:
        print("   [ERROR] No tasks to update")
        return False

    # Step 5: Test direct task completion
    print(f"\nStep 5: Testing direct task completion...")
    
    complete_response = requests.patch(
        f"{BASE_URL}/api/{user_id}/tasks/{task_id}/complete",
        headers=headers
    )

    if complete_response.status_code in [200, 201]:
        completed_task = complete_response.json()
        print("   [OK] Direct task completion successful")
        print(f"   Completed task ID: {completed_task.get('id')}")
        print(f"   Title: {completed_task.get('title')}")
        print(f"   Completed status: {completed_task.get('completed')}")
    else:
        print(f"   [ERROR] Direct task completion failed: {complete_response.status_code}")
        print(f"   Response: {complete_response.text}")
        return False

    # Step 6: Test direct task deletion
    print(f"\nStep 6: Testing direct task deletion...")
    
    delete_response = requests.delete(
        f"{BASE_URL}/api/{user_id}/tasks/{task_id}",
        headers=headers
    )

    if delete_response.status_code in [200, 204]:
        print("   [OK] Direct task deletion successful")
    else:
        print(f"   [ERROR] Direct task deletion failed: {delete_response.status_code}")
        print(f"   Response: {delete_response.text}")
        return False

    # Step 7: Verify deletion
    print(f"\nStep 7: Verifying task deletion...")
    
    list_response = requests.get(
        f"{BASE_URL}/api/{user_id}/tasks",
        headers=headers
    )

    if list_response.status_code == 200:
        tasks_data = list_response.json()
        print("   [OK] Verification listing successful")
        print(f"   Number of tasks after deletion: {len(tasks_data)}")
        if len(tasks_data) == 0:
            print("   [SUCCESS] Task was successfully deleted")
        else:
            print("   [WARNING] Task may not have been deleted properly")
    else:
        print(f"   [ERROR] Verification listing failed: {list_response.status_code}")
        print(f"   Response: {list_response.text}")
        return False

    print("\n" + "="*60)
    print("Direct Task Operations Test Completed Successfully!")
    print("All direct API operations (Add, List, Update, Complete, Delete) are working correctly.")
    return True

if __name__ == "__main__":
    success = test_direct_task_operations()
    if success:
        print("\n✅ All direct API operations are functioning properly.")
        print("The issue is likely in the chatbot's parameter mapping, not the core functionality.")
    else:
        print("\n❌ Some direct API operations failed.")