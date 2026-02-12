# hackathon-todo Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### Agentic Dev Stack Process
<!-- Example: I. Library-First -->
Strictly adhere to the Agentic Dev Stack process: Write/Update Spec → Create Plan → Split into Tasks → Implement using Claude Code. Manual coding is prohibited.
<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries -->

### Spec-Kit Plus Compliance
<!-- Example: II. CLI Interface -->
Always utilize Spec-Kit Plus: Refer to specifications using @specs/... paths (example: @specs/features/chatbot.md)
<!-- Example: Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats -->

### Tech Stack Adherence
<!-- Example: III. Test-First (NON-NEGOTIABLE) -->
Mandatory technology stack must be followed precisely: Frontend: Next.js 16+ App Router, TypeScript, Tailwind CSS, shadcn/ui; Backend: Python FastAPI; AI Layer: Cohere API; MCP Server: Custom stateless FastAPI endpoints; ORM: SQLModel; Database: Neon Serverless PostgreSQL; Auth: Better Auth using JWT
<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->

### Security First
<!-- Example: IV. Integration Testing -->
Every operation requires valid JWT authorization; enforce strict user isolation on all operations: user_id extracted from token must exactly match the {user_id} in the URL path or tool parameters
<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

### AI-Powered Task Management
<!-- Example: V. Observability, VI. Versioning & Breaking Changes, VII. Simplicity -->
Use Cohere Agent for natural language interpretation and tool/function calling to manage tasks conversationally through natural language input
<!-- Example: Text I/O ensures debuggability; Structured logging required; Or: MAJOR.MINOR.BUILD format; Or: Start simple, YAGNI principles -->

### Persistent Conversations
Conversation state saved in DB (conversations + messages tables); stateless server with DB as single source of truth


## Phase 3 Database Requirements
<!-- Example: Additional Constraints, Security Requirements, Performance Standards, etc. -->

New Phase 3 database tables: conversations table with user_id, id, created_at, updated_at; messages table with user_id, id, conversation_id, role, content, created_at
<!-- Example: Technology stack requirements, compliance standards, deployment policies, etc. -->

## Development Workflow
<!-- Example: Development Workflow, Review Process, Quality Gates, etc. -->

Use Cohere Chat API with tool/function calling support; retrieve and store full conversation history from DB on each request; reuse existing Phase 2 backend endpoints for actual task CRUD operations; refer to @specs/... files for detailed requirements
<!-- Example: Code review requirements, testing gates, deployment approval process, etc. -->

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

Constitution governs all Phase 3 development activities; any departure requires explicit user approval; all Phase 2 rules continue to apply unless clearly superseded
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: 3.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Original adoption date unknown | **Last Amended**: 2026-02-10
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->