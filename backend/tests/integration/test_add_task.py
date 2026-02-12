import pytest
from unittest.mock import AsyncMock, patch
from src.tools.mcp_tools import add_task


@pytest.mark.asyncio
async def test_add_task_success():
    """Test that add_task successfully creates a task."""
    with patch('httpx.AsyncClient.post') as mock_post:
        mock_response = AsyncMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": 1,
            "user_id": "test_user",
            "title": "Test Task",
            "description": "Test Description",
            "completed": False
        }
        mock_post.return_value = mock_response
        
        result = await add_task("test_user", "Test Task", "Test Description")
        
        assert result["success"] is True
        assert result["task"]["title"] == "Test Task"
        assert "Task 'Test Task' has been added successfully." in result["message"]


@pytest.mark.asyncio
async def test_add_task_failure():
    """Test that add_task handles failures appropriately."""
    with patch('httpx.AsyncClient.post') as mock_post:
        mock_response = AsyncMock()
        mock_response.status_code = 400
        mock_response.text = "Bad Request"
        mock_post.return_value = mock_response
        
        result = await add_task("test_user", "Test Task", "Test Description")
        
        assert result["success"] is False
        assert "Failed to add task" in result["error"]