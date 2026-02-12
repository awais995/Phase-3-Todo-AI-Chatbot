import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_error_handling_responses(client):
    """Test that the system handles errors gracefully."""
    with patch('services.cohere_service.CohereService.process_message') as mock_process:
        # Simulate an error in the Cohere service
        def side_effect(*args, **kwargs):
            raise Exception("Cohere API error")
        
        mock_process.side_effect = side_effect
        
        response = client.post(
            "/api/test_user/chat",
            json={"message": "Test message", "conversation_id": None},
            headers={"Authorization": "Bearer fake-token"}
        )
        
        assert response.status_code == 200  # Should still return 200 but with error message
        data = response.json()
        assert "error" in data["response"] or "encountered an error" in data["response"].lower()
        
        # Reset the mock to return normal responses
        mock_process.side_effect = None
        mock_process.return_value = {
            "response": "Normal response",
            "tool_calls": []
        }
        
        # Normal request should work fine
        response_normal = client.post(
            "/api/test_user/chat",
            json={"message": "Normal message", "conversation_id": None},
            headers={"Authorization": "Bearer fake-token"}
        )
        
        assert response_normal.status_code == 200
        data_normal = response_normal.json()
        assert "error" not in data_normal["response"]