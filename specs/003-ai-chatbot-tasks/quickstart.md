# Quickstart Guide: AI Chatbot for Task Management

## Overview
This guide provides a quick introduction to setting up and running the AI Chatbot for Task Management feature.

## Prerequisites
- Python 3.11+
- Node.js 18+
- Next.js 16+
- Cohere API key
- PostgreSQL database (Neon Serverless recommended)
- Better Auth configured for JWT authentication

## Environment Variables
Set the following environment variables:

```bash
# Backend
COHERE_API_KEY=your_cohere_api_key_here
DATABASE_URL=postgresql://username:password@host:port/database
BETTER_AUTH_SECRET=your_better_auth_secret

# Frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000  # Adjust to your backend URL
NEXT_PUBLIC_COHERE_API_KEY=your_cohere_api_key_here  # Only for client-side if needed
```

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run database migrations to create the new conversation and message tables:
   ```bash
   python -m alembic upgrade head
   ```

4. Start the backend server:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Testing the Chatbot
1. Access the chat interface at `http://localhost:3000/chat/{user_id}`
2. Authenticate using your existing credentials
3. Try natural language commands like:
   - "Add a task to buy groceries tomorrow"
   - "Show me my pending tasks"
   - "Complete the first task"
   - "Update the description of 'Buy groceries' to 'Buy milk, bread, and eggs'"

## Key Components
- **Chat Endpoint**: POST `/api/{user_id}/chat` - Processes natural language input
- **Cohere Service**: Integrates with Cohere API for natural language understanding
- **MCP Tools**: Stateless functions that perform task operations
- **Conversation Persistence**: Stores conversation history in database

## Troubleshooting
- If the chatbot doesn't respond, check that your Cohere API key is valid
- If authentication fails, verify your JWT token is valid and user_id matches the path parameter
- If database errors occur, ensure migrations have been run and connection string is correct