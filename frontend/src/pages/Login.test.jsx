import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import api from '../api';
import { vi } from 'vitest';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the API client
vi.mock('../api', () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
    }
  };
});

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form inputs and submit button', () => {
    const { container } = render(
      <MemoryRouter>
        <Login setUser={() => {}} />
      </MemoryRouter>
    );

    expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('updates input values when typing', () => {
    const { container } = render(
      <MemoryRouter>
        <Login setUser={() => {}} />
      </MemoryRouter>
    );

    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');

    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('user@test.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('submits credentials and logs in successfully', async () => {
    const setUserMock = vi.fn();
    
    // Mock successful login call and subsequent user fetch
    api.post.mockResolvedValue({ data: { access_token: 'fake-jwt-token' } });
    api.get.mockResolvedValue({ data: { id: 1, name: 'John Doe', email: 'john@test.com', role: 'rider' } });

    const { container } = render(
      <MemoryRouter>
        <Login setUser={setUserMock} />
      </MemoryRouter>
    );

    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');

    fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/auth/login', {
        username: 'john@test.com',
        password: 'password123'
      });
      expect(api.get).toHaveBeenCalledWith('/api/users/me');
      expect(setUserMock).toHaveBeenCalledWith({ id: 1, name: 'John Doe', email: 'john@test.com', role: 'rider' });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays an error message when login fails', async () => {
    api.post.mockRejectedValue(new Error('Invalid credentials'));

    const { container } = render(
      <MemoryRouter>
        <Login setUser={() => {}} />
      </MemoryRouter>
    );

    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');

    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });
});
