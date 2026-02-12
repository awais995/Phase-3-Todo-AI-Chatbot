import cohere
from typing import Dict, Any, List
import os
from pydantic import BaseModel
from enum import Enum


class ToolCall(BaseModel):
    name: str
    arguments: Dict[str, Any]


class CohereService:
    def __init__(self):
        api_key = os.getenv("COHERE_API_KEY")
        if not api_key:
            raise ValueError("COHERE_API_KEY environment variable is not set")
        
        self.client = cohere.Client(api_key)
        self.tools = [
            {
                "name": "add_task",
                "description": "Add a new task for the user",
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Add a new task for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "The ID of the user"
                            },
                            "title": {
                                "type": "string",
                                "description": "The title of the task"
                            },
                            "description": {
                                "type": "string",
                                "description": "The description of the task"
                            }
                        },
                        "required": ["user_id", "title"]
                    }
                }
            },
            {
                "name": "list_tasks",
                "description": "List tasks for the user",
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List tasks for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "The ID of the user"
                            },
                            "status": {
                                "type": "string",
                                "description": "Filter tasks by status (all, pending, completed)"
                            }
                        },
                        "required": ["user_id"]
                    }
                }
            },
            {
                "name": "complete_task",
                "description": "Mark a task as completed",
                "type": "function",
                "function": {
                    "name": "complete_task",
                    "description": "Mark a task as completed",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "The ID of the user"
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "The ID of the task to complete"
                            }
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "name": "delete_task",
                "description": "Delete a task",
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Delete a task",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "The ID of the user"
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "The ID of the task to delete"
                            }
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "name": "update_task",
                "description": "Update a task's details",
                "type": "function",
                "function": {
                    "name": "update_task",
                    "description": "Update a task's details",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "The ID of the user"
                            },
                            "task_id": {
                                "type": "integer",
                                "description": "The ID of the task to update"
                            },
                            "title": {
                                "type": "string",
                                "description": "The new title of the task"
                            },
                            "description": {
                                "type": "string",
                                "description": "The new description of the task"
                            }
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            }
        ]

    def process_message(self, user_message: str, conversation_history: List[Dict[str, str]], context_info: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Process a user message using Cohere's chat API with tool calling.
        Includes context information for better understanding of relative references.
        """
        # Prepare the chat history for Cohere
        chat_history = []
        for msg in conversation_history:
            # Ensure each message has both role and message fields
            role = "USER" if msg["role"] == "user" else "CHATBOT"
            # Make sure content exists and is not empty
            content = msg.get("content", "").strip()
            if content:  # Only add messages with actual content
                chat_history.append({
                    "role": role,
                    "message": content
                })

        # Add context information to the message if available
        enhanced_message = user_message
        if context_info:
            # If the user is referring to tasks by position, add the context
            if any(indicator in user_message.lower() for indicator in ["#1", "#2", "#3", "#4", "#5", "first", "second", "third", "last"]):
                if "recent_task_list" in context_info:
                    task_list = context_info["recent_task_list"]
                    enhanced_message += f"\n\nFor reference, here is the recent task list: {task_list}"

        try:
            # Call Cohere's chat API with tool calling
            response = self.client.chat(
                model="command-r-08-2024",  # Using the recommended model for tool calling
                message=enhanced_message,
                chat_history=chat_history,
                tools=self.tools,
                force_single_step=True
            )

            # Extract tool calls if any
            tool_calls = []
            if hasattr(response, 'tool_calls') and response.tool_calls:
                for tool_call in response.tool_calls:
                    tool_calls.append({
                        "name": tool_call.name,
                        "arguments": tool_call.parameters
                    })

            # Use the response from Cohere, but if it's empty and we have tool calls,
            # we'll let the chat router handle providing a more specific response based on tool results
            response_text = response.text if response.text.strip() else "Processing your request..."
            
            return {
                "response": response_text,
                "tool_calls": tool_calls
            }

        except Exception as e:
            # Handle errors gracefully
            return {
                "response": f"I encountered an error processing your request: {str(e)}. Could you please try again?",
                "tool_calls": []
            }

    def detect_ambiguous_request(self, user_message: str) -> bool:
        """
        Detect if a request is ambiguous and might need clarification.
        """
        # Simple heuristic for detecting ambiguous requests
        ambiguous_indicators = [
            "that task", "the task", "task #", "that one", "the one", 
            "mentioned", "referenced", "above", "previous"
        ]
        
        lower_msg = user_message.lower()
        return any(indicator in lower_msg for indicator in ambiguous_indicators)