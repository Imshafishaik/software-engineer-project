from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from schemas.vehicle_schema import VehicleCreate, VehicleResponse, VehicleUpdate
from controllers.vehicle_controller import (
    create_vehicle, get_all_vehicles, get_vehicle_by_id, 
    get_available_vehicles, update_vehicle, delete_vehicle
)
from utils.database import get_db

router = APIRouter(prefix="/api/vehicles", tags=["Vehicles"])


@router.post("/", response_model=VehicleResponse)
def create_new_vehicle(vehicle_data: VehicleCreate, db: Session = Depends(get_db)):
    return create_vehicle(vehicle_data, db)


@router.get("/", response_model=list[VehicleResponse])
def list_vehicles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return get_all_vehicles(db, skip=skip, limit=limit)


@router.get("/available", response_model=list[VehicleResponse])
def list_available_vehicles(db: Session = Depends(get_db)):
    return get_available_vehicles(db)


@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = get_vehicle_by_id(vehicle_id, db)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return vehicle


@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle_data(
    vehicle_id: int,
    vehicle_data: VehicleUpdate,
    db: Session = Depends(get_db)
):
    try:
        return update_vehicle(vehicle_id, vehicle_data, db)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/{vehicle_id}")
def delete_vehicle_data(vehicle_id: int, db: Session = Depends(get_db)):
    try:
        delete_vehicle(vehicle_id, db)
        return {"message": "Vehicle deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
