# AI Chatbot for Task Management

This project implements a natural-language conversational AI chatbot that enables users to perform complete task CRUD operations through ordinary language input. The solution reuses the Phase 2 backend infrastructure while introducing new conversation persistence tables and Cohere integration.

## Features

- Natural language processing for task management
- Secure user authentication and isolation
- Persistent conversation history
- Cohere AI integration for intent recognition
- Full task CRUD operations (Create, Read, Update, Delete)
- Context-aware responses with task reference support

## Tech Stack

- **Backend**: Python 3.11, FastAPI, SQLModel, Cohere SDK
- **Frontend**: Next.js 16+, TypeScript 5.0+, Tailwind CSS
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT
- **AI Integration**: Cohere API for natural language understanding

## Setup

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Set up environment variables (see quickstart.md for details)
5. Run database migrations to create the new conversation and message tables
6. Start the backend server
7. Start the frontend development server

## Usage

Access the chat interface at `http://localhost:3000/chat/{user_id}` and authenticate using your existing credentials. Try natural language commands like:
- "Add a task to buy groceries tomorrow"
- "Show me my pending tasks"
- "Complete the first task"
- "Update the description of 'Buy groceries' to 'Buy milk, bread, and eggs'"

## Architecture

The system consists of:
- **Chat Endpoint**: POST `/api/{user_id}/chat` - Processes natural language input
- **Cohere Service**: Integrates with Cohere API for natural language understanding
- **MCP Tools**: Stateless functions that perform task operations
- **Conversation Persistence**: Stores conversation history in database