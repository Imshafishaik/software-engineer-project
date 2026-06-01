from pydantic import BaseModel
from typing import Optional, List

class UserBase(BaseModel):
    email: str
    name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str

class VehicleBase(BaseModel):
    make: str
    model: str
    year: int
    price_per_day: float
    accessibility_features: str
    image_url: str
    description: str

class VehicleCreate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: int
    owner_id: int
    model_config = {"from_attributes": True}

class BookingBase(BaseModel):
    vehicle_id: int
    start_date: str
    end_date: str

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    rider_id: int
    status: str
    model_config = {"from_attributes": True}
