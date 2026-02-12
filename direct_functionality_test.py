"""
Direct test of the chatbot functionality without requiring the server to be externally accessible.
This tests the core functionality by importing and calling the functions directly.
"""
import asyncio
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

import asyncio
from uuid import uuid4
from sqlmodel import Session
from main import app
from db import get_session
from models import User
from routes.chat import chat
from dependencies import get_current_user
from services.cohere_service import CohereService
from tools.mcp_tools import add_task, list_tasks, update_task, delete_task, complete_task


def test_chatbot_functionality():
    print("Testing Chatbot Functionality Directly...")
    print("="*60)

    # Get a database session
    session_gen = get_session()
    session = next(session_gen)

    try:
        # Create a test user directly in the database
        from routes.auth import get_password_hash
        test_user = User(
            email=f"testuser_{uuid4().hex[:8]}@example.com",
            name="Test User",
            password=get_password_hash("securepassword123")
        )
        session.add(test_user)
        session.commit()
        session.refresh(test_user)
        
        user_id = str(test_user.id)
        print(f"Created test user with ID: {user_id}")

        # Test 1: Add a task directly using the tool
        print("\nTest 1: Adding a task using add_task tool...")
        try:
            result = asyncio.run(add_task(user_id, "Buy groceries for dinner"))
            print(f"Add task result: {result}")
        except ImportError as e:
            print(f"Import error in add_task: {e}")
            # Try to fix the import issue by importing inside the function
            import sys
            import os
            backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
            sys.path.insert(0, backend_dir)
            
            # Re-import the function with fixed path
            from tools.mcp_tools import add_task as fixed_add_task
            result = asyncio.run(fixed_add_task(user_id, "Buy groceries for dinner"))
            print(f"Add task result: {result}")
        
        if result and result.get("success"):
            print("+ Task added successfully")
            task_id = result["task"]["id"]
        else:
            print("- Failed to add task")
            return False

        # Test 2: List tasks using the tool
        print("\nTest 2: Listing tasks using list_tasks tool...")
        try:
            result = asyncio.run(list_tasks(user_id))
        except ImportError:
            from tools.mcp_tools import list_tasks as fixed_list_tasks
            result = asyncio.run(fixed_list_tasks(user_id))
        print(f"List tasks result: Found {len(result.get('tasks', []))} tasks")
        
        if result["success"] and len(result["tasks"]) > 0:
            print("+ Tasks listed successfully")
        else:
            print("- Failed to list tasks")
            return False

        # Test 3: Update the task using the tool
        print("\nTest 3: Updating task using update_task tool...")
        try:
            result = asyncio.run(update_task(user_id, task_id, title="Buy groceries for family dinner"))
        except ImportError:
            from tools.mcp_tools import update_task as fixed_update_task
            result = asyncio.run(fixed_update_task(user_id, task_id, title="Buy groceries for family dinner"))
        print(f"Update task result: {result}")
        
        if result["success"]:
            print("+ Task updated successfully")
        else:
            print("- Failed to update task")
            return False

        # Test 4: Complete the task using the tool
        print("\nTest 4: Completing task using complete_task tool...")
        try:
            result = asyncio.run(complete_task(user_id, task_id))
        except ImportError:
            from tools.mcp_tools import complete_task as fixed_complete_task
            result = asyncio.run(fixed_complete_task(user_id, task_id))
        print(f"Complete task result: {result}")
        
        if result["success"]:
            print("+ Task completed successfully")
        else:
            print("- Failed to complete task")
            return False

        # Test 5: Delete the task using the tool
        print("\nTest 5: Deleting task using delete_task tool...")
        try:
            result = asyncio.run(delete_task(user_id, task_id))
        except ImportError:
            from tools.mcp_tools import delete_task as fixed_delete_task
            result = asyncio.run(fixed_delete_task(user_id, task_id))
        print(f"Delete task result: {result}")
        
        if result["success"]:
            print("+ Task deleted successfully")
        else:
            print("- Failed to delete task")
            return False

        # Final verification: List tasks again to ensure deletion
        print("\nFinal verification: Listing tasks again...")
        try:
            result = asyncio.run(list_tasks(user_id))
        except ImportError:
            from tools.mcp_tools import list_tasks as fixed_list_tasks
            result = asyncio.run(fixed_list_tasks(user_id))
        print(f"Tasks after deletion: {len(result.get('tasks', []))}")
        
        if result["success"] and len(result["tasks"]) == 0:
            print("+ Task was successfully deleted (not found in list)")
        else:
            print("- Task may not have been properly deleted")
            return False

        print("\n" + "="*60)
        print("All functionality tests passed!")
        print("+ Add, List, Update, Complete, and Delete operations work correctly")
        return True

    except Exception as e:
        print(f"Error during testing: {e}")
        import traceback
        traceback.print_exc()
        return False

    finally:
        # Clean up: remove tasks first (due to foreign key constraint)
        from sqlmodel import select
        from models import Task
        tasks_to_delete = session.exec(select(Task).where(Task.user_id == user_id)).all()
        for task in tasks_to_delete:
            session.delete(task)
        
        # Then remove the test user
        session.delete(test_user)
        session.commit()
        session.close()


if __name__ == "__main__":
    success = test_chatbot_functionality()
    if success:
        print("\n+ All chatbot operations verified successfully at the code level!")
        print("The functionality for adding, updating, completing, and deleting tasks is working properly.")
    else:
        print("\n- Some operations failed.")