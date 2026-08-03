const API_BASE = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';
const API_URL = `${API_BASE}/elements`;
const USERS_URL = `${API_BASE}/users`;

export const api = {
  // === AUTHENTIFICATION ===
  
  login: async (username, password) => {
    // Nettoyage de l'identifiant
    const cleanUsername = username.trim();
    
    // On récupère l'utilisateur uniquement par son nom d'utilisateur
    const response = await fetch(`${USERS_URL}?username=${cleanUsername}`);
    if (!response.ok) throw new Error('Erreur réseau lors de la connexion');
    
    const users = await response.json();
    if (users.length > 0) {
      const user = users[0];
      // Vérification du mot de passe côté client pour éviter les bugs d'URL avec JSON-Server
      if (user.password === password) {
        return user;
      }
    }
    
    throw new Error('Identifiants incorrects');
  },

  register: async (username, password, nom, prenom, telephone, adresse, profil) => {
    // On vérifie d'abord si l'utilisateur existe
    const checkResponse = await fetch(`${USERS_URL}?username=${username}`);
    const existingUsers = await checkResponse.json();
    if (existingUsers.length > 0) {
      throw new Error("Ce nom d'utilisateur est déjà pris");
    }

    // Création de l'utilisateur
    const response = await fetch(USERS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, nom, prenom, telephone, adresse, profil }),
    });

    if (!response.ok) throw new Error("Erreur lors de l'inscription");
    return await response.json();
  },

  updateUser: async (id, userData) => {
    // Vérifier si un autre utilisateur utilise déjà ce nom d'utilisateur (s'il a été modifié)
    const checkResponse = await fetch(`${USERS_URL}?username=${userData.username}`);
    const existingUsers = await checkResponse.json();
    if (existingUsers.length > 0 && existingUsers[0].id !== id) {
      throw new Error("Ce nom d'utilisateur est déjà pris par un autre compte");
    }

    const response = await fetch(`${USERS_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error("Erreur lors de la mise à jour du profil");
    return await response.json();
  },

  getUserById: async (id) => {
    const response = await fetch(`${USERS_URL}/${id}`);
    if (!response.ok) throw new Error("Utilisateur non trouvé");
    return await response.json();
  },

  getAllUsers: async () => {
    const response = await fetch(USERS_URL);
    if (!response.ok) throw new Error("Erreur lors de la récupération des acteurs");
    return await response.json();
  },

  // === ELEMENTS ===
  // Récupérer tous les éléments
  getAllElements: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erreur réseau');
      
      const data = await response.json();
      // Mise en cache
      sessionStorage.setItem('elements', JSON.stringify(data));
      return data;
    } catch (err) {
      // Tentative de récupération depuis le cache en cas d'erreur
      const cached = sessionStorage.getItem('elements');
      if (cached) {
        console.warn("Utilisation des données en cache suite à une erreur réseau :", err.message);
        return JSON.parse(cached);
      }
      throw err;
    }
  },

  // Récupérer les éléments par utilisateur (pour le portfolio)
  getElementsByUserId: async (userId) => {
    try {
      // JSON-Server permet le filtrage par paramètre de requête
      const response = await fetch(`${API_URL}?userId=${userId}`);
      if (!response.ok) throw new Error('Erreur réseau');
      return await response.json();
    } catch (err) {
      throw err;
    }
  },

  // Récupérer un élément par son ID
  getElementById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Élément non trouvé');
      
      return await response.json();
    } catch (err) {
      // Tentative de récupération depuis le cache en cas d'erreur
      const cached = sessionStorage.getItem('elements');
      if (cached) {
        const elementsCache = JSON.parse(cached);
        const cachedElement = elementsCache.find(el => el.id === id);
        if (cachedElement) {
          return cachedElement;
        }
      }
      throw err;
    }
  },

  // Créer un nouvel élément
  createElement: async (elementData, userId) => {
    const dataWithUser = { ...elementData, userId };
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataWithUser),
    });

    if (!response.ok) throw new Error("Erreur lors de l'enregistrement");
    return await response.json();
  },

  // Mettre à jour un élément existant
  updateElement: async (id, elementData) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(elementData),
    });

    if (!response.ok) throw new Error("Erreur lors de l'enregistrement");
    return await response.json();
  },

  // Supprimer un élément
  deleteElement: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error("Erreur lors de la suppression");
    return true;
  }
};
