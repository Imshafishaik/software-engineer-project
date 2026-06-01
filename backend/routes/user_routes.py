from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from schemas.user_schema import UserResponse, UserUpdate
from controllers.user_controller import (
    get_user_by_id, get_all_users, update_user, deactivate_user
)
from utils.database import get_db

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user_by_id(user_id, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.get("/", response_model=list[UserResponse])
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return get_all_users(db, skip=skip, limit=limit)


@router.put("/{user_id}", response_model=UserResponse)
def update_user_data(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db)
):
    try:
        return update_user(user_id, user_data, db)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/{user_id}")
def deactivate_user_account(user_id: int, db: Session = Depends(get_db)):
    try:
        deactivate_user(user_id, db)
        return {"message": "User deactivated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
