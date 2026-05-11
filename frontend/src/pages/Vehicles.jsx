import { useState, useEffect } from 'react';
import api from '../api';
import VehicleCard from '../components/VehicleCard';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vehicles')
      .then(res => {
        setVehicles(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Available Vehicles</h2>
      {loading ? (
        <p>Loading vehicles...</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {vehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Vehicles;
