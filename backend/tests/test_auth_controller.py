import pytest
from sqlalchemy.orm import Session
from models.user import User
from schemas.user_schema import UserCreate, LoginRequest
from controllers.auth_controller import (
    register_user,
    authenticate_user,
    generate_token,
)
from utils.auth import get_password_hash, verify_password


class TestRegisterUser:
    def test_register_user_success(self, db: Session):
        """Test successful user registration"""
        user_data = UserCreate(
            email="test@example.com",
            username="testuser",
            full_name="Test User",
            phone="1234567890",
            password="password123",
        )

        user = register_user(user_data, db)

        assert user.id is not None
        assert user.email == "test@example.com"
        assert user.username == "testuser"
        assert user.full_name == "Test User"
        assert user.phone == "1234567890"
        assert verify_password("password123", user.hashed_password)

    def test_register_user_duplicate_email(self, db: Session):
        """Test registration fails with duplicate email"""
        user_data = UserCreate(
            email="test@example.com",
            username="testuser1",
            full_name="Test User 1",
            password="password123",
        )
        register_user(user_data, db)

        duplicate_data = UserCreate(
            email="test@example.com",
            username="testuser2",
            full_name="Test User 2",
            password="password123",
        )

        with pytest.raises(ValueError, match="Email or username already exists"):
            register_user(duplicate_data, db)

    def test_register_user_duplicate_username(self, db: Session):
        """Test registration fails with duplicate username"""
        user_data = UserCreate(
            email="test1@example.com",
            username="testuser",
            full_name="Test User 1",
            password="password123",
        )
        register_user(user_data, db)

        duplicate_data = UserCreate(
            email="test2@example.com",
            username="testuser",
            full_name="Test User 2",
            password="password123",
        )

        with pytest.raises(ValueError, match="Email or username already exists"):
            register_user(duplicate_data, db)


class TestAuthenticateUser:
    def test_authenticate_user_success(self, db: Session):
        """Test successful user authentication"""
        user_data = UserCreate(
            email="test@example.com",
            username="testuser",
            full_name="Test User",
            password="password123",
        )
        register_user(user_data, db)

        login_data = LoginRequest(username="testuser", password="password123")
        user = authenticate_user(login_data, db)

        assert user.username == "testuser"
        assert user.email == "test@example.com"

    def test_authenticate_user_invalid_password(self, db: Session):
        """Test authentication fails with invalid password"""
        user_data = UserCreate(
            email="test@example.com",
            username="testuser",
            full_name="Test User",
            password="password123",
        )
        register_user(user_data, db)

        login_data = LoginRequest(username="testuser", password="wrongpassword")

        with pytest.raises(ValueError, match="Invalid credentials"):
            authenticate_user(login_data, db)

    def test_authenticate_user_nonexistent(self, db: Session):
        """Test authentication fails for non-existent user"""
        login_data = LoginRequest(username="nonexistent", password="password123")

        with pytest.raises(ValueError, match="Invalid credentials"):
            authenticate_user(login_data, db)


class TestGenerateToken:
    def test_generate_token_success(self, db: Session):
        """Test successful token generation"""
        user_data = UserCreate(
            email="test@example.com",
            username="testuser",
            full_name="Test User",
            password="password123",
        )
        user = register_user(user_data, db)

        token_response = generate_token(user)

        assert token_response.access_token is not None
        assert token_response.token_type == "bearer"
        assert len(token_response.access_token) > 0
