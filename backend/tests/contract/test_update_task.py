import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_update_task_functionality(client):
    """Test that the update_task functionality works correctly."""
    with patch('services.cohere_service.CohereService.process_message') as mock_process:
        # Mock a response that would trigger an update_task tool call
        mock_process.return_value = {
            "response": "Task updated successfully",
            "tool_calls": [{
                "name": "update_task",
                "arguments": {
                    "task_id": 1,
                    "title": "Updated Task Title",
                    "description": "Updated description"
                }
            }]
        }
        
        response = client.post(
            "/api/test_user/chat",
            json={"message": "Update the task title to 'Updated Task Title'", "conversation_id": None},
            headers={"Authorization": "Bearer fake-token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "update_task" in str(data["tool_calls"])