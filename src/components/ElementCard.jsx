import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Edit2, Trash2 } from 'lucide-react';
import './ElementCard.css';

const ElementCard = ({ element, onDelete }) => {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const navigate = useNavigate();
  const handleDelete = (e) => {
    e.stopPropagation(); // Empêche l'événement de clic de se propager vers le conteneur parent
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${element.label} ?`)) {
      onDelete(element.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit/${element.id}`);
  };

  const handleCardClick = () => {
    navigate(`/element/${element.id}`);
  };

  return (
    <div className="element-card glass-panel" onClick={handleCardClick}>
      <div className="element-image-container">
        <img src={element.image} alt={element.label} className="element-image" />
        <span className={`element-badge badge-${element.type}`}>
          {element.type === 'competence' ? 'Compétence' : 'Projet'}
        </span>
      </div>
      <div className="element-content">
        <h3 className="element-title">{element.label}</h3>
        {user && user.id === element.userId && (
          <div className="element-actions">
            <button onClick={handleEdit} className="btn-icon btn-edit" title="Modifier">
              <Edit2 size={16} />
            </button>
            <button onClick={handleDelete} className="btn-icon btn-delete" title="Supprimer">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ElementCard;
