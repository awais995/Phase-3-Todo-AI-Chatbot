# Data Model: Complete UI Overhaul

## Overview
This document outlines the data entities and their relationships for the Task Organizer application. Since this is a UI overhaul, the underlying data model remains unchanged from the original TaskFlow application.

## Entities

### User
Represents the application user with authentication and profile information.

**Attributes:**
- id: string (unique identifier)
- email: string (email address for login)
- name: string (display name)
- created_at: string (ISO date format)
- updated_at: string (ISO date format)

**Relationships:**
- Has many Tasks (one-to-many relationship)

### Task
Represents individual tasks managed by users in the system.

**Attributes:**
- id: number (unique identifier)
- user_id: string (foreign key to User)
- title: string (task title)
- description: string (optional task description)
- completed: boolean (completion status)
- priority: string (priority level: critical, high, medium, low)
- created_at: string (ISO date format)
- updated_at: string (ISO date format)

**Relationships:**
- Belongs to User (many-to-one relationship)

## State Transitions

### Task States
Tasks can transition between different statuses through user interactions:

1. **Creation**: New tasks start with `completed: false` and `status: 'todo'`
2. **Progress**: Tasks move from `status: 'todo'` to `status: 'in-progress'`
3. **Completion**: Tasks move to `completed: true` and `status: 'completed'`
4. **Reversion**: Completed tasks can be marked as incomplete again

## Validation Rules

### User Validation
- Email must be a valid email format
- Name must not exceed 100 characters
- Email must be unique across all users

### Task Validation
- Title must be present and not empty
- Title must not exceed 200 characters
- Description must not exceed 1000 characters
- Priority must be one of: 'critical', 'high', 'medium', 'low'
- User_id must reference an existing user

## UI-Specific Considerations

While the underlying data model remains unchanged, the UI overhaul will affect how this data is presented and manipulated:

### Display Attributes
Additional UI-specific attributes that will be handled in the frontend:
- status: 'todo' | 'in-progress' | 'completed' (derived from completed field and UI state)
- dueDate: string (optional, UI-only field)
- tags: string[] (optional, UI-only field)
- estimatedTime: number (optional, UI-only field)
- actualTimeSpent: number (optional, UI-only field)

### Local Storage Integration
The UI maintains task status in localStorage to persist state between sessions:
- Key format: `task-status-{task.id}`
- Value: Current status ('todo', 'in-progress', 'completed')

## API Contract Implications

The backend API contracts remain unchanged as part of this UI overhaul:
- Authentication endpoints (login, signup, profile)
- Task management endpoints (get, create, update, delete)
- User-specific filtering remains the same

The frontend will continue to map backend data to UI-specific formats while preserving all existing functionality.