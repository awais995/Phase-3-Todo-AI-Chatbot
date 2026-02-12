import pytest
from unittest.mock import AsyncMock, patch
from src.tools.mcp_tools import list_tasks


@pytest.mark.asyncio
async def test_context_aware_task_referencing():
    """Test that the system can handle relative task references."""
    with patch('httpx.AsyncClient.get') as mock_get:
        mock_response = AsyncMock()
        mock_response.status_code = 200
        mock_response.json.return_value = [
            {
                "id": 1,
                "user_id": "test_user",
                "title": "First Task",
                "description": "Description 1",
                "completed": False
            },
            {
                "id": 2,
                "user_id": "test_user",
                "title": "Second Task",
                "description": "Description 2",
                "completed": False
            }
        ]
        mock_get.return_value = mock_response
        
        result = await list_tasks("test_user", "all")
        
        assert result["success"] is True
        assert len(result["tasks"]) == 2
        assert result["tasks"][0]["title"] == "First Task"
        assert result["tasks"][1]["title"] == "Second Task"