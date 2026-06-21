# app/services/auth_service.py
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.activity_log import ActivityLog
from app.core.security import get_password_hash, verify_password, create_access_token
from fastapi import HTTPException

class AuthService:
    @staticmethod
    def register_user(db: Session, username: str, email: str, password: str, role: str = "user"):
        # Check if user exists
        existing_user = db.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username or email already exists")
        
        # Create new user
        hashed = get_password_hash(password)
        user = User(
            username=username, 
            email=email, 
            hashed_password=hashed, 
            role=role
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def login_user(db: Session, username: str, password: str, ip: str = None):
        user = db.query(User).filter(User.username == username).first()
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Log login activity
        log = ActivityLog(
            user_id=user.id, 
            action="login", 
            details=f"User {username} logged in", 
            ip_address=ip
        )
        db.add(log)
        db.commit()
        
        # Create token
        token = create_access_token({"sub": str(user.id), "role": user.role})
        return {"access_token": token, "token_type": "bearer", "role": user.role}