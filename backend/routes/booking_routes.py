from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from models.booking import Booking
from models.vehicle import Vehicle
from routes.user_routes import get_current_user
from schemas.booking_schema import BookingCreate, BookingResponse
from utils.database import get_db

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])


@router.post("/", response_model=BookingResponse)
def create_booking(
    booking_data: BookingCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == booking_data.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    booking = Booking(
        rider_id=current_user.id,
        vehicle_id=booking_data.vehicle_id,
        start_date=booking_data.start_date,
        end_date=booking_data.end_date,
        status="pending",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/me", response_model=list[BookingResponse])
def list_my_bookings(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Booking).filter(Booking.rider_id == current_user.id).all()
