import pytest
from schemas.user_schema import UserCreate
from schemas.vehicle_schema import VehicleCreate
from controllers.auth_controller import register_user


class TestAuthRoutes:
    def test_register_endpoint(self, client):
        """Test user registration endpoint"""
        response = client.post(
            "/api/auth/register",
            json={
                "email": "newuser@example.com",
                "username": "newuser",
                "full_name": "New User",
                "phone": "1234567890",
                "password": "password123",
            },
        )

        assert response.status_code == 200 or response.status_code == 201
        data = response.json()
        assert "id" in data
        assert data["email"] == "newuser@example.com"
        assert data["username"] == "newuser"

    def test_login_endpoint(self, client, db):
        """Test user login endpoint"""
        # Register user first
        user_data = UserCreate(
            email="testuser@example.com",
            username="testuser",
            full_name="Test User",
            password="securepassword123",
        )
        register_user(user_data, db)

        # Test login
        response = client.post(
            "/api/auth/login",
            json={"username": "testuser", "password": "securepassword123"},
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_credentials(self, client, db):
        """Test login with invalid credentials"""
        user_data = UserCreate(
            email="testuser@example.com",
            username="testuser",
            full_name="Test User",
            password="securepassword123",
        )
        register_user(user_data, db)

        response = client.post(
            "/api/auth/login", json={"username": "testuser", "password": "wrongpassword"}
        )

        assert response.status_code == 401 or response.status_code == 400


class TestVehicleRoutes:
    def test_create_vehicle(self, client):
        """Test vehicle creation endpoint"""
        response = client.post(
            "/api/vehicles/",
            json={
                "name": "Tesla Model S",
                "description": "Electric sedan",
                "vehicle_type": "car",
                "license_plate": "ABC123",
                "price_per_day": 100.0,
                "price_per_hour": 15.0,
                "location": "Downtown",
                "image_url": "https://example.com/tesla.jpg",
            },
        )

        assert response.status_code == 200 or response.status_code == 201
        data = response.json()
        assert data["name"] == "Tesla Model S"
        assert data["is_available"] is True

    def test_get_all_vehicles(self, client):
        """Test retrieving all vehicles"""
        # Create some vehicles first
        client.post(
            "/api/vehicles/",
            json={
                "name": "Car 1",
                "vehicle_type": "car",
                "license_plate": "ABC123",
                "price_per_day": 100.0,
                "price_per_hour": 15.0,
                "location": "Downtown",
            },
        )

        response = client.get("/api/vehicles/")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_get_vehicle_by_id(self, client):
        """Test retrieving a specific vehicle"""
        # Create a vehicle first
        create_response = client.post(
            "/api/vehicles/",
            json={
                "name": "Tesla Model S",
                "vehicle_type": "car",
                "license_plate": "ABC123",
                "price_per_day": 100.0,
                "price_per_hour": 15.0,
                "location": "Downtown",
            },
        )
        vehicle_id = create_response.json()["id"]

        # Retrieve the vehicle
        response = client.get(f"/api/vehicles/{vehicle_id}")

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Tesla Model S"

    def test_update_vehicle(self, client):
        """Test vehicle update endpoint"""
        # Create a vehicle first
        create_response = client.post(
            "/api/vehicles/",
            json={
                "name": "Tesla Model S",
                "vehicle_type": "car",
                "license_plate": "ABC123",
                "price_per_day": 100.0,
                "price_per_hour": 15.0,
                "location": "Downtown",
            },
        )
        vehicle_id = create_response.json()["id"]

        # Update the vehicle
        response = client.put(
            f"/api/vehicles/{vehicle_id}",
            json={"price_per_day": 120.0, "location": "Airport"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["price_per_day"] == 120.0
        assert data["location"] == "Airport"

    def test_delete_vehicle(self, client):
        """Test vehicle deletion endpoint"""
        # Create a vehicle first
        create_response = client.post(
            "/api/vehicles/",
            json={
                "name": "Tesla Model S",
                "vehicle_type": "car",
                "license_plate": "ABC123",
                "price_per_day": 100.0,
                "price_per_hour": 15.0,
                "location": "Downtown",
            },
        )
        vehicle_id = create_response.json()["id"]

        # Delete the vehicle
        response = client.delete(f"/api/vehicles/{vehicle_id}")

        assert response.status_code == 200

        # Verify deletion
        get_response = client.get(f"/api/vehicles/{vehicle_id}")
        assert get_response.status_code == 404
