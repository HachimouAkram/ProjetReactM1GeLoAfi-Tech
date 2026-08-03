import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Save, User } from 'lucide-react';

const Profile = () => {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const updateProfile = auth ? auth.updateProfile : async () => {};
  const navigate = useNavigate();

  // États du formulaire initialisés avec les données actuelles
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
    adresse: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Rediriger et pré-remplir les données
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    setFormData({
      username: user.username || '',
      password: user.password || '',
      nom: user.nom || '',
      prenom: user.prenom || '',
      profil: user.profil || '',
      telephone: user.telephone || '',
      adresse: user.adresse || ''
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateProfile(formData);
      setSuccess("Profil mis à jour avec succès !");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '3rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={24} className="text-primary" />
          Mon Profil
        </h2>

        {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ padding: '1rem', background: 'rgba(46, 213, 115, 0.1)', color: '#2ed573', border: '1px solid #2ed573', borderRadius: '4px', marginBottom: '1rem' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom</label>
            <input 
              type="text" 
              name="nom"
              className="form-input" 
              value={formData.nom} 
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Prénom</label>
            <input 
              type="text" 
              name="prenom"
              className="form-input" 
              value={formData.prenom} 
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nom d'utilisateur (Identifiant)</label>
            <input 
              type="text" 
              name="username"
              className="form-input" 
              value={formData.username} 
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input 
              type="text" 
              name="password"
              className="form-input" 
              value={formData.password} 
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Profil professionnel (ex: Développeur Web)</label>
            <input 
              type="text" 
              name="profil"
              className="form-input" 
              value={formData.profil} 
              onChange={handleChange}
              placeholder="Que faites-vous ?"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Numéro de téléphone</label>
            <input 
              type="tel" 
              name="telephone"
              className="form-input" 
              value={formData.telephone} 
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Adresse</label>
            <input 
              type="text" 
              name="adresse"
              className="form-input" 
              value={formData.adresse} 
              onChange={handleChange}
            />
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              <Save size={18} />
              {loading ? 'Mise à jour...' : 'Sauvegarder les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
