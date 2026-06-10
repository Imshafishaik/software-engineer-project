from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from utils.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    rider_id = Column(Integer, ForeignKey("users.id"))
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    start_date = Column(String)
    end_date = Column(String)
    status = Column(String, default="pending")

    rider = relationship("User", foreign_keys=[rider_id])
    vehicle = relationship("Vehicle", foreign_keys=[vehicle_id])
