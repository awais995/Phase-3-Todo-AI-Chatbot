import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_user_isolation(client):
    """Test that users can only access their own data."""
    with patch('services.cohere_service.CohereService.process_message') as mock_process:
        mock_process.return_value = {
            "response": "Test response",
            "tool_calls": []
        }
        
        # User A tries to access their own conversation
        response_a = client.post(
            "/api/user_a/chat",
            json={"message": "Test message", "conversation_id": None},
            headers={"Authorization": "Bearer user_a_token"}
        )
        
        # User B tries to access their own conversation
        response_b = client.post(
            "/api/user_b/chat",
            json={"message": "Test message", "conversation_id": None},
            headers={"Authorization": "Bearer user_b_token"}
        )
        
        # Both should succeed as they're accessing their own data
        assert response_a.status_code == 200
        assert response_b.status_code == 200
        
        # User A tries to access user B's endpoint with user A's token
        # This should fail due to user_id mismatch
        response_mismatch = client.post(
            "/api/user_b/chat",
            json={"message": "Test message", "conversation_id": None},
            headers={"Authorization": "Bearer user_a_token"}
        )
        
        # This should return 403 Forbidden due to user_id mismatch
        assert response_mismatch.status_code == 403