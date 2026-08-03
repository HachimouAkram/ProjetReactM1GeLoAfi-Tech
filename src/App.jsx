import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import UserList from './components/UserList';
import UserPortfolio from './components/UserPortfolio';
import ElementDetail from './components/ElementDetail';
import ElementForm from './components/ElementForm';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import './App.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red', background: 'white', textAlign: 'left' }}>
          <h2>Une erreur s'est produite :</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
      {/* Router gère la navigation basée sur l'URL sans recharger la page */}
      <Router>
        <div className="App">
          {/* Navbar est affiché sur toutes les pages, en dehors des routes */}
          <Navbar />
          <main>
            {/* Routes définit les correspondances entre les chemins d'URL et les composants à afficher */}
            <Routes>
              {/* Route principale affichant la liste complète des acteurs */}
              <Route path="/" element={<UserList />} />
              {/* Route dynamique pour le portfolio d'un acteur */}
              <Route path="/portfolio/:id" element={<UserPortfolio />} />
              {/* Route dynamique pour afficher les détails d'un élément spécifique (récupère l'id) */}
              <Route path="/element/:id" element={<ElementDetail />} />
              {/* Route pour le formulaire d'ajout d'un nouvel élément */}
              <Route path="/add" element={<ElementForm />} />
              {/* Route dynamique pour le formulaire de modification d'un élément existant */}
              <Route path="/edit/:id" element={<ElementForm />} />
              {/* Routes d'authentification */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Route de profil */}
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
