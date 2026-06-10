import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Vehicles from './pages/Vehicles';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookVehicle from './pages/BookVehicle';
import AdminDashboard from './pages/AdminDashboard';
import api from './api';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/users/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, []);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar user={user} setUser={setUser} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/admin" element={<AdminDashboard user={user} />} />
            <Route path="/book/:id" element={<BookVehicle user={user} />} />
          </Routes>
        </main>
        <footer style={{ padding: '2rem 0', textAlign: 'center', borderTop: '1px solid var(--border)', marginTop: 'auto', color: 'var(--text-muted)' }}>
          <p>&copy; 2026 OnRide Rentals. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
