import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ElementCard from './ElementCard';
import { Mail, Phone, MapPin, Briefcase, Plus } from 'lucide-react';
import './UserPortfolio.css';

const UserPortfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const currentUser = auth ? auth.user : null;
  const [portfolioUser, setPortfolioUser] = useState(null);
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        // On lance les deux requêtes en parallèle pour aller plus vite
        const [userData, userElements] = await Promise.all([
          api.getUserById(id),
          api.getElementsByUserId(id)
        ]);
        
        setPortfolioUser(userData);
        setElements(userElements);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolioData();
  }, [id]);

  const handleDelete = async (elementId) => {
    try {
      await api.deleteElement(elementId);
      // Mise à jour de l'état local pour retirer l'élément supprimé sans recharger la page
      setElements(prev => prev.filter(el => el.id !== elementId));
    } catch (err) {
      alert("Erreur lors de la suppression : " + err.message);
    }
  };

  if (loading) return <div className="text-center loading" style={{ marginTop: '3rem' }}>Chargement du portfolio...</div>;
  if (error) return <div className="text-center error" style={{ marginTop: '3rem' }}>Erreur : {error}</div>;
  if (!portfolioUser) return <div className="text-center" style={{ marginTop: '3rem' }}>Utilisateur non trouvé.</div>;
  const projets = elements.filter(el => el.type === 'projet');
  const competences = elements.filter(el => el.type === 'competence');
  const isOwner = currentUser && currentUser.id === id;
  return (
    <div className="portfolio-container container">
      <div className="portfolio-header glass-panel">
        <div className="portfolio-avatar">
          {portfolioUser.prenom ? portfolioUser.prenom.charAt(0).toUpperCase() : <Briefcase size={40} />}
          {portfolioUser.nom ? portfolioUser.nom.charAt(0).toUpperCase() : ''}
        </div>
        <div className="portfolio-info">
          <h1>{portfolioUser.prenom} {portfolioUser.nom}</h1>
          {portfolioUser.profil && (
            <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.2rem', margin: '0.5rem 0' }}>
              {portfolioUser.profil}
            </p>
          )}
          <p className="portfolio-username">@{portfolioUser.username.split('@')[0]}</p>
          <div className="portfolio-contact">
            <div className="contact-item">
              <Mail size={16} />
              <span>{portfolioUser.username}</span>
            </div>
            {portfolioUser.telephone && (
              <div className="contact-item">
                <Phone size={16} />
                <span>{portfolioUser.telephone}</span>
              </div>
            )}
            {portfolioUser.adresse && (
              <div className="contact-item">
                <MapPin size={16} />
                <span>{portfolioUser.adresse}</span>
              </div>
            )}
          </div>
        </div>
        {/* Si c'est le profil de l'utilisateur connecté, on lui permet d'ajouter un élément d'ici */}
        {isOwner && (
          <div className="portfolio-actions">
            <button onClick={() => navigate('/add')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} />
              Ajouter au portfolio
            </button>
          </div>
        )}
      </div>

      <div className="portfolio-section">
        <h2 className="section-title">Projets Réalisés</h2>
        {projets.length > 0 ? (
          <div className="elements-grid">
            {projets.map(projet => (
              <ElementCard 
                key={projet.id} 
                element={projet} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">Aucun projet publié pour le moment.</div>
        )}
      </div>

      <div className="portfolio-section" style={{ marginTop: '3rem' }}>
        <h2 className="section-title">Compétences</h2>
        {competences.length > 0 ? (
          <div className="elements-grid">
            {competences.map(competence => (
              <ElementCard 
                key={competence.id} 
                element={competence} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">Aucune compétence publiée pour le moment.</div>
        )}
      </div>
    </div>
  );
};

export default UserPortfolio;
