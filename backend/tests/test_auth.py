import pytest

def test_register_user_success(client):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "newuser@test.com",
            "name": "New User",
            "role": "rider",
            "password": "securepassword"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@test.com"
    assert data["name"] == "New User"
    assert data["role"] == "rider"
    assert "id" in data
    assert "password" not in data

def test_register_duplicate_email(client):
    # First registration
    client.post(
        "/api/auth/register",
        json={
            "email": "duplicate@test.com",
            "name": "First User",
            "role": "rider",
            "password": "password123"
        }
    )
    
    # Second registration with same email
    response = client.post(
        "/api/auth/register",
        json={
            "email": "duplicate@test.com",
            "name": "Second User",
            "role": "owner",
            "password": "differentpassword"
        }
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already exists"

def test_login_success(client):
    # Register first
    client.post(
        "/api/auth/register",
        json={
            "email": "loginuser@test.com",
            "name": "Login User",
            "role": "rider",
            "password": "mysecretpassword"
        }
    )
    
    # Login
    response = client.post(
        "/api/auth/login",
        json={
            "username": "loginuser@test.com",
            "password": "mysecretpassword"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client):
    # Register first
    client.post(
        "/api/auth/register",
        json={
            "email": "loginuser2@test.com",
            "name": "Login User 2",
            "role": "rider",
            "password": "mysecretpassword"
        }
    )
    
    # Try login with wrong password
    response = client.post(
        "/api/auth/login",
        json={
            "username": "loginuser2@test.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"

    # Try login with non-existent user
    response = client.post(
        "/api/auth/login",
        json={
            "username": "nonexistent@test.com",
            "password": "password"
        }
    )
    assert response.status_code == 401