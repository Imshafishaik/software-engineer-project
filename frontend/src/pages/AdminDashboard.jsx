import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Users, Car, Calendar, Trash2, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchAllData();
  }, [user, navigate]);

  const fetchAllData = () => {
    Promise.all([
      api.get('/admin/users'),
      api.get('/admin/vehicles'),
      api.get('/admin/bookings')
    ])
      .then(([usersRes, vehiclesRes, bookingsRes]) => {
        setUsers(usersRes.data);
        setVehicles(vehiclesRes.data);
        setBookings(bookingsRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      api.delete(`/admin/users/${userId}`)
        .then(() => {
          setUsers(users.filter(u => u.id !== userId));
        })
        .catch(err => console.error(err));
    }
  };

  const handleDeleteVehicle = (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      api.delete(`/admin/vehicles/${vehicleId}`)
        .then(() => {
          setVehicles(vehicles.filter(v => v.id !== vehicleId));
        })
        .catch(err => console.error(err));
    }
  };

  const handleUpdateBookingStatus = (bookingId, status) => {
    api.put(`/admin/bookings/${bookingId}/status?status=${status}`)
      .then(res => {
        setBookings(bookings.map(b => b.id === bookingId ? res.data : b));
      })
      .catch(err => console.error(err));
  };

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Admin Dashboard</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === 'users' ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Users size={18} /> Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === 'vehicles' ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Car size={18} /> Vehicles ({vehicles.length})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === 'bookings' ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Calendar size={18} /> Bookings ({bookings.length})
            </button>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            {activeTab === 'users' && (
              <>
                <h3 style={{ marginBottom: '1.5rem' }}>All Users</h3>
                {users.length === 0 ? (
                  <p>No users found.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {users.map(userItem => (
                      <div key={userItem.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>{userItem.name}</p>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{userItem.email}</p>
                          <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', marginTop: '0.5rem', display: 'inline-block' }}>
                            {userItem.role.toUpperCase()}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteUser(userItem.id)}
                          style={{
                            padding: '0.5rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'vehicles' && (
              <>
                <h3 style={{ marginBottom: '1.5rem' }}>All Vehicles</h3>
                {vehicles.length === 0 ? (
                  <p>No vehicles found.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {vehicles.map(vehicle => (
                      <div key={vehicle.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>{vehicle.make} {vehicle.model}</p>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {vehicle.year} • ${vehicle.price_per_day}/day
                          </p>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Owner ID: {vehicle.owner_id}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                          style={{
                            padding: '0.5rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'bookings' && (
              <>
                <h3 style={{ marginBottom: '1.5rem' }}>All Bookings</h3>
                {bookings.length === 0 ? (
                  <p>No bookings found.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {bookings.map(booking => (
                      <div key={booking.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>Vehicle ID: {booking.vehicle_id}</p>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Rider ID: {booking.rider_id}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {booking.start_date} to {booking.end_date}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span className="badge" style={{ 
                            background: booking.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : 
                                     booking.status === 'completed' ? 'rgba(59, 130, 246, 0.1)' :
                                     booking.status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' :
                                     'rgba(245, 158, 11, 0.1)',
                            color: booking.status === 'confirmed' ? 'var(--accent)' : 
                                   booking.status === 'completed' ? '#3b82f6' :
                                   booking.status === 'cancelled' ? '#ef4444' :
                                   '#f59e0b'
                          }}>
                            {booking.status.toUpperCase()}
                          </span>
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                style={{
                                  padding: '0.5rem',
                                  background: 'rgba(16, 185, 129, 0.1)',
                                  color: 'var(--accent)',
                                  border: 'none',
                                  borderRadius: '0.375rem',
                                  cursor: 'pointer'
                                }}
                                title="Confirm"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                style={{
                                  padding: '0.5rem',
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  color: '#ef4444',
                                  border: 'none',
                                  borderRadius: '0.375rem',
                                  cursor: 'pointer'
                                }}
                                title="Cancel"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
