from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from utils.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    vehicle_type = Column(String)  # car, bike, scooter, etc.
    license_plate = Column(String, unique=True, index=True)
    price_per_day = Column(Float)
    price_per_hour = Column(Float)
    is_available = Column(Boolean, default=True)
    location = Column(String)
    image_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
