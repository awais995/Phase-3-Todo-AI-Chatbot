# AI Chatbot for Task Management - Documentation

## Overview
This project implements a natural-language conversational AI chatbot that enables users to perform complete task CRUD operations through ordinary language input. The solution reuses the Phase 2 backend infrastructure while introducing new conversation persistence tables and Cohere integration.

## Features
- Natural language processing for task management
- Secure user authentication and isolation
- Persistent conversation history
- Cohere AI integration for intent recognition
- Full task CRUD operations (Create, Read, Update, Delete)
- Context-aware responses with task reference support

## Tech Stack
- **Backend**: Python 3.11, FastAPI, SQLModel
- **Frontend**: Next.js 16+, TypeScript 5.0+, Tailwind CSS
- **Database**: SQLite (default) or PostgreSQL
- **Authentication**: JWT-based authentication
- **AI Integration**: Cohere API for natural language understanding

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- PostgreSQL (optional, for production)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables by creating a `.env` file in the backend directory:
   ```bash
   # Database Configuration
   DATABASE_URL=sqlite:///./todo_ai_chatbot.db
   # Or for PostgreSQL:
   # DATABASE_URL=postgresql://username:password@localhost:5432/todo_ai_chatbot

   # Cohere API Configuration
   COHERE_API_KEY=your_cohere_api_key_here

   # Internal Authentication (for service-to-service communication)
   INTERNAL_AUTH_TOKEN=your_internal_auth_token_here

   # API Base URL
   API_BASE_URL=http://localhost:8000
   ```

4. Start the backend server:
   ```bash
   python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env.local` file in the frontend directory:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   BACKEND_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/session` - Get current user session

### Task Management
- `GET /api/{user_id}/tasks` - Get user's tasks
- `POST /api/{user_id}/tasks` - Create a new task
- `PUT /api/{user_id}/tasks/{task_id}` - Update a task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle task completion
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a task

### Chat Interface
- `POST /api/{user_id}/chat` - Process natural language input and return AI-generated response

## Natural Language Commands

The AI chatbot understands various natural language commands for task management:

### Creating Tasks
- "Add a task to buy groceries tomorrow"
- "Create a task to call John about the project"
- "Make a task to finish the report by Friday"

### Viewing Tasks
- "Show me my pending tasks"
- "What tasks do I have today?"
- "List all my tasks"

### Updating Tasks
- "Complete the first task"
- "Mark 'Buy groceries' as done"
- "Update the description of 'Call John' to 'Call John about the proposal'"

### Deleting Tasks
- "Delete the third task"
- "Remove 'Finish the report' task"

## Architecture

### Backend Structure
```
backend/
├── src/
│   ├── api/                 # API routes
│   │   └── chat_router.py   # Chat endpoint
│   ├── models/              # Database models
│   │   ├── conversation.py  # Conversation model
│   │   ├── message.py       # Message model
│   │   └── task.py          # Task model
│   ├── services/            # Business logic
│   │   ├── auth_service.py  # Authentication service
│   │   ├── cohere_service.py # Cohere integration
│   │   └── task_service.py  # Task operations
│   ├── tools/               # MCP tools
│   │   └── mcp_tools.py     # Stateless task operations
│   ├── database.py          # Database setup
│   └── main.py              # Application entry point
```

### Key Components

#### Cohere Service
Handles natural language processing and tool calling:
- Processes user messages using Cohere's chat API
- Identifies when to call specific tools (add_task, list_tasks, etc.)
- Manages conversation context for relative references

#### MCP Tools
Stateless functions that perform task operations:
- `add_task`: Creates new tasks
- `list_tasks`: Retrieves user's tasks
- `complete_task`: Marks tasks as completed
- `delete_task`: Removes tasks
- `update_task`: Modifies task details

#### Database Models
- `Conversation`: Tracks conversation threads
- `Message`: Stores individual messages in conversations
- `Task`: Represents user tasks (from Phase 2)

## Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatInterface.tsx   # Main chat interface
│   │   ├── MessageBubble.tsx   # Individual message display
│   │   └── TaskActionsPanel.tsx # Quick action buttons
│   ├── pages/
│   │   └── chat/[userId].tsx   # Chat page
│   ├── services/
│   │   └── apiClient.ts        # API communication
│   └── types/
│       └── chat.d.ts           # Type definitions
```

## Testing

Run the backend tests:
```bash
cd backend
python -m pytest ../api_test.py -v
```

## Deployment

### Backend
The backend can be deployed to any platform that supports Python applications (Heroku, AWS, Google Cloud, etc.). Make sure to configure the appropriate database URL and environment variables.

### Frontend
The frontend can be deployed to Vercel, Netlify, or any static hosting service. Update the API base URL in environment variables to point to your deployed backend.

## Troubleshooting

### Common Issues

1. **Cohere API Key Missing**: Make sure to set the `COHERE_API_KEY` environment variable.

2. **Database Connection Issues**: Verify that your `DATABASE_URL` is correctly configured.

3. **Port Already in Use**: Change the port in the uvicorn command if 8000 is already taken.

4. **Authentication Errors**: Ensure that the `BETTER_AUTH_SECRET` environment variable is set.

### Environment Variables Reference

#### Backend (.env file)
- `DATABASE_URL`: Database connection string
- `COHERE_API_KEY`: Cohere API key for natural language processing
- `BETTER_AUTH_SECRET`: Secret key for JWT signing
- `INTERNAL_AUTH_TOKEN`: Token for internal service communication
- `API_BASE_URL`: Base URL for the API

#### Frontend (.env.local file)
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for API calls from frontend
- `BACKEND_URL`: Backend URL for Next.js rewrites

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.