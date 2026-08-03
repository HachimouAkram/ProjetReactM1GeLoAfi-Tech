import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [profil, setProfil] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const register = auth ? auth.register : async () => {};
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas');
    }

    setLoading(true);

    try {
      await register(username, password, nom, prenom, telephone, adresse, profil);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Inscription</h2>
        
        {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom</label>
            <input 
              type="text" 
              className="form-input" 
              value={nom} 
              onChange={(e) => setNom(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Prénom</label>
            <input 
              type="text" 
              className="form-input" 
              value={prenom} 
              onChange={(e) => setPrenom(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nom d'utilisateur (Email / Identifiant)</label>
            <input 
              type="text" 
              className="form-input" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe</label>
            <input 
              type="password" 
              className="form-input" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Numéro de téléphone</label>
            <input 
              type="tel" 
              className="form-input" 
              value={telephone} 
              onChange={(e) => setTelephone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Adresse</label>
            <input 
              type="text" 
              className="form-input" 
              value={adresse} 
              onChange={(e) => setAdresse(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            <span>{loading ? 'Inscription en cours...' : 'S\'inscrire'}</span>
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <span>Déjà un compte ? </span><Link to="/login" style={{ color: 'var(--primary-light)' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
