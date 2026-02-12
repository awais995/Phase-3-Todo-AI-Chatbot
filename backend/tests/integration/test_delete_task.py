import pytest
from unittest.mock import AsyncMock, patch
from src.tools.mcp_tools import delete_task


@pytest.mark.asyncio
async def test_delete_task_success():
    """Test that delete_task successfully deletes a task."""
    with patch('httpx.AsyncClient.delete') as mock_delete:
        mock_response = AsyncMock()
        mock_response.status_code = 200
        mock_delete.return_value = mock_response
        
        result = await delete_task("test_user", 1)
        
        assert result["success"] is True
        assert "has been deleted" in result["message"]


@pytest.mark.asyncio
async def test_delete_task_not_found():
    """Test that delete_task handles non-existent tasks appropriately."""
    with patch('httpx.AsyncClient.delete') as mock_delete:
        mock_response = AsyncMock()
        mock_response.status_code = 404
        mock_delete.return_value = mock_response
        
        result = await delete_task("test_user", 999)
        
        assert result["success"] is False
        assert "not found" in result["error"]