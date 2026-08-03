import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save } from 'lucide-react';
import { api } from '../services/api';

const ElementForm = () => {

  const { id } = useParams();// récupère l'id dans l'url

  const isEditMode = Boolean(id);// isEditMode est vrai si id est défini
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const navigate = useNavigate();

  // État local contenant les données du formulaire (initialisé par défaut pour la création)
  const [formData, setFormData] = useState({
    type: 'competence',
    label: '',
    image: '',
    description: '',
    level: '',
    link: ''
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false); // État pour bloquer le bouton de sauvegarde pendant l'enregistrement

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Condition : Si on est en mode modification, il faut charger les données existantes
    if (isEditMode) {
      const fetchElement = async () => {
        try {
          const data = await api.getElementById(id);
          setFormData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchElement();
    }
  }, [id, isEditMode, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fonction de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); 
    
    const submitData = { ...formData };
    
    // Condition : Nettoyage des données selon le type d'élément choisi
    if (submitData.type === 'competence') {
      delete submitData.link;
    } else {
      delete submitData.level;
    }

    try {
      let savedElement;
      
      if (isEditMode) {
        savedElement = await api.updateElement(id, submitData);
      } else {
        savedElement = await api.createElement(submitData, user.id);
      }

      // Redirection vers la page de détails du nouvel élément (ou de l'élément modifié)
      navigate(`/element/${savedElement.id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false); // On désactive l'état de sauvegarde pour permettre un nouvel essai
    }
  };

  if (!user) return null;
  if (loading) return <div className="text-center loading">Chargement...</div>;

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <Link to={isEditMode ? `/element/${id}` : '/'} className="btn btn-secondary back-btn" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={18} />
        Annuler
      </Link>

      <div className="glass-panel" style={{ padding: '3rem' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>
          {isEditMode ? 'Modifier l\'élément' : 'Ajouter un nouvel élément'}
        </h2>

        {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Type d'élément</label>
            <select 
              name="type" 
              className="form-input" 
              value={formData.type} 
              onChange={handleChange}
              disabled={isEditMode}
            >
              <option value="competence">Compétence</option>
              <option value="projet">Projet</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Libellé</label>
            <input 
              type="text" 
              name="label" 
              className="form-input" 
              value={formData.label} 
              onChange={handleChange}
              required 
              placeholder="Ex: React JS"
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL de l'image</label>
            <input 
              type="url" 
              name="image" 
              className="form-input" 
              value={formData.image} 
              onChange={handleChange}
              required 
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description" 
              className="form-input" 
              value={formData.description} 
              onChange={handleChange}
              required 
              placeholder="Décrivez cet élément..."
            ></textarea>
          </div>

          {/* Condition : Ce champ ne s'affiche que si le type sélectionné est "compétence" */}
          {formData.type === 'competence' && (
            <div className="form-group">
              <label className="form-label">Niveau</label>
              <input 
                type="text" 
                name="level" 
                className="form-input" 
                value={formData.level || ''} 
                onChange={handleChange}
                placeholder="Ex: Avancé, Intermédiaire..."
              />
            </div>
          )}

          {/* Condition : Ce champ ne s'affiche que si le type sélectionné est "projet" */}
          {formData.type === 'projet' && (
            <div className="form-group">
              <label className="form-label">Lien du projet</label>
              <input 
                type="url" 
                name="link" 
                className="form-input" 
                value={formData.link || ''} 
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
            </div>
          )}

          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={18} />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ElementForm;
