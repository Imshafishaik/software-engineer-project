import { Calendar, DollarSign, Accessibility, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  return (
    <div className="card flex-col">
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <img 
          src={vehicle.image_url} 
          alt={`${vehicle.make} ${vehicle.model}`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>{vehicle.make} {vehicle.model} ({vehicle.year})</h3>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 'bold' }}>
          <DollarSign size={18} /> {vehicle.price_per_day} / day
        </p>
        
        <div style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <Accessibility size={16} /> Accessibility Features
          </h4>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>{vehicle.accessibility_features}</p>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
          <Link to={`/book/${vehicle.id}`} className="btn btn-primary" style={{ flex: 1 }}>
            Book Now
          </Link>
          <button className="btn btn-outline" style={{ padding: '0.75rem' }} title="View Details">
            <Info size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;