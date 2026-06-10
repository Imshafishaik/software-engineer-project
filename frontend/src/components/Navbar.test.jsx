import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { vi } from 'vitest';

describe('Navbar Component', () => {
  it('renders guest links when no user is logged in', () => {
    render(
      <MemoryRouter>
        <Navbar user={null} setUser={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText('OnRide Rentals')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Vehicles')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('renders rider links when user is logged in with rider role', () => {
    const user = { name: 'Test Rider', role: 'rider' };
    render(
      <MemoryRouter>
        <Navbar user={user} setUser={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Vehicles')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('renders admin link when user is logged in with admin role', () => {
    const user = { name: 'Test Admin', role: 'admin' };
    render(
      <MemoryRouter>
        <Navbar user={user} setUser={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls setUser(null) and redirects when logout button is clicked', () => {
    const user = { name: 'Test Rider', role: 'rider' };
    const setUserMock = vi.fn();
    
    render(
      <MemoryRouter>
        <Navbar user={user} setUser={setUserMock} />
      </MemoryRouter>
    );

    const logoutBtn = screen.getByText('Logout');
    fireEvent.click(logoutBtn);

    expect(setUserMock).toHaveBeenCalledWith(null);
  });
});
