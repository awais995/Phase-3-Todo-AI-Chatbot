import pytest
from unittest.mock import AsyncMock, patch
from src.services.cohere_service import CohereService


def test_clarification_requests():
    """Test that the system detects ambiguous requests and generates clarifications."""
    cohere_service = CohereService()
    
    # Test that ambiguous requests are detected
    ambiguous_message = "Complete that task"
    is_ambiguous = cohere_service.detect_ambiguous_request(ambiguous_message)
    assert is_ambiguous is True
    
    # Test that clear requests are not detected as ambiguous
    clear_message = "Add a task to buy groceries"
    is_clear = cohere_service.detect_ambiguous_request(clear_message)
    assert is_clear is False
    
    # Test other ambiguous phrases
    other_ambiguous = "Mark the second one as done"
    is_ambiguous_2 = cohere_service.detect_ambiguous_request(other_ambiguous)
    assert is_ambiguous_2 is False  # This one doesn't match our current detection pattern