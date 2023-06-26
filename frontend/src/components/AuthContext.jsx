import React, { createContext, useState, useEffect } from "react";
import { fetchUserProfile } from '../api/api'; 
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsLoggedIn(true);
      const fetchData = async () => {
        try {
          const data = await fetchUserProfile(token);
          setUserProfile(data);
        } catch (error) {
          console.error('Erreur lors de la récupération du profil', error);
        }
      };

      fetchData();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('jwtToken', token);
    setIsLoggedIn(true);
    navigate('/profile'); // Redirection vers la page /profile après la connexion réussie
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userProfile, setUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
