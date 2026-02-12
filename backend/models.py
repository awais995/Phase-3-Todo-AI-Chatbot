from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime
import enum
import uuid

# User model
class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, nullable=False)
    name: str = Field(nullable=False)
    bio: Optional[str] = Field(default=None, max_length=500)  # Add bio field
    password: str = Field(nullable=False)  # Add password field
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Task model
class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    priority: str = Field(default="medium", max_length=20)  # Add priority field

class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Conversation model
class ConversationBase(SQLModel):
    user_id: str

class Conversation(ConversationBase, table=True):
    """
    Represents a single conversation thread with metadata.
    """
    __tablename__ = "conversations"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Message model
class RoleType(str, enum.Enum):
    user = "user"
    assistant = "assistant"

class MessageBase(SQLModel):
    user_id: str
    conversation_id: int
    role: RoleType
    content: str

class Message(MessageBase, table=True):
    """
    Represents individual messages within a conversation.
    """
    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    conversation_id: int = Field(index=True)  # Foreign key reference added in alembic migration
    role: RoleType
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Pydantic models for API requests/responses
from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    name: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserRead(BaseModel):
    id: str
    email: str
    name: str
    bio: Optional[str] = None
    created_at: datetime


class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[str] = None  # Add priority field as optional without default

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None  # Add priority field

class TaskRead(TaskBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime

class TaskToggleComplete(BaseModel):
    completed: bool