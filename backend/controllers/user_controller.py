from sqlalchemy.orm import Session
from models.user import User
from schemas.user_schema import UserUpdate
from utils.auth import get_password_hash


def get_user_by_id(user_id: int, db: Session) -> User:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username(username: str, db: Session) -> User:
    return db.query(User).filter(User.email == username).first()


def get_user_by_email(email: str, db: Session) -> User:
    return db.query(User).filter(User.email == email).first()


def update_user(user_id: int, user_data: UserUpdate, db: Session) -> User:
    db_user = db.query(User).filter(User.id == user_id).first()
    
    if not db_user:
        raise ValueError("User not found")
    
    update_data = user_data.dict(exclude_unset=True)
    
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user


def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


def deactivate_user(user_id: int, db: Session) -> User:
    db_user = db.query(User).filter(User.id == user_id).first()
    
    if not db_user:
        raise ValueError("User not found")
    
    db.delete(db_user)
    db.commit()
    return db_user