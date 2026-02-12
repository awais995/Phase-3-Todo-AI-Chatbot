import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_chat_endpoint_exists(client):
    """Test that the chat endpoint exists and returns a proper response structure."""
    with patch('services.cohere_service.CohereService.process_message') as mock_process:
        mock_process.return_value = {
            "response": "Test response",
            "tool_calls": []
        }
        
        response = client.post(
            "/api/test_user/chat",
            json={"message": "test message", "conversation_id": None},
            headers={"Authorization": "Bearer fake-token"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "conversation_id" in data
        assert "response" in data
        assert "tool_calls" in data