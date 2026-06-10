from datetime import timedelta
from sqlalchemy.orm import Session
from models.user import User
from schemas.user_schema import UserCreate, LoginRequest, TokenResponse
from utils.auth import get_password_hash, verify_password, create_access_token
from config import settings


def register_user(user_data: UserCreate, db: Session) -> User:
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    
    if existing_user:
        raise ValueError("Email already exists")
    
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        name=user_data.name,
        role=user_data.role,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(login_data: LoginRequest, db: Session) -> User:
    user = db.query(User).filter(User.email == login_data.username).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise ValueError("Invalid credentials")
    
    return user


def generate_token(user: User) -> TokenResponse:
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id, "role": user.role},
        expires_delta=access_token_expires
    )
    return TokenResponse(access_token=access_token, token_type="bearer")
