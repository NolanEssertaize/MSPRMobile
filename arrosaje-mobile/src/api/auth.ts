import api from './api.ts';
import { LoginCredentials, RegisterData, User } from '../types/auth';
import * as SecureStore from 'expo-secure-store';

// Fonction de connexion
export const login = async (credentials: LoginCredentials) => {
  const formData = new FormData();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  try {
    const response = await api.post('/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Stocker le token dans le secure storage
    await SecureStore.setItemAsync('token', response.data.access_token);

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Fonction d'inscription
export const register = async (userData: RegisterData) => {
  try {
    const response = await api.post('/users/', userData);
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

// Obtenir les infos de l'utilisateur actuel
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get('/users/me/');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

// Mise à jour du profil utilisateur
export const updateUser = async (userId: number, userData: Partial<User>) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

// Déconnexion (supprime le token)
export const logout = async () => {
  try {
    await SecureStore.deleteItemAsync('token');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};