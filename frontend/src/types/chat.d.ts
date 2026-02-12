// Type definitions for chat interface

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  conversation_id?: number;
}

export interface ToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls: ToolCall[];
}

export interface Conversation {
  id: number;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}