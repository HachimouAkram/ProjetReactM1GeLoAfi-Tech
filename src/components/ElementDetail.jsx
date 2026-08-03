import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './ElementDetail.css';
const ElementDetail = () => {
  const { id } = useParams();//useParams est un hook de react-router-dom qui permet de récupérer les paramètres de l'URL
  const [element, setElement] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchElement = async () => {
      try {
        const data = await api.getElementById(id);
        setElement(data);
        if (data.userId) {
          try {
            const authorData = await api.getUserById(data.userId);
            setAuthor(authorData);
          } catch (e) {
            console.error("Impossible de charger l'auteur", e);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchElement();
  }, [id]);
  if (loading) return <div className="text-center loading">Chargement...</div>;
  if (error) return <div className="text-center error">Erreur : {error}</div>;
  if (!element) return <div className="text-center">Aucun élément trouvé.</div>;
  return (
    <div className="container detail-container">
      <Link to="/" className="btn btn-secondary back-btn">
        <ArrowLeft size={18} />
        Retour au portfolio
      </Link>
      <div className="detail-card glass-panel">
        <div className="detail-image-container">
          <img src={element.image} alt={element.label} className="detail-image" />
          <span className={`element-badge badge-${element.type}`}>
            {element.type === 'competence' ? 'Compétence' : 'Projet'}
          </span>
        </div>
        <div className="detail-content">
          <div className="detail-header">
            <h1 className="detail-title">{element.label}</h1>
            
            {user && user.id === element.userId && (
              <button 
                onClick={() => navigate(`/edit/${element.id}`)} 
                className="btn btn-primary"
              >
                <Edit2 size={16} />
                Modifier
              </button>
            )}
          </div>
          <div className="detail-description">
            <h3>Description</h3>
            <p>{element.description}</p>
          </div>
          {author && (
            <div className="detail-author" style={{ marginTop: '1.5rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Publié par</h3>
              <p style={{ margin: '0.25rem 0' }}><strong>{author.prenom} {author.nom}</strong> <em>({author.username})</em></p>
              {author.telephone && <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>📞 {author.telephone}</p>}
              {author.adresse && <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>📍 {author.adresse}</p>}
            </div>
          )}
          <div className="detail-attributes">
            {/* Condition : On n'affiche le champ "Niveau" que s'il s'agit d'une compétence ET si la donnée existe */}
            {element.type === 'competence' && element.level && (
              <div className="attribute">
                <span className="attribute-label">Niveau :</span>
                <span className="attribute-value">{element.level}</span>
              </div>
            )}
            {/* Condition : On n'affiche le lien externe que s'il s'agit d'un projet ET si le lien existe */}
            {element.type === 'projet' && element.link && (
              <div className="attribute">
                <span className="attribute-label">Lien du projet :</span>
                <a href={element.link} target="_blank" rel="noreferrer" className="attribute-link">
                  Visiter le projet <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ElementDetail;
