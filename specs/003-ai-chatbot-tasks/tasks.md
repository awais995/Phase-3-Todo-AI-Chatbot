# Tasks: AI Chatbot for Task Management

**Input**: Design documents from `/specs/003-ai-chatbot-tasks/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend project structure with src/, models/, services/, api/, tools/ directories
- [X] T002 Create frontend project structure with src/, components/, pages/, services/, types/ directories
- [ ] T003 [P] Install backend dependencies: FastAPI, SQLModel, Cohere SDK, Better Auth, Neon PostgreSQL driver
- [ ] T004 [P] Install frontend dependencies: Next.js 16+, TypeScript 5.0+, Tailwind CSS, shadcn/ui

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T005 Setup database schema and migrations framework for conversations and messages tables
- [X] T006 [P] Implement JWT validation middleware for user authentication
- [X] T007 [P] Setup API routing and middleware structure for backend
- [X] T008 Create base models for Conversation and Message entities in backend/src/models/
- [X] T009 Configure error handling and logging infrastructure
- [X] T010 Setup environment configuration management for Cohere API key

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Natural Language Task Management (Priority: P1) 🎯 MVP

**Goal**: Enable users to interact with the todo application using natural language to manage tasks without clicking buttons or filling forms.

**Independent Test**: The system can accept natural language input like "Add a task to buy milk" and successfully create a task in the database, returning a confirmation message to the user.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [P] [US1] Contract test for POST /api/{user_id}/chat endpoint in backend/tests/contract/test_chat.py
- [X] T012 [P] [US1] Integration test for add_task functionality in backend/tests/integration/test_add_task.py

### Implementation for User Story 1

- [X] T013 [P] [US1] Create Conversation model in backend/src/models/conversation.py
- [X] T014 [P] [US1] Create Message model in backend/src/models/message.py
- [X] T015 [US1] Implement Cohere service in backend/src/services/cohere_service.py
- [X] T016 [US1] Implement MCP tools (add_task, list_tasks, complete_task) in backend/src/tools/mcp_tools.py
- [X] T017 [US1] Implement chat endpoint POST /api/{user_id}/chat in backend/src/api/chat_router.py
- [X] T018 [US1] Add validation and error handling for natural language processing
- [X] T019 [US1] Create basic frontend chat interface component in frontend/src/components/ChatInterface.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Persistent Conversation Context (Priority: P2)

**Goal**: Maintain conversation context across multiple exchanges so users can have a natural, flowing interaction without repeating themselves.

**Independent Test**: After viewing a list of tasks, the user can refer to them by position (e.g., "Mark #2 as complete") and the system correctly identifies and acts on the referenced task.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [X] T020 [P] [US2] Contract test for conversation persistence in backend/tests/contract/test_conversation_persistence.py
- [X] T021 [P] [US2] Integration test for context-aware task referencing in backend/tests/integration/test_context_ref.py

### Implementation for User Story 2

- [X] T022 [P] [US2] Enhance Cohere service to maintain conversation context in backend/src/services/cohere_service.py
- [X] T023 [US2] Update chat endpoint to load full conversation history from DB on each request
- [X] T024 [US2] Implement context tracking for relative task references in MCP tools
- [X] T025 [US2] Add frontend support for displaying conversation history in frontend/src/components/ChatInterface.tsx
- [X] T026 [US2] Implement message history display in frontend/src/components/MessageBubble.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Secure Multi-User Isolation (Priority: P1)

**Goal**: Ensure that user tasks and conversations are completely isolated from other users so personal information remains private and secure.

**Independent Test**: When authenticated as User A, the system only accesses User A's tasks and conversations, regardless of what User B has done in the system.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [X] T027 [P] [US3] Contract test for user isolation in backend/tests/contract/test_user_isolation.py
- [X] T028 [P] [US3] Integration test for cross-user data access prevention in backend/tests/integration/test_cross_user_access.py

### Implementation for User Story 3

- [X] T029 [P] [US3] Enhance JWT validation to extract and verify user_id against URL path parameter
- [X] T030 [US3] Update all MCP tools to enforce user_id scoping on operations
- [X] T031 [US3] Add database query filters to ensure user isolation in all operations
- [X] T032 [US3] Implement 403 error handling when user_id mismatch occurs
- [X] T033 [US3] Add security audit logging for access attempts

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - Error Handling and Clarification (Priority: P2)

**Goal**: Gracefully handle ambiguous requests and ask for clarification when needed so users can refine their input and achieve their goals.

**Independent Test**: When a user says "Complete task #5" but has only 3 tasks, the system asks for clarification rather than failing or acting on the wrong task.

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [X] T034 [P] [US4] Contract test for error handling responses in backend/tests/contract/test_error_handling.py
- [X] T035 [P] [US4] Integration test for clarification requests in backend/tests/integration/test_clarification.py

### Implementation for User Story 4

- [X] T036 [P] [US4] Enhance Cohere service to detect ambiguous requests and generate clarifying questions
- [X] T037 [US4] Update MCP tools to handle non-existent tasks gracefully with helpful error messages
- [X] T038 [US4] Implement error response formatting in chat endpoint
- [X] T039 [US4] Add frontend error display component in frontend/src/components/MessageBubble.tsx
- [X] T040 [US4] Update frontend to handle clarification requests from AI

**Checkpoint**: At this point, User Stories 1, 2, 3 AND 4 should all work independently

---

## Phase 7: User Story 5 - Rich Task Operations (Priority: P3)

**Goal**: Perform complex task operations through the chatbot such as updating task details, deleting tasks, and filtering task lists so users can fully manage tasks through natural language.

**Independent Test**: The system can handle complex requests like "Update the description of 'Buy groceries' to 'Buy milk, bread, and eggs'" and correctly modify the task.

### Tests for User Story 5 (OPTIONAL - only if tests requested) ⚠️

- [X] T041 [P] [US5] Contract test for update_task functionality in backend/tests/contract/test_update_task.py
- [X] T042 [P] [US5] Integration test for delete_task functionality in backend/tests/integration/test_delete_task.py

### Implementation for User Story 5

- [X] T043 [P] [US5] Implement update_task and delete_task MCP tools in backend/src/tools/mcp_tools.py
- [X] T044 [US5] Enhance Cohere service to recognize complex task operations
- [X] T045 [US5] Update chat interface to support complex task operations in frontend/src/components/ChatInterface.tsx
- [X] T046 [US5] Add advanced task operation examples to frontend UI
- [X] T047 [US5] Implement filtering and search capabilities in list_tasks tool

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T048 [P] Update documentation in docs/ and specs/003-ai-chatbot-tasks/
- [X] T049 Code cleanup and refactoring across all components
- [X] T050 Performance optimization for chat response times
- [X] T051 [P] Add comprehensive unit tests in backend/tests/unit/ and frontend/tests/unit/
- [X] T052 Security hardening and penetration testing validation
- [X] T053 Run quickstart.md validation to ensure all components work together

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for POST /api/{user_id}/chat endpoint in backend/tests/contract/test_chat.py"
Task: "Integration test for add_task functionality in backend/tests/integration/test_add_task.py"

# Launch all models for User Story 1 together:
Task: "Create Conversation model in backend/src/models/conversation.py"
Task: "Create Message model in backend/src/models/message.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 3 (also P1)
   - Developer C: User Story 2
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence