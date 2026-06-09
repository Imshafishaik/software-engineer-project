import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    return TestClient(app)


class TestHealthAndRoot:
    def test_read_root(self, client):
        """Test root endpoint returns welcome message"""
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "Welcome to OnRide Rentals API"}

    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
