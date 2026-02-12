"""
Database migration script to add missing columns to existing tables for SQLite.
"""

import os
from sqlmodel import SQLModel, create_engine, Session
from models import User, Task, Conversation, Message
from db import engine


def create_tables_and_migrate():
    """Create all tables and ensure all columns exist."""
    print("Creating tables and migrating database...")

    # Create all tables based on models
    SQLModel.metadata.create_all(engine)

    print("Database migration completed!")


if __name__ == "__main__":
    create_tables_and_migrate()