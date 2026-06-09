import pytest
from sqlalchemy.orm import Session
from models.vehicle import Vehicle
from schemas.vehicle_schema import VehicleCreate, VehicleUpdate
from controllers.vehicle_controller import (
    create_vehicle,
    get_all_vehicles,
    get_vehicle_by_id,
    get_available_vehicles,
    update_vehicle,
    delete_vehicle,
)


class TestCreateVehicle:
    def test_create_vehicle_success(self, db: Session):
        """Test successful vehicle creation"""
        vehicle_data = VehicleCreate(
            name="Tesla Model S",
            description="Electric sedan",
            vehicle_type="car",
            license_plate="ABC123",
            price_per_day=100.0,
            price_per_hour=15.0,
            location="Downtown",
            image_url="https://example.com/tesla.jpg",
        )

        vehicle = create_vehicle(vehicle_data, db)

        assert vehicle.id is not None
        assert vehicle.name == "Tesla Model S"
        assert vehicle.vehicle_type == "car"
        assert vehicle.license_plate == "ABC123"
        assert vehicle.price_per_day == 100.0
        assert vehicle.is_available is True


class TestGetVehicles:
    def test_get_all_vehicles(self, db: Session):
        """Test retrieving all vehicles"""
        # Create test vehicles
        vehicle1 = create_vehicle(
            VehicleCreate(
                name="Car 1",
                vehicle_type="car",
                license_plate="ABC123",
                price_per_day=100.0,
                price_per_hour=15.0,
                location="Downtown",
            ),
            db,
        )
        vehicle2 = create_vehicle(
            VehicleCreate(
                name="Car 2",
                vehicle_type="car",
                license_plate="DEF456",
                price_per_day=150.0,
                price_per_hour=20.0,
                location="Airport",
            ),
            db,
        )

        vehicles = get_all_vehicles(db)

        assert len(vehicles) == 2
        assert vehicles[0].name == "Car 1"
        assert vehicles[1].name == "Car 2"

    def test_get_vehicle_by_id(self, db: Session):
        """Test retrieving a vehicle by ID"""
        vehicle_data = VehicleCreate(
            name="Tesla Model S",
            vehicle_type="car",
            license_plate="ABC123",
            price_per_day=100.0,
            price_per_hour=15.0,
            location="Downtown",
        )
        created_vehicle = create_vehicle(vehicle_data, db)

        retrieved_vehicle = get_vehicle_by_id(created_vehicle.id, db)

        assert retrieved_vehicle is not None
        assert retrieved_vehicle.name == "Tesla Model S"
        assert retrieved_vehicle.id == created_vehicle.id

    def test_get_nonexistent_vehicle(self, db: Session):
        """Test retrieving non-existent vehicle returns None"""
        vehicle = get_vehicle_by_id(9999, db)
        assert vehicle is None

    def test_get_available_vehicles(self, db: Session):
        """Test retrieving only available vehicles"""
        # Create available vehicle
        available_vehicle = create_vehicle(
            VehicleCreate(
                name="Available Car",
                vehicle_type="car",
                license_plate="ABC123",
                price_per_day=100.0,
                price_per_hour=15.0,
                location="Downtown",
            ),
            db,
        )

        # Create unavailable vehicle
        unavailable_vehicle = create_vehicle(
            VehicleCreate(
                name="Rented Car",
                vehicle_type="car",
                license_plate="DEF456",
                price_per_day=150.0,
                price_per_hour=20.0,
                location="Airport",
            ),
            db,
        )
        update_vehicle(unavailable_vehicle.id, VehicleUpdate(is_available=False), db)

        available = get_available_vehicles(db)

        assert len(available) == 1
        assert available[0].name == "Available Car"
        assert available[0].is_available is True


class TestUpdateVehicle:
    def test_update_vehicle_success(self, db: Session):
        """Test successful vehicle update"""
        vehicle_data = VehicleCreate(
            name="Tesla Model S",
            vehicle_type="car",
            license_plate="ABC123",
            price_per_day=100.0,
            price_per_hour=15.0,
            location="Downtown",
        )
        vehicle = create_vehicle(vehicle_data, db)

        update_data = VehicleUpdate(price_per_day=120.0, location="Airport")
        updated_vehicle = update_vehicle(vehicle.id, update_data, db)

        assert updated_vehicle.price_per_day == 120.0
        assert updated_vehicle.location == "Airport"
        assert updated_vehicle.name == "Tesla Model S"  # Unchanged

    def test_update_nonexistent_vehicle(self, db: Session):
        """Test updating non-existent vehicle raises error"""
        update_data = VehicleUpdate(price_per_day=120.0)

        with pytest.raises(ValueError, match="Vehicle not found"):
            update_vehicle(9999, update_data, db)


class TestDeleteVehicle:
    def test_delete_vehicle_success(self, db: Session):
        """Test successful vehicle deletion"""
        vehicle_data = VehicleCreate(
            name="Tesla Model S",
            vehicle_type="car",
            license_plate="ABC123",
            price_per_day=100.0,
            price_per_hour=15.0,
            location="Downtown",
        )
        vehicle = create_vehicle(vehicle_data, db)

        result = delete_vehicle(vehicle.id, db)

        assert result is True
        assert get_vehicle_by_id(vehicle.id, db) is None

    def test_delete_nonexistent_vehicle(self, db: Session):
        """Test deleting non-existent vehicle raises error"""
        with pytest.raises(ValueError, match="Vehicle not found"):
            delete_vehicle(9999, db)
