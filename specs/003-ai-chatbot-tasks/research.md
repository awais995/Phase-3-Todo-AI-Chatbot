# Research Summary: AI Chatbot for Task Management

## Overview
This document summarizes the research conducted for implementing the AI Chatbot for Task Management feature. It resolves all technical unknowns and clarifies implementation decisions.

## Decision: Cohere API Integration Approach
**Rationale**: Using Cohere's Chat API with function/tool calling capabilities allows us to leverage their advanced natural language understanding to interpret user intents and call appropriate backend functions. This approach aligns with the requirement to use Cohere API for natural language understanding and tool calling.

**Alternatives considered**:
- OpenAI GPT with functions: Would require changing the specified AI provider
- Rule-based parsing: Would be less robust and require extensive maintenance
- Self-trained NLP model: Would be too complex and time-consuming for this project

## Decision: Database Schema for Conversations
**Rationale**: Creating separate conversations and messages tables allows for proper persistence of chat history while maintaining referential integrity. This supports the requirement for persistent conversation storage with user isolation.

**Schema**:
- conversations table: user_id (str), id (int PK), created_at (timestamp), updated_at (timestamp)
- messages table: user_id (str), id (int PK), conversation_id (int FK), role ("user"|"assistant"), content (text), created_at (timestamp)

**Alternatives considered**:
- Storing conversations in the existing task table: Would mix concerns and violate separation of responsibilities
- Using a document database: Would complicate the architecture unnecessarily

## Decision: Stateless Chat Endpoint Design
**Rationale**: Implementing a completely stateless endpoint that loads full conversation history from DB on each request ensures scalability and reliability. This approach aligns with the requirement for stateless processing while maintaining conversation context.

**Process**:
1. Load conversation history from DB
2. Pass history to Cohere API
3. Process user message and generate response
4. Save new user and assistant messages to DB
5. Return response to client

**Alternatives considered**:
- Server-side session storage: Would complicate scaling and introduce potential data loss
- Client-side state management: Would compromise security and reliability

## Decision: MCP Tools Implementation
**Rationale**: Creating five stateless MCP tools (add_task, list_tasks, complete_task, delete_task, update_task) that delegate to existing Phase 2 REST endpoints maintains clean separation of concerns while reusing existing functionality. Each tool enforces user isolation by accepting user_id parameter.

**Implementation approach**: Tools will be implemented as functions that accept user_id and other parameters, then call the existing Phase 2 API endpoints internally.

**Alternatives considered**:
- Direct database access in tools: Would duplicate authentication/authorization logic
- Modifying existing endpoints: Would break existing functionality

## Decision: Frontend Chat Interface
**Rationale**: Building a custom Next.js chat interface component provides full control over the user experience while integrating seamlessly with the existing frontend architecture. This approach supports the requirement for a natural, flowing interaction.

**Features**:
- Message history display with scrollable container
- Text input with submission handling
- Loading indicators during AI processing
- Error handling and display

**Alternatives considered**:
- Using OpenAI ChatKit: Would require changing the specified AI provider
- Third-party chat components: Might not integrate well with existing UI

## Decision: Security Implementation
**Rationale**: Implementing JWT validation on every chat request and enforcing user_id matching between token and URL path ensures strict user isolation. This meets the non-negotiable security requirement.

**Implementation**:
- Middleware to validate JWT tokens
- Dependency to extract and validate user_id
- Enforcement that user_id in token matches {user_id} in URL path
- All tools receive user_id parameter to scope operations

**Alternatives considered**:
- Session-based authentication: Would not meet stateless requirement
- Client-side validation only: Would be insecure