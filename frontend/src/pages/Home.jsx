import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <span className="badge" style={{ marginBottom: '1.5rem' }}>Empowering Mobility</span>
          <h1>Accessible Transport, Simplified</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.125rem' }}>
            OnRide Rentals is a digital lifeline for seniors and people with disabilities. We connect you with owners of specialized, accessible vehicles to ensure your journey is safe and stress-free.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/vehicles" className="btn btn-primary">Find a Vehicle</Link>
            <Link to="/register" className="btn btn-outline">Join as Owner</Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 0', backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Why Choose OnRide?</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                <ShieldCheck size={32} />
              </div>
              <h3>Verified Accessibility</h3>
              <p>Every vehicle is detailed with transparent accessibility features so you know exactly what to expect.</p>
            </div>
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent)' }}>
                <Clock size={32} />
              </div>
              <h3>Reliable Scheduling</h3>
              <p>Say goodbye to the stress of standard rentals. Our platform is built for punctuality and ease of planning.</p>
            </div>
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--danger)' }}>
                <Heart size={32} />
              </div>
              <h3>Restored Independence</h3>
              <p>Regain your independence with transport that accommodates your physical needs and mobility devices.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
