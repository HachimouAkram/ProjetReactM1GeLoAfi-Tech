import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const login = auth ? auth.login : async () => {};
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
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
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Connexion</h2>
        
        {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom d'utilisateur</label>
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
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <span>Pas encore de compte ? </span><Link to="/register" style={{ color: 'var(--primary-light)' }}>S'inscrire</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
