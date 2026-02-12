from sqlmodel import Session, select
from contextlib import contextmanager
from typing import Generator
import os
from .models import Conversation, Message, Task  # Import from consolidated models
from . import db  # Import from the main db module


def create_db_and_tables():
    """Create database tables."""
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(db.engine)


@contextmanager
def get_session() -> Generator[Session, None, None]:
    """Get a database session."""
    with Session(db.engine) as session:
        yield session