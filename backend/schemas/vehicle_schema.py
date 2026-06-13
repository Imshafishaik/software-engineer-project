from pydantic import BaseModel
from typing import Optional


class VehicleBase(BaseModel):
    make: str
    model: str
    year: int
    price_per_day: float
    accessibility_features: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None


class VehicleCreate(VehicleBase):
    owner_id: int
    pass


class VehicleUpdate(BaseModel):
    owner_id: Optional[int] = None
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    description: Optional[str] = None
    price_per_day: Optional[float] = None
    accessibility_features: Optional[str] = None
    image_url: Optional[str] = None


class VehicleResponse(VehicleBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True