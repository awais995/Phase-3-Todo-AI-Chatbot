---
id: 1
title: Update Phase3 Constitution
stage: constitution
date: 2026-02-10
surface: agent
model: Qwen
feature: hackathon-todo
branch: main
user: ADMIN
command: /sp.constitution
labels: ["constitution", "phase3", "ai-chatbot", "hackathon"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - ".specify/memory/constitution.md"
tests: []
---

# Update Phase3 Constitution

## User Input
```
/sp.constitution You are now working under the revised constitution for Phase 3 of Hackathon II: Todo AI Chatbot.  
Project Name: hackathon-todo  
Current Phase: Phase III – Natural Language Task Management via AI Chatbot powered by Cohere  

**Core Rules (must never be broken):**  

1. Strictly adhere to the Agentic Dev Stack process: Write/Update Spec → Create Plan → Split into Tasks → Implement using Claude Code. Manual coding is prohibited.  
2. Always utilize Spec-Kit Plus: Refer to specifications using @specs/... paths (example: @specs/features/chatbot.md)  
3. Before taking any action, read the single root-level CLAUDE.md file  
4. Monorepo layout: frontend/, backend/, specs/, .spec-kit/config.yaml, docker-compose.yml  
5. Technology stack is mandatory and must be followed precisely:  
   - Frontend: Custom chat interface (Next.js 16+ App Router, TypeScript, Tailwind CSS, shadcn/ui) or OpenAI ChatKit if chosen  
   - Backend: Python FastAPI  
   - AI Layer: Cohere API (Chat + Tool Use / function calling)  
   - MCP Server: Custom stateless FastAPI endpoints serving task-related tools  
   - ORM: SQLModel  
   - Database: Neon Serverless PostgreSQL (via DATABASE_URL environment variable)  
   - Auth: Better Auth using JWT (shared secret: BETTER_AUTH_SECRET)  
6. Every chat and task operation requires a valid JWT: `Authorization: Bearer <token>`  
7. Enforce strict user isolation on all operations: user_id extracted from token must exactly match the {user_id} in the URL path or tool parameters  
8. Return HTTP 401 for missing/invalid/expired token; return 403 when user_id does not match  
9. Chat endpoint: `POST /api/{user_id}/chat` — stateless endpoint, conversation state saved in DB (conversations + messages tables)  
10. MCP Tools (stateless, database-backed, invoked by Cohere agent):  
    - add_task: user_id (required), title (required), description (optional)  
    - list_tasks: user_id (required), status (optional: all / pending / completed)  
    - complete_task: user_id (required), task_id (required)  
    - delete_task: user_id (required), task_id (required)  
    - update_task: user_id (required), task_id (required), title and/or description (optional)  
11. Cohere Agent expected behavior:  
    - Interpret natural language input  
    - Invoke the correct MCP tool(s) when needed  
    - Provide friendly confirmation of performed actions  
    - Handle errors cleanly (e.g. task not found, bad input)  
12. New Phase 3 database tables:  
    - conversations: user_id (str), id (int), created_at (timestamp), updated_at (timestamp)  
    - messages: user_id (str), id (int), conversation_id (int), role (user/assistant), content (text), created_at (timestamp)  
13. Always give highest priority to:  
    - Security (user isolation + JWT validation)  
    - Persistent conversations (stateless server, DB is the single source of truth)  
    - Natural language understanding (Cohere for intent + tool calling)  
    - Good UX (kind confirmations, clear error messages, seamless resume after page reload)  
14. During implementation:  
    - Use Cohere Chat API with tool/function calling support  
    - Retrieve and store full conversation history from DB on each request  
    - Reuse existing Phase 2 backend endpoints for actual task CRUD operations  
    - Refer to @specs/... files for detailed requirements  
15. Output structure: Always present plan → task breakdown → implementation steps including specific file paths  
16. Overall objective: Evolve the Phase 2 full-stack Todo application into an AI-powered chatbot interface where users can manage tasks conversationally through natural language (examples: "Add a task to buy groceries tomorrow", "Delete task 5", "List my pending tasks"), while maintaining full security, data persistence, and conversational context.  

This constitution governs all Phase 3 development activities. Any departure from these rules requires explicit user approval. All Phase 2 rules (authentication, endpoints, user isolation, tech stack) continue to apply unless clearly superseded by this document.
```

## Response Summary
Updated the project constitution to reflect Phase 3 requirements for the AI Chatbot. Created a new version 3.0.0 constitution that includes specific principles for the Agentic Dev Stack process, Tech Stack Adherence, Security First approach, AI-Powered Task Management, and Persistent Conversations. The updated constitution now properly governs all Phase 3 development activities for the AI-powered Todo chatbot, maintaining all Phase 2 security and user isolation requirements while adding the new AI and conversational features.

## Outcome
Successfully updated .specify/memory/constitution.md with Phase 3 requirements for the Todo AI Chatbot project, including all necessary principles and governance rules.

## Evaluation
The constitution update was completed successfully with all required elements included. The version was properly incremented to 3.0.0 to reflect the major changes for Phase 3, and a sync impact report was included in the file.