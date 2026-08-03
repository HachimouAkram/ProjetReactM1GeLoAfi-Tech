import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // L'état 'user' stocke les informations de l'utilisateur connecté (id, username)
  // S'il n'y a pas d'utilisateur, c'est null.
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('user');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  const login = async (username, password) => {
    const userData = await api.login(username, password);
    setUser(userData);
  };

  const register = async (username, password, nom, prenom, telephone, adresse, profil) => {
    const userData = await api.register(username, password, nom, prenom, telephone, adresse, profil);
    setUser(userData);
  };

  const updateProfile = async (userData) => {
    const updatedUser = await api.updateUser(user.id, userData);
    setUser(updatedUser);
    return updatedUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);