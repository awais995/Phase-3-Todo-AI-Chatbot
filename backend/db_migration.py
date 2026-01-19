"""
Database migration script to add missing columns to existing tables.
"""

import os
from sqlmodel import SQLModel, create_engine
from models import User, Task

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Get database URL
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create engine
engine = create_engine(DATABASE_URL)

def add_missing_columns():
    """Add missing columns to existing tables."""
    print("Adding missing columns to database...")

    # Connect to database and add missing columns
    from sqlalchemy import text

    with engine.connect() as conn:
        # Check if bio column exists in user table
        result = conn.execute(text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'user' AND column_name = 'bio'
        """))

        if result.fetchone() is None:
            # Add bio column to user table
            print("Adding bio column to user table...")
            conn.execute(text("ALTER TABLE \"user\" ADD COLUMN bio VARCHAR(500)"))
            conn.commit()
            print("Bio column added successfully!")
        else:
            print("Bio column already exists in user table.")

        # Check if priority column exists in task table
        result = conn.execute(text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'task' AND column_name = 'priority'
        """))

        if result.fetchone() is None:
            # Add priority column to task table
            print("Adding priority column to task table...")
            conn.execute(text("ALTER TABLE task ADD COLUMN priority VARCHAR(20) DEFAULT 'medium'"))
            conn.commit()
            print("Priority column added successfully!")
        else:
            print("Priority column already exists in task table.")

    print("Database migration completed!")

if __name__ == "__main__":
    add_missing_columns()