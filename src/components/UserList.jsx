import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Briefcase, ChevronRight, Search } from 'lucide-react';
import './UserList.css';

const UserList = () => {
  const auth = useAuth();
  const currentUser = auth ? auth.user : null;

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getAllUsers();
        // Si un utilisateur est connecté, on le retire de la liste
        const filteredData = currentUser 
          ? data.filter(u => u.id !== currentUser.id) 
          : data;
        setUsers(filteredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="text-center loading" style={{ marginTop: '3rem' }}>Chargement des acteurs...</div>;
  if (error) return <div className="text-center error" style={{ marginTop: '3rem' }}>Erreur : {error}</div>;

  return (
    <div className="container">
      <div className="header-section" style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <Users size={36} className="text-primary" />
          Les Acteurs de la Plateforme
        </h1>
        <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Découvrez les profils de nos professionnels, explorez leurs compétences et consultez leurs projets.
        </p>
      </div>

      <div className="search-section" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', maxWidth: '500px', width: '100%' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-color)', opacity: 0.5 }} />
          <input
            type="text"
            className="form-input"
            placeholder="Rechercher par nom, prénom ou profil professionnel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '30px', border: '1px solid var(--border-color)', background: 'var(--card-bg)' }}
          />
        </div>
      </div>

      <div className="users-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
        {users.filter(user => {
          const query = searchQuery.toLowerCase();
          const fullName = `${user.prenom} ${user.nom}`.toLowerCase();
          const profil = (user.profil || '').toLowerCase();
          return fullName.includes(query) || profil.includes(query);
        }).map(user => (
          <div key={user.id} className="user-card glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
            <div className="user-avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {user.prenom ? user.prenom.charAt(0).toUpperCase() : <Briefcase />}
              {user.nom ? user.nom.charAt(0).toUpperCase() : ''}
            </div>
            
            <h3 style={{ marginBottom: '0.25rem', fontSize: '1.25rem' }}>
              {user.prenom} {user.nom}
            </h3>
            
            <p style={{ color: 'var(--text-color)', opacity: 0.8, marginBottom: '1.5rem', fontSize: '0.95rem', fontStyle: user.profil ? 'normal' : 'italic' }}>
              {user.profil ? user.profil : 'Profil non renseigné'}
            </p>
            
            <Link to={`/portfolio/${user.id}`} className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              Voir le portfolio
              <ChevronRight size={18} />
            </Link>
          </div>
        ))}
        {users.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'var(--card-bg)', borderRadius: '12px' }}>
            Aucun acteur n'est inscrit sur la plateforme pour le moment.
          </div>
        )}
        {users.length > 0 && users.filter(user => {
          const query = searchQuery.toLowerCase();
          const fullName = `${user.prenom} ${user.nom}`.toLowerCase();
          const profil = (user.profil || '').toLowerCase();
          return fullName.includes(query) || profil.includes(query);
        }).length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'var(--card-bg)', borderRadius: '12px' }}>
            Aucun acteur ne correspond à votre recherche "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
