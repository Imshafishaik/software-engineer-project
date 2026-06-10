import pytest
from utils.auth import create_access_token

@pytest.fixture
def auth_headers(client):
    # Register a test user
    register_response = client.post(
        "/api/auth/register",
        json={
            "email": "rider_test@test.com",
            "name": "Rider Test",
            "role": "rider",
            "password": "password"
        }
    )
    user_id = register_response.json()["id"]
    
    # Generate token
    token = create_access_token(data={"user_id": user_id, "sub": "rider_test@test.com"})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def created_vehicle(client):
    response = client.post(
        "/api/vehicles/",
        json={
            "owner_id": 99,
            "make": "Toyota",
            "model": "Sienna",
            "year": 2021,
            "price_per_day": 95.0,
            "accessibility_features": "Side-entry ramp",
            "image_url": "https://example.com/sienna.jpg",
            "description": "Wheelchair accessible van."
        }
    )
    return response.json()

def test_create_booking_success(client, auth_headers, created_vehicle):
    response = client.post(
        "/api/bookings/",
        json={
            "vehicle_id": created_vehicle["id"],
            "start_date": "2026-07-01",
            "end_date": "2026-07-07"
        },
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["vehicle_id"] == created_vehicle["id"]
    assert data["start_date"] == "2026-07-01"
    assert data["end_date"] == "2026-07-07"
    assert data["status"] == "pending"
    assert "id" in data

def test_create_booking_vehicle_not_found(client, auth_headers):
    response = client.post(
        "/api/bookings/",
        json={
            "vehicle_id": 9999,
            "start_date": "2026-07-01",
            "end_date": "2026-07-07"
        },
        headers=auth_headers
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Vehicle not found"

def test_list_my_bookings(client, auth_headers, created_vehicle):
    # Add a booking first
    client.post(
        "/api/bookings/",
        json={
            "vehicle_id": created_vehicle["id"],
            "start_date": "2026-07-01",
            "end_date": "2026-07-07"
        },
        headers=auth_headers
    )
    
    response = client.get("/api/bookings/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["vehicle_id"] == created_vehicle["id"]
