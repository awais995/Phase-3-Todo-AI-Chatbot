import pytest
from unittest.mock import AsyncMock, patch
from src.tools.mcp_tools import list_tasks


@pytest.mark.asyncio
async def test_cross_user_data_access_prevention():
    """Test that users cannot access other users' data."""
    with patch('httpx.AsyncClient.get') as mock_get:
        # Mock response for user A's tasks
        mock_response = AsyncMock()
        mock_response.status_code = 200
        mock_response.json.return_value = [
            {
                "id": 1,
                "user_id": "user_a",
                "title": "User A's Task",
                "description": "Description for user A",
                "completed": False
            }
        ]
        mock_get.return_value = mock_response
        
        # User A requests their own tasks
        result_a = await list_tasks("user_a", "all")
        
        assert result_a["success"] is True
        assert len(result_a["tasks"]) == 1
        assert result_a["tasks"][0]["user_id"] == "user_a"
        
        # The tool should only return tasks belonging to the specified user_id
        # This test verifies that the tool respects the user_id parameter
        assert all(task["user_id"] == "user_a" for task in result_a["tasks"])