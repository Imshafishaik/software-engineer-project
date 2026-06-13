import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VehicleCard from './VehicleCard';

describe('VehicleCard Component', () => {
  const mockVehicle = {
    id: 42,
    make: 'Toyota',
    model: 'Sienna',
    year: 2021,
    price_per_day: 95.0,
    accessibility_features: 'Side-entry ramp, power sliding doors',
    image_url: 'https://example.com/sienna.jpg',
    description: 'Wheelchair accessible minivan.'
  };

  it('renders vehicle specifications and details', () => {
    render(
      <MemoryRouter>
        <VehicleCard vehicle={mockVehicle} />
      </MemoryRouter>
    );

    // Make, model, and year
    expect(screen.getByText('Toyota Sienna (2021)')).toBeInTheDocument();
    
    // Price
    expect(screen.getByText(/95/)).toBeInTheDocument();
    
    // Accessibility features
    expect(screen.getByText('Side-entry ramp, power sliding doors')).toBeInTheDocument();
    
    // Image source
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/sienna.jpg');
    expect(img).toHaveAttribute('alt', 'Toyota Sienna');

    // Link destination
    const bookLink = screen.getByRole('link', { name: 'Book Now' });
    expect(bookLink).toHaveAttribute('href', '/book/42');
  });
});