# API Contracts: Task Organizer

## Overview
This document outlines the API contracts that remain unchanged during the UI overhaul from TaskFlow to Task Organizer. The backend API contracts stay the same to maintain functionality while the UI is completely redesigned.

## Authentication Endpoints

### POST /api/auth/login
Authenticate user and return JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "access_token": "jwt-token-string",
  "token_type": "bearer"
}
```

**Response (401):**
```json
{
  "detail": "Incorrect email or password"
}
```

### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (200):**
```json
{
  "id": "user-id-string",
  "email": "user@example.com",
  "name": "John Doe"
}
```

## Task Management Endpoints

### GET /api/users/{user_id}/tasks
Retrieve all tasks for a specific user.

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": "user-id-string",
    "title": "Sample Task",
    "description": "Task description",
    "completed": false,
    "priority": "medium",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-01T00:00:00"
  }
]
```

### POST /api/users/{user_id}/tasks
Create a new task for the user.

**Request:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "priority": "high"
}
```

**Response (200):**
```json
{
  "id": 2,
  "user_id": "user-id-string",
  "title": "New Task",
  "description": "Task description",
  "completed": false,
  "priority": "high",
  "created_at": "2023-01-01T00:00:00",
  "updated_at": "2023-01-01T00:00:00"
}
```

### PUT /api/users/{user_id}/tasks/{task_id}
Update an existing task.

**Request:**
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "completed": true,
  "priority": "critical"
}
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": "user-id-string",
  "title": "Updated Task Title",
  "description": "Updated description",
  "completed": true,
  "priority": "critical",
  "created_at": "2023-01-01T00:00:00",
  "updated_at": "2023-01-02T00:00:00"
}
```

### DELETE /api/users/{user_id}/tasks/{task_id}
Delete a task.

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

### PATCH /api/users/{user_id}/tasks/{task_id}/toggle
Toggle task completion status.

**Response (200):**
```json
{
  "id": 1,
  "user_id": "user-id-string",
  "title": "Sample Task",
  "description": "Task description",
  "completed": true,
  "priority": "medium",
  "created_at": "2023-01-01T00:00:00",
  "updated_at": "2023-01-02T00:00:00"
}
```

## User Profile Endpoints

### GET /api/users/{user_id}
Get user profile information.

**Response (200):**
```json
{
  "id": "user-id-string",
  "email": "user@example.com",
  "name": "John Doe",
  "bio": "User bio",
  "created_at": "2023-01-01T00:00:00",
  "updated_at": "2023-01-01T00:00:00"
}
```

### PUT /api/users/{user_id}
Update user profile information.

**Request:**
```json
{
  "name": "Jane Doe",
  "bio": "Updated bio"
}
```

**Response (200):**
```json
{
  "id": "user-id-string",
  "email": "user@example.com",
  "name": "Jane Doe",
  "bio": "Updated bio",
  "created_at": "2023-01-01T00:00:00",
  "updated_at": "2023-01-02T00:00:00"
}
```