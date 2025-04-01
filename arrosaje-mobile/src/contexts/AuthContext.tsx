import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, LoginCredentials, RegisterData, AuthState } from '../types/auth';
import { login as apiLogin, register as apiRegister, getCurrentUser, logout as apiLogout } from '../api/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUserInfo: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUserInfo: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    error: null,
  });

  // Vérifier s'il y a un token enregistré au démarrage
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        
        if (token) {
          // Si un token existe, récupérer les infos de l'utilisateur
          const user = await getCurrentUser();
          setState({
            user,
            token,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            user: null,
            token: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        setState({
          user: null,
          token: null,
          isLoading: false,
          error: 'Failed to restore authentication state',
        });
      }
    };

    loadToken();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      const authData = await apiLogin(credentials);
      const token = authData.access_token;
      
      // Récupérer les détails de l'utilisateur
      const user = await getCurrentUser();
      
      setState({
        user,
        token,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      setState({
        ...state,
        isLoading: false,
        error: error.response?.data?.detail || 'An error occurred during login',
      });
    }
  };

  const register = async (data: RegisterData) => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      await apiRegister(data);
      
      // Connecter automatiquement après l'inscription
      await login({ username: data.email, password: data.password });
    } catch (error: any) {
      console.error('Register error:', error);
      setState({
        ...state,
        isLoading: false,
        error: error.response?.data?.detail || 'An error occurred during registration',
      });
    }
  };

  const logout = async () => {
    setState({ ...state, isLoading: true });
    
    try {
      await apiLogout();
      setState({
        user: null,
        token: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      setState({
        ...state,
        isLoading: false,
        error: 'An error occurred during logout',
      });
    }
  };

  const updateUserInfo = (user: User) => {
    setState({ ...state, user });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;