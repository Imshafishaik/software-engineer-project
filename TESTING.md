# Testing Guide

This document explains how to run tests for both the backend (Python) and frontend (React) of the OnRide Rentals application.

## Backend Testing (Python - pytest)

### Setup

1. Install test dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Running Tests

**Run all tests:**
```bash
pytest
```

**Run tests with verbose output:**
```bash
pytest -v
```

**Run tests with coverage report:**
```bash
pytest --cov=. --cov-report=html
```

**Run specific test file:**
```bash
pytest tests/test_auth_controller.py
```

**Run specific test class:**
```bash
pytest tests/test_auth_controller.py::TestRegisterUser
```

**Run specific test function:**
```bash
pytest tests/test_auth_controller.py::TestRegisterUser::test_register_user_success
```

**Run tests matching a pattern:**
```bash
pytest -k "register"
```

### Backend Test Files

- **`tests/test_main.py`** - Tests for main application endpoints (health check, root endpoint)
- **`tests/test_auth_controller.py`** - Tests for authentication logic (register, login, token generation)
- **`tests/test_vehicle_controller.py`** - Tests for vehicle CRUD operations
- **`tests/test_routes.py`** - Tests for API route endpoints

### Test Coverage

Backend tests cover:
- ✅ User registration with validation
- ✅ User authentication and login
- ✅ JWT token generation
- ✅ Vehicle CRUD operations
- ✅ Vehicle availability filtering
- ✅ Error handling for invalid inputs
- ✅ API endpoints integration

---

## Frontend Testing (React - Jest)

### Setup

1. Install dependencies (including Jest):
```bash
cd frontend
npm install
```

2. Jest configuration is already set up in `jest.config.js` and `.babelrc`

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode (auto-rerun on file changes):**
```bash
npm run test:watch
```

**Run tests with coverage report:**
```bash
npm run test:coverage
```

**Run specific test file:**
```bash
npm test -- App.test.jsx
```

**Run tests matching a pattern:**
```bash
npm test -- --testNamePattern="renders"
```

### Frontend Test Files

- **`src/__tests__/App.test.jsx`** - Tests for main App component
- **`src/__tests__/api.test.js`** - Tests for API client and interceptors
- **`src/__tests__/Navbar.test.jsx`** - Tests for Navbar component
- **`src/__tests__/VehicleCard.test.jsx`** - Tests for VehicleCard component

### Test Coverage

Frontend tests cover:
- ✅ Component rendering
- ✅ API interceptors (authorization headers)
- ✅ Navigation links and routing
- ✅ Vehicle card display and interactions
- ✅ Button click handlers
- ✅ Conditional rendering (available/unavailable states)

---

## CI/CD Integration

### Running All Tests Together

```bash
# From project root
# Run backend tests
cd backend && pytest && cd ..

# Run frontend tests
cd frontend && npm test -- --passWithNoTests && cd ..
```

---

## Tips for Writing More Tests

### Backend (pytest)
- Use the `db` fixture from `conftest.py` for database operations
- Use the `client` fixture for API endpoint testing
- Mock external dependencies using `unittest.mock`
- Test both success and failure cases
- Validate error messages

### Frontend (Jest)
- Use React Testing Library for component testing
- Mock external modules (like axios) with `jest.mock()`
- Test user interactions with `fireEvent` or `userEvent`
- Test component rendering and props
- Verify callback functions are called correctly
- Use `data-testid` for element selection

---

## Troubleshooting

### Backend
- If tests fail due to database issues, ensure SQLite test database is writable
- Check that all dependencies in `requirements.txt` are installed
- Ensure environment variables are properly configured

### Frontend
- Clear node_modules and reinstall if tests don't run: `rm -rf node_modules && npm install`
- Check that Babel configuration is correct in `.babelrc`
- Ensure Jest configuration in `jest.config.js` matches your project structure
- Mock API calls to avoid external dependencies during testing

---

## Coverage Goals

- **Backend**: Aim for >80% code coverage
- **Frontend**: Aim for >70% code coverage for critical components

Check coverage with:
```bash
# Backend
pytest --cov=. --cov-report=html
# View in: htmlcov/index.html

# Frontend
npm run test:coverage
# View in: coverage/lcov-report/index.html
```
