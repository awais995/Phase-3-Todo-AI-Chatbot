from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from sqlmodel import Session, select
from datetime import datetime
import asyncio

from models import Conversation, Message, RoleType, Task
from dependencies import get_current_user
from services.cohere_service import CohereService
from services.task_service import get_user_tasks
from tools.mcp_tools import add_task, list_tasks, complete_task, delete_task, update_task
from db import get_session


router = APIRouter(prefix="/api/{user_id}", tags=["chat"])


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None


class ToolCall(BaseModel):
    name: str
    arguments: Dict[str, Any]


class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: List[ToolCall]


@router.post("/chat", response_model=ChatResponse)
async def chat(
    user_id: str,
    request: ChatRequest,
    current_user: str = Depends(get_current_user)
):
    """
    Process natural language input and return AI-generated response.
    Loads conversation history from DB, processes with Cohere, saves new messages.
    """
    # Verify that the requested user_id matches the authenticated user_id
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's chat"
        )
    
    # Get database session
    with next(get_session()) as session:
        # Initialize Cohere service
        cohere_service = CohereService()
        
        # Load conversation history if conversation_id is provided
        conversation = None
        if request.conversation_id:
            conversation = session.exec(
                select(Conversation).where(
                    Conversation.id == request.conversation_id,
                    Conversation.user_id == user_id
                )
            ).first()
            
            if not conversation:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Conversation not found"
                )
        else:
            # Create a new conversation
            conversation = Conversation(user_id=user_id)
            session.add(conversation)
            session.commit()
            session.refresh(conversation)
        
        # Load message history for this conversation
        statement = select(Message).where(
            Message.conversation_id == conversation.id
        ).order_by(Message.created_at)
        messages = session.exec(statement).all()
        
        # Convert messages to the format expected by Cohere
        conversation_history = []
        for msg in messages:
            conversation_history.append({
                "role": msg.role.value,
                "content": msg.content
            })
        
        # Prepare context information for the Cohere service
        context_info = {}
        
        # If the user is requesting a list of tasks, store it for potential follow-up references
        if "list" in request.message.lower() or "show" in request.message.lower():
            # Get the user's tasks to provide context for relative references
            user_tasks = get_user_tasks(session, user_id, status="all")
            if user_tasks:
                task_list_str = "\n".join([f"{i+1}. {task.title} (ID: {task.id})" for i, task in enumerate(user_tasks)])
                context_info["recent_task_list"] = task_list_str
        
        # Add the current user message to the history
        user_message_entry = Message(
            user_id=user_id,
            conversation_id=conversation.id,
            role=RoleType.user,
            content=request.message
        )
        session.add(user_message_entry)
        session.commit()
        
        # Process the message with Cohere, including context information
        result = cohere_service.process_message(request.message, conversation_history, context_info)
        
        # Execute any tool calls returned by Cohere
        tool_results = []
        if result["tool_calls"]:
            for tool_call in result["tool_calls"]:
                tool_name = tool_call["name"]
                arguments = tool_call["arguments"]
                
                # Initialize flag to determine if we should execute the tool
                should_execute_tool = True

                # Handle potential parameter name mismatches from Cohere
                processed_arguments = arguments.copy()

                # Map common parameter name variations for all tools
                if tool_name == "add_task":
                    # Map 'task' to 'title' if 'title' is not present
                    if 'task' in processed_arguments and 'title' not in processed_arguments:
                        processed_arguments['title'] = processed_arguments.pop('task')
                    # Map 'task_title' to 'title' if 'title' is not present
                    if 'task_title' in processed_arguments and 'title' not in processed_arguments:
                        processed_arguments['title'] = processed_arguments.pop('task_title')
                elif tool_name in ["update_task", "delete_task", "complete_task"]:
                    # Map 'id' to 'task_id' if 'task_id' is not present
                    if 'id' in processed_arguments and 'task_id' not in processed_arguments:
                        processed_arguments['task_id'] = processed_arguments.pop('id')
                    # If we have a title but no task_id, try to find the task by title
                    if 'task_id' not in processed_arguments and 'title' in processed_arguments:
                        # Query the database to find the task by title for the user
                        task_query = select(Task).where(
                            Task.user_id == user_id,
                            Task.title == processed_arguments['title']
                        )
                        found_task = session.exec(task_query).first()

                        if found_task:
                            processed_arguments['task_id'] = found_task.id
                            # Remove the title from arguments since the function expects task_id
                            if tool_name == "delete_task":
                                processed_arguments.pop('title', None)
                        else:
                            # If we can't find the task by title, return an error message
                            # Skip executing this tool call and return an error response
                            tool_result = {
                                "success": False,
                                "error": f"Could not find a task with the title '{processed_arguments['title']}'.",
                                "message": f"Could not find a task with the title '{processed_arguments['title']}'. Please check the task name and try again."
                            }
                            tool_results.append({
                                "name": tool_name,
                                "result": tool_result
                            })
                            # Update the response with the error message
                            result["response"] = tool_result["message"]
                            should_execute_tool = False  # Don't execute the tool

                    # Map 'task' to 'task_id' if 'task_id' is not present but 'task' is numeric
                    if 'task' in processed_arguments and 'task_id' not in processed_arguments:
                        # If 'task' looks like a numeric ID, convert it
                        try:
                            task_id = int(processed_arguments['task'])
                            processed_arguments['task_id'] = task_id
                            processed_arguments.pop('task')
                        except (ValueError, TypeError):
                            # If it's not numeric, treat it as a title and try to find the task
                            task_query = select(Task).where(
                                Task.user_id == user_id,
                                Task.title == processed_arguments['task']
                            )
                            found_task = session.exec(task_query).first()

                            if found_task:
                                processed_arguments['task_id'] = found_task.id
                                processed_arguments.pop('task')
                            else:
                                # If we can't find the task by title, return an error message
                                tool_result = {
                                    "success": False,
                                    "error": f"Could not find a task with the name '{processed_arguments['task']}'.",
                                    "message": f"Could not find a task with the name '{processed_arguments['task']}'. Please check the task name and try again."
                                }
                                tool_results.append({
                                    "name": tool_name,
                                    "result": tool_result
                                })
                                # Update the response with the error message
                                result["response"] = tool_result["message"]
                                should_execute_tool = False  # Don't execute the tool

                # Special handling for complete_task to map 'task' or 'task_title' to 'task_id'
                if tool_name == "complete_task":
                    # Map 'id' to 'task_id' if 'task_id' is not present
                    if 'id' in processed_arguments and 'task_id' not in processed_arguments:
                        processed_arguments['task_id'] = processed_arguments.pop('id')
                    # Map 'task' to 'task_id' if 'task_id' is not present but 'task' is numeric
                    if 'task' in processed_arguments and 'task_id' not in processed_arguments:
                        # If 'task' looks like a numeric ID, convert it
                        try:
                            task_id = int(processed_arguments['task'])
                            processed_arguments['task_id'] = task_id
                            processed_arguments.pop('task')
                        except (ValueError, TypeError):
                            # If it's not numeric, treat it as a title and try to find the task
                            task_query = select(Task).where(
                                Task.user_id == user_id,
                                Task.title == processed_arguments['task']
                            )
                            found_task = session.exec(task_query).first()

                            if found_task:
                                processed_arguments['task_id'] = found_task.id
                                processed_arguments.pop('task')
                            else:
                                # If we can't find the task by title, return an error message
                                tool_result = {
                                    "success": False,
                                    "error": f"Could not find a task with the name '{processed_arguments['task']}'.",
                                    "message": f"Could not find a task with the name '{processed_arguments['task']}'. Please check the task name and try again."
                                }
                                tool_results.append({
                                    "name": tool_name,
                                    "result": tool_result
                                })
                                # Update the response with the error message
                                result["response"] = tool_result["message"]
                                should_execute_tool = False  # Don't execute the tool

                    # Map 'task_title' to 'task_id' if 'task_id' is not present
                    if 'task_title' in processed_arguments and 'task_id' not in processed_arguments:
                        # Query the database to find the task by title for the user
                        task_query = select(Task).where(
                            Task.user_id == user_id,
                            Task.title == processed_arguments['task_title']
                        )
                        found_task = session.exec(task_query).first()

                        if found_task:
                            processed_arguments['task_id'] = found_task.id
                            processed_arguments.pop('task_title', None)
                        else:
                            # If we can't find the task by title, return an error message
                            tool_result = {
                                "success": False,
                                "error": f"Could not find a task with the title '{processed_arguments['task_title']}'.",
                                "message": f"Could not find a task with the title '{processed_arguments['task_title']}'. Please check the task name and try again."
                            }
                            tool_results.append({
                                "name": tool_name,
                                "result": tool_result
                            })
                            # Update the response with the error message
                            result["response"] = tool_result["message"]
                            should_execute_tool = False  # Don't execute the tool

                # Ensure user_id is always present
                if "user_id" not in processed_arguments:
                    processed_arguments["user_id"] = user_id

                # Execute the appropriate tool
                try:
                    if should_execute_tool:
                        if tool_name == "add_task":
                            tool_result = await add_task(**processed_arguments)
                        elif tool_name == "list_tasks":
                            tool_result = await list_tasks(**processed_arguments)
                        elif tool_name == "complete_task":
                            tool_result = await complete_task(**processed_arguments)
                        elif tool_name == "delete_task":
                            tool_result = await delete_task(**processed_arguments)
                        elif tool_name == "update_task":
                            tool_result = await update_task(**processed_arguments)
                        else:
                            tool_result = {
                                "success": False,
                                "error": f"Unknown tool: {tool_name}"
                            }

                        tool_results.append({
                            "name": tool_name,
                            "result": tool_result
                        })

                        # Update the response with tool results - prioritize tool messages over Cohere's default
                        if tool_result.get("success") and "message" in tool_result:
                            result["response"] = tool_result["message"]
                        elif not tool_result.get("success") and "message" in tool_result:
                            result["response"] = tool_result["message"]
                        elif not tool_result.get("success") and "error" in tool_result:
                            result["response"] = f"Error: {tool_result['error']}"

                except Exception as e:
                    # Handle tool execution errors
                    error_response = f"Error executing tool {tool_name}: {str(e)}"
                    result["response"] = error_response
                    # Log the error for debugging purposes
                    print(f"Tool execution error: {str(e)}")
        
        # Create assistant message with the response
        assistant_message_entry = Message(
            user_id=user_id,
            conversation_id=conversation.id,
            role=RoleType.assistant,
            content=result["response"]
        )
        session.add(assistant_message_entry)
        session.commit()
        
        # Update conversation timestamp
        conversation.updated_at = datetime.utcnow()
        session.add(conversation)
        session.commit()
        
        # Return the response
        return ChatResponse(
            conversation_id=conversation.id,
            response=result["response"],
            tool_calls=[ToolCall(name=call["name"], arguments=call["arguments"]) for call in result["tool_calls"]]
        )