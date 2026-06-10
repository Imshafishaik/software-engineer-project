from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from models.booking import Booking
from models.user import User
from models.vehicle import Vehicle
from routes.user_routes import get_current_user
from schemas.booking_schema import BookingResponse
from schemas.user_schema import UserResponse
from schemas.vehicle_schema import VehicleResponse
from utils.database import get_db

router = APIRouter(prefix="/api/admin", tags=["Admin"])


def require_admin(current_user=Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


@router.get("/users", response_model=list[UserResponse])
def list_admin_users(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return db.query(User).all()


@router.delete("/users/{user_id}")
def delete_admin_user(
    user_id: int,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


@router.get("/vehicles", response_model=list[VehicleResponse])
def list_admin_vehicles(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return db.query(Vehicle).all()


@router.delete("/vehicles/{vehicle_id}")
def delete_admin_vehicle(
    vehicle_id: int,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    db.delete(vehicle)
    db.commit()
    return {"message": "Vehicle deleted successfully"}


@router.get("/bookings", response_model=list[BookingResponse])
def list_admin_bookings(
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return db.query(Booking).all()


@router.put("/bookings/{booking_id}/status", response_model=BookingResponse)
def update_admin_booking_status(
    booking_id: int,
    status_value: str = Query(alias="status"),
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    booking.status = status_value
    db.commit()
    db.refresh(booking)
    return booking
