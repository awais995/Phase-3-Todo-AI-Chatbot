from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from models import User, UserCreate, UserLogin, UserRead, UserUpdate
from dependencies import verify_token
from db import get_session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
import os
import secrets
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from typing import Dict
from dotenv import load_dotenv

load_dotenv()


router = APIRouter(prefix="/api/auth", tags=["auth"])

# Password hashing context - force bcrypt backend to avoid compatibility issues
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__ident="2b")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    # Bcrypt has a 72-byte limit, so truncate if necessary
    truncated_password = password[:72] if len(password) > 72 else password
    return pwd_context.hash(truncated_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    # Use current time + expiration delta for token expiry
    from datetime import datetime, timezone
    current_time = datetime.now(timezone.utc)  # Use timezone-aware datetime
    if expires_delta:
        expire = current_time + expires_delta
    else:
        expire = current_time + timedelta(minutes=15)

    # Ensure the expiration is at least 1 minute in the future
    min_expire = current_time + timedelta(minutes=1)
    if expire < min_expire:
        expire = min_expire

    # Convert to Unix timestamp for JWT compliance
    to_encode.update({"exp": int(expire.timestamp())})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/register", response_model=UserRead)
def register(user_data: UserCreate, session: Session = Depends(get_session)):
    """
    Register a new user.
    """
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = get_password_hash(user_data.password)

    # Create the user
    user = User(
        email=user_data.email,
        password=hashed_password,
        name=user_data.name
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


@router.post("/login")
def login(user_data: UserLogin, session: Session = Depends(get_session)):
    """
    Login a user and return access token.
    """
    # Find user by email
    user = session.exec(select(User).where(User.email == user_data.email)).first()

    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )


    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
    }


@router.put("/profile", response_model=UserRead)
def update_profile(user_update: UserUpdate, credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()), session: Session = Depends(get_session)):
    """
    Update the current user's profile information.
    Email cannot be updated for security reasons.
    """
    try:
        user_id = verify_token(credentials.credentials)

        # Get user from database
        user = session.get(User, user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Update allowed fields, excluding email for security
        update_data = user_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            if hasattr(user, field) and field != 'email':  # Prevent email updates
                setattr(user, field, value)

        session.add(user)
        session.commit()
        session.refresh(user)

        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.get("/session")
def get_session_endpoint(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()), session: Session = Depends(get_session)):
    """
    Get the current session based on the JWT token.
    """
    try:

        user_id = verify_token(credentials.credentials)

        # Get user details from database
        user = session.get(User, user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return {
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "bio": user.bio
            },
            "token": credentials.credentials
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Add the get-session endpoint that the frontend is looking for
@router.get("/get-session")
def get_session_alias(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()), session: Session = Depends(get_session)):
    """
    Alias for /session endpoint to match frontend expectations.
    """
    return get_session_endpoint(credentials, session)


@router.post("/sign-out")
def sign_out():
    """
    Sign out the user (client-side operation, no server-side invalidation).
    """
    return {"message": "Signed out successfully"}




# Debug endpoint to check SECRET_KEY
@router.get("/debug/keys")
def debug_keys():
    """
    Debug endpoint to check the SECRET_KEY being used.
    """
    from config import SECRET_KEY
    return {"secret_key": SECRET_KEY[:20] + "...", "full_length": len(SECRET_KEY)}


