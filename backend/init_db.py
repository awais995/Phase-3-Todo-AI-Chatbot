"""
Database initialization script to create all tables with required columns for SQLite.
"""

import os
from sqlmodel import SQLModel, create_engine
from models import User, Task, Conversation, Message
from db import engine
import sqlite3


def initialize_database():
    """Create all tables and ensure all columns exist."""
    print("Initializing database...")

    # Create all tables based on models
    SQLModel.metadata.create_all(engine)
    
    # Connect to the database to check and add columns if needed
    db_path = "todo_app.db"  # This matches the DATABASE_URL in db.py
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if 'bio' column exists in 'user' table, add it if not
    cursor.execute("PRAGMA table_info(user)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'bio' not in columns:
        print("Adding 'bio' column to 'user' table...")
        cursor.execute("ALTER TABLE user ADD COLUMN bio VARCHAR(500)")
        print("'bio' column added successfully!")
    else:
        print("'bio' column already exists in 'user' table.")
        
    # Check if 'priority' column exists in 'task' table, add it if not
    cursor.execute("PRAGMA table_info(task)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'priority' not in columns:
        print("Adding 'priority' column to 'task' table...")
        cursor.execute("ALTER TABLE task ADD COLUMN priority VARCHAR(20) DEFAULT 'medium'")
        print("'priority' column added successfully!")
    else:
        print("'priority' column already exists in 'task' table.")
    
    conn.commit()
    conn.close()
    
    print("Database initialization completed!")


if __name__ == "__main__":
    initialize_database()