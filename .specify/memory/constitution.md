<!-- 
SYNC IMPACT REPORT
Version change: 1.0.0 → 3.0.0
List of modified principles: 
- PRINCIPLE_1_NAME: Generic → Agentic Dev Stack Process
- PRINCIPLE_2_NAME: Generic → Spec-Kit Plus Compliance
- PRINCIPLE_3_NAME: Generic → Tech Stack Adherence
- PRINCIPLE_4_NAME: Generic → Security First
- PRINCIPLE_5_NAME: Generic → AI-Powered Task Management
- PRINCIPLE_6_NAME: Generic → Persistent Conversations
Added sections: None
Removed sections: None
Templates requiring updates: 
- ✅ plan-template.md - Constitution Check section aligns with new principles
- ✅ spec-template.md - Requirements section aligns with new principles
- ✅ tasks-template.md - Task categorization reflects new principle-driven task types
Follow-up TODOs: 
- RATIFICATION_DATE still needs to be determined and updated
-->
# hackathon-todo Constitution

## Core Principles

### Agentic Dev Stack Process
Strictly adhere to the Agentic Dev Stack process: Write/Update Spec → Create Plan → Split into Tasks → Implement using Claude Code. Manual coding is prohibited.

### Spec-Kit Plus Compliance
Always utilize Spec-Kit Plus: Refer to specifications using @specs/... paths (example: @specs/features/chatbot.md)

### Tech Stack Adherence
Mandatory technology stack must be followed precisely: Frontend: Next.js 16+ App Router, TypeScript, Tailwind CSS, shadcn/ui; Backend: Python FastAPI; AI Layer: Cohere API; MCP Server: Custom stateless FastAPI endpoints; ORM: SQLModel; Database: Neon Serverless PostgreSQL; Auth: Better Auth using JWT

### Security First
Every operation requires valid JWT authorization; enforce strict user isolation on all operations: user_id extracted from token must exactly match the {user_id} in the URL path or tool parameters

### AI-Powered Task Management
Use Cohere Agent for natural language interpretation and tool/function calling to manage tasks conversationally through natural language input

### Persistent Conversations
Conversation state saved in DB (conversations + messages tables); stateless server with DB as single source of truth

## Phase 3 Database Requirements

New Phase 3 database tables: conversations table with user_id, id, created_at, updated_at; messages table with user_id, id, conversation_id, role, content, created_at

## Development Workflow

Use Cohere Chat API with tool/function calling support; retrieve and store full conversation history from DB on each request; reuse existing Phase 2 backend endpoints for actual task CRUD operations; refer to @specs/... files for detailed requirements

## Governance

Constitution governs all Phase 3 development activities; any departure requires explicit user approval; all Phase 2 rules continue to apply unless clearly superseded

**Version**: 3.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Original adoption date unknown | **Last Amended**: 2026-02-10