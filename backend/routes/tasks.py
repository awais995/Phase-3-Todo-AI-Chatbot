from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from typing import List, Optional
from models import Task, TaskCreate, TaskUpdate, TaskRead, TaskToggleComplete
from dependencies import get_current_user
from db import get_session
from datetime import datetime

router = APIRouter(prefix="/api/{user_id}", tags=["tasks"])

@router.get("/tasks", response_model=List[TaskRead])
def get_tasks(
    user_id: str,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session),
    status_filter: Optional[str] = Query(None, alias="status"),
    sort_by: Optional[str] = Query("created", alias="sort")
):
    """
    Get all tasks for the specified user.
    Supports filtering by status (all/pending/completed) and sorting (created/title/due_date).
    """
    # Verify that the requested user_id matches the authenticated user_id
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's tasks"
        )

    # Build the query
    query = select(Task).where(Task.user_id == user_id)

    # Apply status filter if provided
    if status_filter:
        if status_filter.lower() == "pending":
            query = query.where(Task.completed == False)
        elif status_filter.lower() == "completed":
            query = query.where(Task.completed == True)
        elif status_filter.lower() != "all":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid status parameter. Use 'all', 'pending', or 'completed'."
            )

    # Apply sorting if provided
    if sort_by:
        if sort_by.lower() == "title":
            query = query.order_by(Task.title)
        elif sort_by.lower() == "created":
            query = query.order_by(Task.created_at.desc())
        # Note: due_date is not implemented in the model, but could be added

    tasks = session.exec(query).all()
    return tasks

@router.post("/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    user_id: str,
    task_data: TaskCreate,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the specified user.
    """
    # Verify that the requested user_id matches the authenticated user_id
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user"
        )

    # Validate title length
    if len(task_data.title) < 1 or len(task_data.title) > 200:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Title must be between 1 and 200 characters"
        )

    # Create the task
    task = Task(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority if task_data.priority else "medium",  # Set priority from request or default to medium
        user_id=user_id
    )

    session.add(task)
    session.commit()
    session.refresh(task)

    return task

@router.get("/tasks/{task_id}", response_model=TaskRead)
def get_task(
    user_id: str,
    task_id: int,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID for the specified user.
    """
    # Verify that the requested user_id matches the authenticated user_id
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's tasks"
        )

    # Find the task
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify that the task belongs to the user
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    return task

@router.put("/tasks/{task_id}", response_model=TaskRead)
def update_task(
    user_id: str,
    task_id: int,
    task_data: TaskUpdate,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update a specific task by ID for the specified user.
    """
    # Verify that the requested user_id matches the authenticated user_id
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user's tasks"
        )

    # Find the task
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify that the task belongs to the user
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Update the task fields if they are provided
    if task_data.title is not None:
        if len(task_data.title) < 1 or len(task_data.title) > 200:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Title must be between 1 and 200 characters"
            )
        task.title = task_data.title

    if task_data.description is not None:
        if len(task_data.description) > 1000:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Description must be less than 1000 characters"
            )
        task.description = task_data.description

    if task_data.completed is not None:
        task.completed = task_data.completed

    if task_data.priority is not None:
        task.priority = task_data.priority

    # Update the updated_at timestamp
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return task

@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    user_id: str,
    task_id: int,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task by ID for the specified user.
    """
    # Verify that the requested user_id matches the authenticated user_id
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this user's tasks"
        )

    # Find the task
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify that the task belongs to the user
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    session.delete(task)
    session.commit()

    return

@router.patch("/tasks/{task_id}/complete", response_model=TaskRead)
def toggle_task_completion(
    user_id: str,
    task_id: int,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a specific task for the specified user.
    """
    # Verify that the requested user_id matches the authenticated user_id
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user's tasks"
        )

    # Find the task
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify that the task belongs to the user
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Toggle the completion status
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return task