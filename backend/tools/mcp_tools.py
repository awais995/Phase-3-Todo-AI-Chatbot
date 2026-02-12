"""
MCP Tools for the AI Chatbot
Each tool is stateless and enforces user isolation by accepting user_id parameter
"""

import httpx
from typing import Dict, Any, Optional
import os
from pydantic import BaseModel


class TaskResponse(BaseModel):
    id: int
    user_id: str
    title: str
    description: Optional[str] = None
    completed: bool
    created_at: str
    updated_at: str


async def add_task(user_id: str, title: Optional[str] = None, task: Optional[str] = None, description: Optional[str] = None) -> Dict[str, Any]:
    """
    Add a new task for the user.
    Delegates to the existing Phase 2 REST endpoint.
    """
    # Use 'task' if 'title' is not provided
    actual_title = title if title is not None else task
    
    if actual_title is None:
        return {
            "success": False,
            "error": "Either 'title' or 'task' parameter must be provided",
            "message": "Sorry, I couldn't add the task. Missing title information. Please try again."
        }

    try:
        # Import the database session dependency that's used in the main app
        import sys
        import os
        sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from db import get_session
        from models import Task
        from datetime import datetime

        print(f"DEBUG: add_task called with user_id={user_id}, title={actual_title}, description={description}")

        # Get a session using the same method as the main app
        session_generator = get_session()
        session = next(session_generator)

        try:
            # Create the task directly in the database
            task_obj = Task(
                user_id=user_id,
                title=actual_title,
                description=description or "",
                completed=False,
                priority="medium"  # Set default priority
            )

            session.add(task_obj)
            session.commit()
            session.refresh(task_obj)

            print(f"DEBUG: Task added successfully with ID: {task_obj.id}")

            return {
                "success": True,
                "task": {
                    "id": task_obj.id,
                    "user_id": task_obj.user_id,
                    "title": task_obj.title,
                    "description": task_obj.description or "",
                    "completed": task_obj.completed,
                    "created_at": str(task_obj.created_at),
                    "updated_at": str(task_obj.updated_at)
                },
                "message": f"Task '{actual_title}' has been added successfully."
            }
        finally:
            # Close the session
            session.close()

    except Exception as e:
        # Log the specific error for debugging
        print(f"Error in add_task: {str(e)}")  # This will help us debug
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        return {
            "success": False,
            "error": f"An error occurred while adding the task: {str(e)}",
            "message": f"Sorry, I couldn't add the task '{actual_title}'. Please try again."
        }


async def list_tasks(user_id: str, status: Optional[str] = "all") -> Dict[str, Any]:
    """
    List tasks for the user.
    Uses direct database access for consistency with other tools.
    """
    try:
        # Import the database session dependency that's used in the main app
        import sys
        import os
        sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from db import get_session
        from models import Task
        from sqlmodel import select, and_
        from datetime import datetime

        # Get a session using the same method as the main app
        session_generator = get_session()
        session = next(session_generator)

        try:
            # Build the query based on the status parameter
            query = select(Task).where(Task.user_id == user_id)

            if status == "completed":
                query = query.where(Task.completed == True)
            elif status == "pending":
                query = query.where(Task.completed == False)
            # If status is "all", don't add additional filters

            tasks = session.exec(query).all()

            # Convert tasks to dictionaries
            tasks_data = []
            for task in tasks:
                task_dict = {
                    "id": task.id,
                    "user_id": task.user_id,
                    "title": task.title,
                    "description": task.description or "",
                    "completed": task.completed,
                    "created_at": str(task.created_at),
                    "updated_at": str(task.updated_at),
                    "priority": task.priority
                }
                tasks_data.append(task_dict)

            task_count = len(tasks_data)
            status_text = f" ({status})" if status != "all" else ""
            
            # Create a detailed message with task information
            if task_count == 0:
                message = f"You have no tasks{status_text}."
            elif task_count == 1:
                task_item = tasks_data[0]
                message = f"You have 1 task{status_text}: {task_item['id']}. {task_item['title']}"
            else:
                task_list = [f"{task['id']}. {task['title']}" for task in tasks_data]
                tasks_str = "; ".join(task_list)
                message = f"You have {task_count} task{'' if task_count == 1 else 's'}{status_text}: {tasks_str}"

            return {
                "success": True,
                "tasks": tasks_data,
                "message": message
            }
        finally:
            # Close the session
            session.close()

    except Exception as e:
        # Log the specific error for debugging
        import traceback
        print(f"Error in list_tasks: {str(e)}")  # This will help us debug
        print(f"Full traceback: {traceback.format_exc()}")
        return {
            "success": False,
            "error": f"An error occurred while listing tasks: {str(e)}",
            "message": "Sorry, I couldn't retrieve your tasks. Please try again."
        }


async def complete_task(user_id: str, task_id: int) -> Dict[str, Any]:
    """
    Mark a task as completed.
    Uses direct database access for consistency with other tools.
    """
    try:
        # Import the database session dependency that's used in the main app
        import sys
        import os
        sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from db import get_session
        from models import Task
        from sqlmodel import select
        from datetime import datetime

        # Get a session using the same method as the main app
        session_generator = get_session()
        session = next(session_generator)

        try:
            # Find the task by ID and user_id to enforce user isolation
            task = session.exec(
                select(Task).where(Task.id == task_id, Task.user_id == user_id)
            ).first()

            if not task:
                return {
                    "success": False,
                    "error": f"Task with ID {task_id} not found.",
                    "message": f"I couldn't find a task with ID {task_id}. Could you please check the task ID?"
                }

            # Update the task's completion status
            task.completed = True
            task.updated_at = datetime.utcnow()
            session.add(task)
            session.commit()
            session.refresh(task)

            return {
                "success": True,
                "task": {
                    "id": task.id,
                    "user_id": task.user_id,
                    "title": task.title,
                    "description": task.description or "",
                    "completed": task.completed,
                    "created_at": str(task.created_at),
                    "updated_at": str(task.updated_at),
                    "priority": task.priority
                },
                "message": f"Task '{task.title}' has been marked as completed."
            }
        finally:
            # Close the session
            session.close()

    except Exception as e:
        # Log the specific error for debugging
        import traceback
        print(f"Error in complete_task: {str(e)}")  # This will help us debug
        print(f"Full traceback: {traceback.format_exc()}")
        return {
            "success": False,
            "error": f"An error occurred while completing the task: {str(e)}",
            "message": f"Sorry, I couldn't complete the task. Please try again."
        }


async def delete_task(user_id: str, task_id: int) -> Dict[str, Any]:
    """
    Delete a task.
    Uses direct database access for consistency with other tools.
    """
    try:
        # Import the database session dependency that's used in the main app
        import sys
        import os
        sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from db import get_session
        from models import Task
        from sqlmodel import select
        from datetime import datetime

        # Get a session using the same method as the main app
        session_generator = get_session()
        session = next(session_generator)

        try:
            # Find the task by ID and user_id to enforce user isolation
            task = session.exec(
                select(Task).where(Task.id == task_id, Task.user_id == user_id)
            ).first()

            if not task:
                return {
                    "success": False,
                    "error": f"Task with ID {task_id} not found.",
                    "message": f"I couldn't find a task with ID {task_id}. Could you please check the task ID?"
                }

            # Delete the task
            session.delete(task)
            session.commit()

            return {
                "success": True,
                "message": f"Task with ID {task_id} has been deleted."
            }
        finally:
            # Close the session
            session.close()

    except Exception as e:
        # Log the specific error for debugging
        import traceback
        print(f"Error in delete_task: {str(e)}")  # This will help us debug
        print(f"Full traceback: {traceback.format_exc()}")
        return {
            "success": False,
            "error": f"An error occurred while deleting the task: {str(e)}",
            "message": f"Sorry, I couldn't delete the task. Please try again."
        }


async def update_task(user_id: str, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> Dict[str, Any]:
    """
    Update a task's details.
    Uses direct database access for consistency with other tools.
    """
    try:
        # Import the database session dependency that's used in the main app
        import sys
        import os
        sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from db import get_session
        from models import Task
        from sqlmodel import select
        from datetime import datetime

        # Get a session using the same method as the main app
        session_generator = get_session()
        session = next(session_generator)

        try:
            # Find the task by ID and user_id to enforce user isolation
            task = session.exec(
                select(Task).where(Task.id == task_id, Task.user_id == user_id)
            ).first()

            if not task:
                return {
                    "success": False,
                    "error": f"Task with ID {task_id} not found.",
                    "message": f"I couldn't find a task with ID {task_id}. Could you please check the task ID?"
                }

            # Update the task's fields if provided
            if title is not None:
                task.title = title
            if description is not None:
                task.description = description
            task.updated_at = datetime.utcnow()
            
            session.add(task)
            session.commit()
            session.refresh(task)

            # Determine what was updated for the message
            changes = []
            if title is not None:
                changes.append(f"title to '{title}'")
            if description is not None:
                changes.append(f"description to '{description}'")

            changes_str = " and ".join(changes)
            return {
                "success": True,
                "task": {
                    "id": task.id,
                    "user_id": task.user_id,
                    "title": task.title,
                    "description": task.description or "",
                    "completed": task.completed,
                    "created_at": str(task.created_at),
                    "updated_at": str(task.updated_at),
                    "priority": task.priority
                },
                "message": f"Task '{task.title}' has been updated ({changes_str})."
            }
        finally:
            # Close the session
            session.close()

    except Exception as e:
        # Log the specific error for debugging
        import traceback
        print(f"Error in update_task: {str(e)}")  # This will help us debug
        print(f"Full traceback: {traceback.format_exc()}")
        return {
            "success": False,
            "error": f"An error occurred while updating the task: {str(e)}",
            "message": f"Sorry, I couldn't update the task. Please try again."
        }