import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, ShieldOff, Plus } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const auth = useAuth();
  const currentUser = auth ? auth.user : null;
  const logout = auth ? auth.logout : () => {};

  return (
    <nav className="navbar glass-panel">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-accent">Réseau</span>Pro
        </Link>
        
        <div className="navbar-actions">
          {currentUser ? (
            <>
              <Link to={`/portfolio/${currentUser.id}`} style={{ color: 'var(--text-color)', marginRight: '1.5rem', textDecoration: 'none', fontWeight: 'bold' }}>
                Mon Portfolio
              </Link>
              <Link to="/profile" style={{ color: 'var(--text-color)', marginRight: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="brand-accent" style={{ fontWeight: 'bold' }}>Profil:</span> <strong>{currentUser.username}</strong>
              </Link>
              <Link to="/add" className="btn btn-primary">
                <Plus size={18} />
                Ajouter
              </Link>
              <button onClick={logout} className="btn btn-danger">
                <ShieldOff size={18} />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                <Shield size={18} />
                Connexion
              </Link>
              <Link to="/register" className="btn btn-primary">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
