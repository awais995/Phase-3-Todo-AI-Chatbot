import requests
import json
from uuid import uuid4

# Configuration
BASE_URL = "http://127.0.0.1:8000"

print("Testing Chatbot Task Addition Functionality")
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

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {auth_token}'
}

conversation_id = None

# Step 2: Add a task via chatbot
print(f"\nStep 2: Adding task via chatbot...")
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
    print(f"   Chatbot Response: '{response_data.get('response', 'NO RESPONSE')}'")
    print(f"   Tool Calls Made: {len(response_data.get('tool_calls', []))}")
    
    # Check if the add_task tool was called
    tool_calls = response_data.get('tool_calls', [])
    add_task_called = any(tool['name'] == 'add_task' for tool in tool_calls)
    print(f"   Was add_task tool called? {'YES' if add_task_called else 'NO'}")
else:
    print(f"   [ERROR] Chat request failed: {chat_response.status_code}")
    exit(1)

# Step 3: Directly check the tasks via the API to verify the task was added
print(f"\nStep 3: Verifying task was added via direct API call...")
tasks_response = requests.get(
    f"{BASE_URL}/api/{user_id}/tasks",
    headers=headers
)

if tasks_response.status_code == 200:
    tasks_data = tasks_response.json()
    print(f"   Total tasks found: {len(tasks_data)}")
    
    # Check if the specific task was added
    task_found = any(task.get('title') == 'Buy groceries for the week' for task in tasks_data)
    print(f"   Task 'Buy groceries for the week' found? {'YES' if task_found else 'NO'}")
    
    if task_found:
        print("   [SUCCESS] Task was successfully added to the database!")
    else:
        print("   [FAILURE] Task was NOT added to the database!")
        
    # Print all tasks for verification
    print(f"   All tasks: {json.dumps(tasks_data, indent=2)}")
else:
    print(f"   [ERROR] Failed to retrieve tasks: {tasks_response.status_code}")

print("\n" + "="*60)
print("TASK ADDITION VERIFICATION COMPLETE")
if task_found:
    print("✅ SUCCESS: Chatbot is properly adding tasks to the database")
else:
    print("❌ FAILURE: Chatbot is not adding tasks to the database")
print("The issue needs to be fixed in the tool execution or parameter mapping.")