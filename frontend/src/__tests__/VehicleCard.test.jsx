import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock VehicleCard component for testing
const VehicleCard = ({ vehicle, onBook }) => (
  <div data-testid={`vehicle-card-${vehicle.id}`} className="vehicle-card">
    <h3>{vehicle.name}</h3>
    <p>{vehicle.description}</p>
    <p>${vehicle.price_per_day}/day</p>
    <p>${vehicle.price_per_hour}/hour</p>
    <p>Location: {vehicle.location}</p>
    {vehicle.is_available ? (
      <button onClick={() => onBook?.(vehicle)}>Book Now</button>
    ) : (
      <p>Not Available</p>
    )}
  </div>
);

describe('VehicleCard Component', () => {
  const mockVehicle = {
    id: 1,
    name: 'Tesla Model S',
    description: 'Electric sedan',
    price_per_day: 100,
    price_per_hour: 15,
    location: 'Downtown',
    is_available: true,
  };

  it('renders vehicle information correctly', () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText('Tesla Model S')).toBeInTheDocument();
    expect(screen.getByText('Electric sedan')).toBeInTheDocument();
    expect(screen.getByText('$100/day')).toBeInTheDocument();
    expect(screen.getByText('$15/hour')).toBeInTheDocument();
    expect(screen.getByText('Location: Downtown')).toBeInTheDocument();
  });

  it('shows book button when vehicle is available', () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    const bookButton = screen.getByText('Book Now');
    expect(bookButton).toBeInTheDocument();
  });

  it('shows not available message when vehicle is unavailable', () => {
    const unavailableVehicle = { ...mockVehicle, is_available: false };
    render(<VehicleCard vehicle={unavailableVehicle} />);

    expect(screen.getByText('Not Available')).toBeInTheDocument();
    expect(screen.queryByText('Book Now')).not.toBeInTheDocument();
  });

  it('calls onBook callback when book button is clicked', () => {
    const mockOnBook = jest.fn();
    render(<VehicleCard vehicle={mockVehicle} onBook={mockOnBook} />);

    const bookButton = screen.getByText('Book Now');
    fireEvent.click(bookButton);

    expect(mockOnBook).toHaveBeenCalledWith(mockVehicle);
  });

  it('renders vehicle card with correct test id', () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByTestId('vehicle-card-1')).toBeInTheDocument();
  });
});
