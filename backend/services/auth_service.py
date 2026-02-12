from functools import wraps
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from typing import Dict, Any
from pydantic import BaseModel
import os


class TokenData(BaseModel):
    user_id: str


def get_current_user(token: str = Depends(HTTPBearer())) -> TokenData:
    """
    Validates JWT token and extracts user_id from it.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Get the secret key from environment variables
        secret = os.getenv("BETTER_AUTH_SECRET")
        if not secret:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Server configuration error: Missing BETTER_AUTH_SECRET"
            )
        
        # Decode the token
        payload = jwt.decode(token.credentials, secret, algorithms=["HS256"])
        user_id: str = payload.get("userId")
        
        if user_id is None:
            raise credentials_exception
            
        token_data = TokenData(user_id=user_id)
    except jwt.PyJWTError:
        raise credentials_exception
    
    return token_data


def verify_user_id_match(token_user_id: str, path_user_id: str) -> bool:
    """
    Verifies that the user_id in the JWT token matches the user_id in the URL path.
    """
    return token_user_id == path_user_id


def get_current_user_with_validation(path_user_id: str, token_data: TokenData = Depends(get_current_user)):
    """
    Validates JWT token and ensures user_id matches the path parameter.
    """
    if not verify_user_id_match(token_data.user_id, path_user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User ID in token does not match the requested user ID"
        )
    
    return token_data