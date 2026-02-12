import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_conversation_persistence(client):
    """Test that conversation history is maintained across requests."""
    # Mock the Cohere service to return predictable responses
    with patch('services.cohere_service.CohereService.process_message') as mock_process:
        mock_process.return_value = {
            "response": "First message response",
            "tool_calls": []
        }
        
        # First message to establish conversation
        response1 = client.post(
            "/api/test_user/chat",
            json={"message": "First message", "conversation_id": None},
            headers={"Authorization": "Bearer fake-token"}
        )
        
        assert response1.status_code == 200
        data1 = response1.json()
        conversation_id = data1["conversation_id"]
        
        # Second message using the same conversation
        mock_process.return_value = {
            "response": "Second message response",
            "tool_calls": []
        }
        
        response2 = client.post(
            "/api/test_user/chat",
            json={"message": "Second message", "conversation_id": conversation_id},
            headers={"Authorization": "Bearer fake-token"}
        )
        
        assert response2.status_code == 200
        data2 = response2.json()
        
        # Both responses should have the same conversation ID
        assert data2["conversation_id"] == conversation_id