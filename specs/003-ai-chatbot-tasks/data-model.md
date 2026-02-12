# Data Model: AI Chatbot for Task Management

## Overview
This document defines the data models required for the AI Chatbot for Task Management feature, including new entities and relationships.

## New Entities

### Conversation
Represents a single conversation thread with metadata.

**Fields**:
- id: Integer (Primary Key, Auto-increment)
- user_id: String (Foreign Key to user, required)
- created_at: DateTime (Timestamp, required)
- updated_at: DateTime (Timestamp, required)

**Relationships**:
- One-to-many with Message (one conversation to many messages)

**Validation**:
- user_id must exist in the users table
- created_at and updated_at must be valid timestamps

### Message
Represents individual messages within a conversation.

**Fields**:
- id: Integer (Primary Key, Auto-increment)
- user_id: String (Foreign Key to user, required)
- conversation_id: Integer (Foreign Key to conversation, required)
- role: String (Enum: "user" or "assistant", required)
- content: Text (Message content, required)
- created_at: DateTime (Timestamp, required)

**Relationships**:
- Many-to-one with Conversation (many messages to one conversation)

**Validation**:
- user_id must exist in the users table
- conversation_id must exist in the conversations table
- role must be either "user" or "assistant"
- content must not be empty

## Relationships

### Conversation ↔ Message
- One Conversation can have many Messages
- Each Message belongs to exactly one Conversation
- When a Conversation is deleted, all associated Messages are also deleted (CASCADE delete)

## State Transitions
- Conversation: Created when first message is sent, updated when new messages are added
- Message: Immutable once created (no state transitions)

## Indexes
- conversations.user_id: For efficient user-based queries
- conversations.created_at: For chronological ordering
- messages.conversation_id: For efficient conversation-based queries
- messages.role: For filtering by message type
- messages.created_at: For chronological ordering