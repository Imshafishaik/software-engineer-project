from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class VehicleBase(BaseModel):
    name: str
    description: Optional[str] = None
    vehicle_type: str
    license_plate: str
    price_per_day: float
    price_per_hour: float
    location: str
    image_url: Optional[str] = None


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price_per_day: Optional[float] = None
    price_per_hour: Optional[float] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None


class VehicleResponse(VehicleBase):
    id: int
    is_available: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
