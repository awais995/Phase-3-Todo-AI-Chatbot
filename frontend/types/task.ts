// TypeScript interface matching the backend Task Pydantic model
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: string; // Added priority field
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// TypeScript interfaces for API requests/responses matching backend Pydantic models
export interface TaskCreate {
  title: string;
  description?: string;
  priority?: string; // Added priority field
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: string; // Added priority field
}

export interface TaskToggleComplete {
  completed: boolean;
}