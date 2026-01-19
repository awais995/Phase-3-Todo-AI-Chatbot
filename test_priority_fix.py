#!/usr/bin/env python3
"""
Test script to verify the priority field fix in the todo app.
This script tests that the priority field is properly saved and retrieved from the database.
"""

import requests
import json
import uuid

def test_priority_functionality():
    """Test the priority functionality of the todo app."""

    # Configuration
    BASE_URL = "http://localhost:8000"
    EMAIL = f"test_{uuid.uuid4()}@example.com"
    PASSWORD = "testpassword123"
    NAME = "Test User"

    print("Testing priority functionality...")

    # Step 1: Register a new user
    print("\n1. Registering new user...")
    register_response = requests.post(f"{BASE_URL}/api/auth/register", json={
        "email": EMAIL,
        "name": NAME,
        "password": PASSWORD
    })

    if register_response.status_code != 200:
        print(f"❌ Registration failed: {register_response.text}")
        return False

    register_data = register_response.json()
    user_id = register_data["id"]
    access_token = register_data["access_token"] if "access_token" in register_data else None

    if not access_token:
        # Try to get token via login if not provided in registration
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": EMAIL,
            "password": PASSWORD
        })

        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.text}")
            return False

        login_data = login_response.json()
        access_token = login_data["access_token"]

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    print(f"✓ User registered successfully. User ID: {user_id}")

    # Step 2: Create tasks with different priorities
    print("\n2. Creating tasks with different priorities...")

    priorities_to_test = ["critical", "high", "medium", "low"]

    for priority in priorities_to_test:
        task_response = requests.post(f"{BASE_URL}/api/{user_id}/tasks", json={
            "title": f"Test Task - {priority} priority",
            "description": f"This is a test task with {priority} priority",
            "priority": priority
        }, headers=headers)

        if task_response.status_code != 201:
            print(f"❌ Failed to create task with {priority} priority: {task_response.text}")
            return False

        task_data = task_response.json()
        print(f"✓ Created task with {priority} priority. Task ID: {task_data['id']}, Priority: {task_data['priority']}")

        # Verify the priority was saved correctly
        if task_data["priority"] != priority:
            print(f"❌ Priority mismatch: expected {priority}, got {task_data['priority']}")
            return False

    # Step 3: Get all tasks and verify priorities
    print("\n3. Retrieving all tasks and verifying priorities...")

    get_tasks_response = requests.get(f"{BASE_URL}/api/{user_id}/tasks", headers=headers)

    if get_tasks_response.status_code != 200:
        print(f"❌ Failed to get tasks: {get_tasks_response.text}")
        return False

    tasks = get_tasks_response.json()
    print(f"✓ Retrieved {len(tasks)} tasks")

    for task in tasks:
        expected_priority = task["title"].split(" - ")[1].split(" ")[0]  # Extract priority from title
        actual_priority = task["priority"]

        print(f"  Task '{task['title']}': Expected {expected_priority}, Got {actual_priority}")

        if expected_priority != actual_priority:
            print(f"❌ Priority mismatch for task {task['id']}: expected {expected_priority}, got {actual_priority}")
            return False

    # Step 4: Update a task's priority
    print("\n4. Updating a task's priority...")

    if len(tasks) > 0:
        task_to_update = tasks[0]
        new_priority = "critical" if task_to_update["priority"] != "critical" else "high"

        update_response = requests.put(
            f"{BASE_URL}/api/{user_id}/tasks/{task_to_update['id']}",
            json={"priority": new_priority},
            headers=headers
        )

        if update_response.status_code != 200:
            print(f"❌ Failed to update task priority: {update_response.text}")
            return False

        updated_task = update_response.json()
        print(f"✓ Updated task {task_to_update['id']} priority to {updated_task['priority']}")

        if updated_task["priority"] != new_priority:
            print(f"❌ Priority update failed: expected {new_priority}, got {updated_task['priority']}")
            return False

        # Verify the update by getting the task again
        get_updated_response = requests.get(f"{BASE_URL}/api/{user_id}/tasks/{task_to_update['id']}", headers=headers)
        if get_updated_response.status_code != 200:
            print(f"❌ Failed to get updated task: {get_updated_response.text}")
            return False

        refreshed_task = get_updated_response.json()
        if refreshed_task["priority"] != new_priority:
            print(f"❌ Priority not persisted after update: expected {new_priority}, got {refreshed_task['priority']}")
            return False

        print(f"✓ Priority update verified in database")

    print("\n✅ All priority functionality tests passed!")
    return True


if __name__ == "__main__":
    success = test_priority_functionality()
    if not success:
        print("\n❌ Some tests failed!")
        exit(1)
    else:
        print("\n🎉 All tests passed! Priority functionality is working correctly.")