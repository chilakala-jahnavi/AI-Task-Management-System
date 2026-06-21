# app/core/security.py
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings

# Use sha256_crypt instead of bcrypt to avoid 72-byte limit issues
# sha256_crypt is more compatible and doesn't have the password length limitation
pwd_context = CryptContext(
    schemes=["sha256_crypt"],
    deprecated="auto",
    sha256_crypt__rounds=10000  # Number of hashing rounds for security
)

security = HTTPBearer()

def get_password_hash(password: str) -> str:
    """
    Hash a password using sha256_crypt.
    No 72-byte limit like bcrypt, so passwords of any length work.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    Returns True if the password matches, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    """
    Create a JWT access token with expiration.
    
    Args:
        data: Dictionary containing user data (sub, role, etc.)
    
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """
    Decode and validate a JWT token.
    
    Args:
        token: JWT token string
    
    Returns:
        Decoded token payload as dictionary
    
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401, 
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=401, 
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Dependency to get the current authenticated user from JWT token.
    
    Args:
        credentials: HTTP Authorization credentials (Bearer token)
    
    Returns:
        Decoded token payload with user information
    
    Raises:
        HTTPException: If token is invalid
    """
    token = credentials.credentials
    return decode_access_token(token)

def get_current_admin_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Dependency to get the current authenticated admin user.
    Checks if the user has admin role.
    
    Args:
        credentials: HTTP Authorization credentials (Bearer token)
    
    Returns:
        Decoded token payload with user information
    
    Raises:
        HTTPException: If token is invalid or user is not an admin
    """
    token = credentials.credentials
    payload = decode_access_token(token)
    
    # Check if user has admin role
    if payload.get("role") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin privileges required",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return payload

# For backward compatibility - these are the same functions
# The names below are kept for compatibility with existing code
def create_token(data: dict) -> str:
    """Alias for create_access_token"""
    return create_access_token(data)

def verify_token(token: str) -> dict:
    """Alias for decode_access_token"""
    return decode_access_token(token)