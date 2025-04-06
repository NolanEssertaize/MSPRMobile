// src/api/api.ts - Client API amélioré

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Utiliser l'URL correcte pour votre environnement de développement
const API_URL = 'http://10.0.2.2:8000';  // Pour l'émulateur Android
// const API_URL = 'http://localhost:8000';  // Pour iOS simulator
// const API_URL = 'http://votre-ip:8000';  // Pour un appareil physique

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error getting token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si l'erreur est une erreur 401 (non autorisé) et que nous n'avons pas déjà tenté de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Ici, vous pourriez implémenter la logique de rafraîchissement de token
      // Pour l'instant, nous allons simplement rejeter l'erreur
      
      // Si vous implémentez un système de refresh token plus tard:
      // 1. Obtenir un nouveau token
      // 2. Mettre à jour le token dans SecureStore
      // 3. Mettre à jour l'en-tête d'autorisation de la requête originale
      // 4. Renvoyer la requête originale
    }
    
    return Promise.reject(error);
  }
);

export default api;