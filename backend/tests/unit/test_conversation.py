import pytest
from src.models.conversation import Conversation


def test_conversation_creation():
    """Test that a conversation can be created with required fields."""
    conversation = Conversation(user_id="test_user")
    
    assert conversation.user_id == "test_user"
    assert conversation.id is None  # Will be set by the database


def test_conversation_optional_fields():
    """Test conversation with optional fields."""
    conversation = Conversation(user_id="test_user")
    
    # Check that required field is set
    assert conversation.user_id == "test_user"
    
    # Check default values
    assert conversation.id is None  # Will be set by the database