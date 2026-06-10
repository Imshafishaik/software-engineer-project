import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const BookVehicle = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Since we don't have a single vehicle endpoint, we get all and filter
    api.get('/api/vehicles')
      .then(res => {
        const found = res.data.find(v => v.id === parseInt(id));
        setVehicle(found);
      })
      .catch(err => console.error(err));
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/bookings', {
        vehicle_id: parseInt(id),
        start_date: startDate,
        end_date: endDate
      });
      setSuccess('Booking successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Booking failed');
    }
  };

  if (!vehicle) return <div className="container" style={{ padding: '3rem 1.5rem' }}>Loading...</div>;

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Book {vehicle.make} {vehicle.model}</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--accent)', fontWeight: 'bold' }}>
          ${vehicle.price_per_day} / day
        </p>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>{error}</div>}
        {success && <div style={{ color: 'var(--accent)', marginBottom: '1rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input 
              type="date" 
              className="form-input" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input 
              type="date" 
              className="form-input" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Confirm Booking</button>
        </form>
      </div>
    </div>
  );
};

export default BookVehicle;
