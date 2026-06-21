# backend/app/api/routes/auth.py
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate, UserLogin, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = AuthService.register_user(
        db=db,
        username=user_data.username,
        email=user_data.email,
        password=user_data.password,
        role=user_data.role
    )
    return {"message": "User created successfully", "user_id": user.id}

@router.post("/login", response_model=TokenResponse)
def login(user_data: UserLogin, request: Request, db: Session = Depends(get_db)):
    ip = request.client.host if request.client else None
    result = AuthService.login_user(
        db=db,
        username=user_data.username,
        password=user_data.password,
        ip=ip
    )
    return result