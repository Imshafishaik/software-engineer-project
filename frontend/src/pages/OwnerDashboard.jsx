import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { PlusCircle, Car, Pencil, Trash2, X, CheckCircle, Calendar, DollarSign } from 'lucide-react';

const emptyForm = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  price_per_day: '',
  accessibility_features: '',
  image_url: '',
  description: '',
};

const OwnerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'owner') { navigate('/dashboard'); return; }
    fetchMyVehicles();
  }, [user, navigate]);

  const fetchMyVehicles = () => {
    setLoading(true);
    api.get('/api/vehicles/')
      .then(res => {
        const mine = res.data.filter(v => v.owner_id === user.id);
        setVehicles(mine);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setForm(emptyForm);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setForm({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price_per_day: vehicle.price_per_day,
      accessibility_features: vehicle.accessibility_features || '',
      image_url: vehicle.image_url || '',
      description: vehicle.description || '',
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVehicle(null);
    setForm(emptyForm);
    setError('');
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editingVehicle) {
        const res = await api.put(`/api/vehicles/${editingVehicle.id}`, {
          make: form.make,
          model: form.model,
          year: parseInt(form.year),
          price_per_day: parseFloat(form.price_per_day),
          accessibility_features: form.accessibility_features,
          image_url: form.image_url,
          description: form.description,
        });
        setVehicles(vehicles.map(v => v.id === editingVehicle.id ? res.data : v));
        setSuccess('Vehicle updated successfully!');
      } else {
        const res = await api.post('/api/vehicles/', {
          owner_id: user.id,
          make: form.make,
          model: form.model,
          year: parseInt(form.year),
          price_per_day: parseFloat(form.price_per_day),
          accessibility_features: form.accessibility_features,
          image_url: form.image_url,
          description: form.description,
        });
        setVehicles([...vehicles, res.data]);
        setSuccess('Vehicle listed successfully!');
      }
      setTimeout(() => closeModal(), 1200);
    } catch (err) {
      setError(err.response?.data?.detail || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to remove this vehicle listing?')) return;
    try {
      await api.delete(`/api/vehicles/${vehicleId}`);
      setVehicles(vehicles.filter(v => v.id !== vehicleId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '0.5rem',
    color: 'white',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.4rem',
    fontWeight: 500,
    fontSize: '0.9rem',
    color: '#94a3b8',
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>My Vehicle Listings</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage your accessible vehicles available for rental.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle size={18} /> List a Vehicle
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '2.5rem' }}>
        {[
          { label: 'Total Listings', value: vehicles.length, icon: <Car size={22} />, color: '#6366f1' },
          { label: 'Avg. Price / Day', value: vehicles.length ? `$${(vehicles.reduce((a, v) => a + v.price_per_day, 0) / vehicles.length).toFixed(0)}` : '—', icon: <DollarSign size={22} />, color: '#10b981' },
          { label: 'Active Since', value: '2026', icon: <Calendar size={22} />, color: '#a855f7' },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ background: `rgba(${stat.color === '#6366f1' ? '99,102,241' : stat.color === '#10b981' ? '16,185,129' : '168,85,247'},0.12)`, borderRadius: '0.75rem', padding: '0.75rem', color: stat.color, display: 'flex' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
              <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle List */}
      {loading ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ margin: 0 }}>Loading your vehicles...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
          <Car size={56} style={{ color: 'var(--text-muted)', margin: '0 auto 1.25rem', display: 'block', opacity: 0.4 }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No vehicles listed yet</h3>
          <p style={{ marginBottom: '2rem' }}>Start by listing your first accessible vehicle to connect with riders.</p>
          <button className="btn btn-primary" onClick={openAddModal} style={{ margin: '0 auto' }}>
            <PlusCircle size={18} style={{ marginRight: '0.5rem' }} /> List Your First Vehicle
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {vehicles.map(vehicle => (
            <div key={vehicle.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'row' }}>
              {/* Vehicle image */}
              <div style={{ width: '220px', minWidth: '220px', overflow: 'hidden', position: 'relative' }}>
                {vehicle.image_url ? (
                  <img
                    src={vehicle.image_url}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.07)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', minHeight: '160px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Car size={40} style={{ opacity: 0.3 }} />
                  </div>
                )}
              </div>

              {/* Vehicle details */}
              <div style={{ flex: 1, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>{vehicle.make} {vehicle.model}</h3>
                    <span className="badge">{vehicle.year}</span>
                  </div>
                  <p style={{ margin: '0 0 0.75rem', color: 'var(--accent)', fontWeight: 700, fontSize: '1.1rem' }}>
                    ${vehicle.price_per_day} / day
                  </p>
                  {vehicle.accessibility_features && (
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      ♿ {vehicle.accessibility_features}
                    </p>
                  )}
                  {vehicle.description && (
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {vehicle.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'flex-end' }}>
                  <button
                    onClick={() => openEditModal(vehicle)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
                  >
                    <Pencil size={15} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
                  >
                    <Trash2 size={15} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '1.25rem', border: '1px solid var(--border)', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>

            {/* Modal header */}
            <div className="flex justify-between items-center" style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ margin: 0 }}>{editingVehicle ? 'Edit Vehicle' : 'List a New Vehicle'}</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '0.25rem' }}>
                <X size={22} />
              </button>
            </div>

            {/* Alerts */}
            {error && (
              <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '0.5rem', color: 'var(--accent)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} /> {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Make *</label>
                  <input name="make" value={form.make} onChange={handleFormChange} required placeholder="e.g. Toyota" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Model *</label>
                  <input name="model" value={form.model} onChange={handleFormChange} required placeholder="e.g. Sienna" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Year *</label>
                  <input name="year" type="number" value={form.year} onChange={handleFormChange} required min="2000" max="2030" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Price per Day (USD) *</label>
                  <input name="price_per_day" type="number" value={form.price_per_day} onChange={handleFormChange} required min="1" step="0.01" placeholder="e.g. 95" style={inputStyle} />
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label style={labelStyle}>Accessibility Features *</label>
                <input name="accessibility_features" value={form.accessibility_features} onChange={handleFormChange} required placeholder="e.g. Wheelchair ramp, power sliding doors, tie-downs" style={inputStyle} />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label style={labelStyle}>Image URL</label>
                <input name="image_url" value={form.image_url} onChange={handleFormChange} placeholder="https://..." style={inputStyle} />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label style={labelStyle}>Description</label>
                <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Describe the vehicle, its features, and any conditions..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <div style={{ marginTop: '1.75rem', display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={closeModal} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? 'Saving...' : editingVehicle ? 'Save Changes' : 'List Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
