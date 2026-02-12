import logging
from datetime import datetime
from typing import Dict, Any


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def log_security_event(event_type: str, user_id: str, details: Dict[str, Any] = None):
    """
    Log security-related events for audit purposes.
    """
    log_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "event_type": event_type,
        "user_id": user_id,
        "details": details or {}
    }
    
    logger.info(f"SECURITY_EVENT: {log_data}")


def log_error(error: Exception, context: str = "", user_id: str = None):
    """
    Log application errors with context.
    """
    log_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "context": context,
        "error_type": type(error).__name__,
        "error_message": str(error),
        "user_id": user_id
    }
    
    logger.error(f"APP_ERROR: {log_data}")


def handle_error_response(error: Exception, user_friendly_msg: str = None) -> Dict[str, Any]:
    """
    Create a standardized error response.
    """
    error_msg = user_friendly_msg or "An unexpected error occurred. Please try again later."
    
    # Log the actual error for debugging (without exposing to user)
    log_error(error)
    
    return {
        "success": False,
        "error": error_msg,
        "timestamp": datetime.utcnow().isoformat()
    }