from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    role = Column(String) # "rider" or "owner"

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    make = Column(String)
    model = Column(String)
    year = Column(Integer)
    price_per_day = Column(Float)
    accessibility_features = Column(Text) # "Wheelchair ramp, lift, wide doors"
    image_url = Column(String)
    description = Column(Text)

    owner = relationship("User")

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    rider_id = Column(Integer, ForeignKey("users.id"))
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    start_date = Column(String)
    end_date = Column(String)
    status = Column(String, default="pending") # pending, confirmed, completed, cancelled

    rider = relationship("User", foreign_keys=[rider_id])
    vehicle = relationship("Vehicle", foreign_keys=[vehicle_id])