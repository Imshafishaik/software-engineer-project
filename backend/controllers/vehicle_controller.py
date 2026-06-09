from sqlalchemy.orm import Session
from models.vehicle import Vehicle
from schemas.vehicle_schema import VehicleCreate, VehicleUpdate


def create_vehicle(vehicle_data: VehicleCreate, db: Session) -> Vehicle:
    db_vehicle = Vehicle(**vehicle_data.model_dump())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


def get_all_vehicles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Vehicle).offset(skip).limit(limit).all()


def get_vehicle_by_id(vehicle_id: int, db: Session) -> Vehicle:
    return db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()


def get_available_vehicles(db: Session):
    return db.query(Vehicle).filter(Vehicle.is_available == True).all()


def update_vehicle(vehicle_id: int, vehicle_data: VehicleUpdate, db: Session) -> Vehicle:
    db_vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    
    if not db_vehicle:
        raise ValueError("Vehicle not found")
    
    update_data = vehicle_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_vehicle, field, value)
    
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


def delete_vehicle(vehicle_id: int, db: Session):
    db_vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    
    if not db_vehicle:
        raise ValueError("Vehicle not found")
    
    db.delete(db_vehicle)
    db.commit()
    return True
