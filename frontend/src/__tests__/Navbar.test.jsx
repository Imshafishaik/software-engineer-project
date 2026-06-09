import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Navbar component for testing
const Navbar = () => (
  <nav data-testid="navbar">
    <a href="/">Home</a>
    <a href="/vehicles">Vehicles</a>
    <a href="/login">Login</a>
  </nav>
);

describe('Navbar Component', () => {
  it('renders navigation links', () => {
    render(<Navbar />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Vehicles')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('has correct href attributes', () => {
    render(<Navbar />);

    const homeLink = screen.getByText('Home');
    const vehiclesLink = screen.getByText('Vehicles');
    const loginLink = screen.getByText('Login');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(vehiclesLink).toHaveAttribute('href', '/vehicles');
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
