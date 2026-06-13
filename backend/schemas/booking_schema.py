from pydantic import BaseModel


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

    class Config:
        from_attributes = True