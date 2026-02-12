"""
Task Service Module
Provides business logic for task operations that can be reused by different parts of the application
"""

from typing import List, Optional
from sqlmodel import Session, select
from models import Task


def get_user_tasks(session: Session, user_id: str, status: Optional[str] = "all") -> List[Task]:
    """
    Get tasks for a specific user, optionally filtered by status.
    """
    query = select(Task).where(Task.user_id == user_id)
    
    if status == "pending":
        query = query.where(Task.completed == False)
    elif status == "completed":
        query = query.where(Task.completed == True)
    
    return session.exec(query).all()


def create_task(session: Session, user_id: str, title: str, description: Optional[str] = None) -> Task:
    """
    Create a new task for a user.
    """
    task = Task(
        user_id=user_id,
        title=title,
        description=description or "",
        completed=False
    )
    
    session.add(task)
    session.commit()
    session.refresh(task)
    
    return task


def update_task(
    session: Session, 
    user_id: str, 
    task_id: int, 
    title: Optional[str] = None, 
    description: Optional[str] = None,
    completed: Optional[bool] = None
) -> Optional[Task]:
    """
    Update a task for a user.
    """
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    
    if not task:
        return None
    
    if title is not None:
        task.title = title
    if description is not None:
        task.description = description
    if completed is not None:
        task.completed = completed
    
    session.add(task)
    session.commit()
    session.refresh(task)
    
    return task


def delete_task(session: Session, user_id: str, task_id: int) -> bool:
    """
    Delete a task for a user.
    """
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    
    if not task:
        return False
    
    session.delete(task)
    session.commit()
    
    return True