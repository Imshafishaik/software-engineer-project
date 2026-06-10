import pytest

@pytest.fixture
def test_vehicle_data():
    return {
        "owner_id": 1,
        "make": "Toyota",
        "model": "Sienna",
        "year": 2021,
        "price_per_day": 95.0,
        "accessibility_features": "Side-entry ramp, power sliding doors",
        "image_url": "https://example.com/sienna.jpg",
        "description": "Automated wheelchair accessible van."
    }

def test_create_vehicle(client, test_vehicle_data):
    response = client.post("/api/vehicles/", json=test_vehicle_data)
    assert response.status_code == 200
    data = response.json()
    assert data["make"] == "Toyota"
    assert data["model"] == "Sienna"
    assert data["owner_id"] == 1
    assert "id" in data

def test_list_vehicles(client, test_vehicle_data):
    # Add a vehicle first
    client.post("/api/vehicles/", json=test_vehicle_data)
    
    response = client.get("/api/vehicles/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["make"] == "Toyota"

def test_get_vehicle_by_id(client, test_vehicle_data):
    # Add a vehicle first
    res = client.post("/api/vehicles/", json=test_vehicle_data)
    vehicle_id = res.json()["id"]
    
    response = client.get(f"/api/vehicles/{vehicle_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == vehicle_id
    assert data["make"] == "Toyota"

def test_get_vehicle_not_found(client):
    response = client.get("/api/vehicles/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Vehicle not found"

def test_update_vehicle(client, test_vehicle_data):
    # Add a vehicle first
    res = client.post("/api/vehicles/", json=test_vehicle_data)
    vehicle_id = res.json()["id"]
    
    # Update make and price
    update_data = {
        "make": "Honda",
        "price_per_day": 105.0
    }
    response = client.put(f"/api/vehicles/{vehicle_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["make"] == "Honda"
    assert data["price_per_day"] == 105.0
    assert data["model"] == "Sienna" # Kept original

def test_delete_vehicle(client, test_vehicle_data):
    # Add a vehicle first
    res = client.post("/api/vehicles/", json=test_vehicle_data)
    vehicle_id = res.json()["id"]
    
    # Delete it
    response = client.delete(f"/api/vehicles/{vehicle_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Vehicle deleted successfully"
    
    # Fetch it again
    res_get = client.get(f"/api/vehicles/{vehicle_id}")
    assert res_get.status_code == 404
