"""
Dependency injection utilities for the API
"""

from fastapi import Depends, HTTPException, status
from typing import Generator
from sqlmodel import Session

# Use absolute imports from the backend package
from ..db import get_session  # Import from db.py (which has the get_session generator)
from ..models import Task


def get_task_by_id(task_id: int, db_session: Session = Depends(get_session)) -> Task:
    """
    Dependency to get a task by its ID.
    """
    task = db_session.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task