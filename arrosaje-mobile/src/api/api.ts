import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://10.0.2.2:8000'; // Utiliser cette URL pour l'émulateur Android
// const API_URL = 'http://localhost:8000'; // Pour iOS simulator
// const API_URL = 'http://votre-ip-ou-domaine:8000'; // Pour un appareil physique ou production

const api = axios.create({
baseURL: API_URL,
headers: {
'Content-Type': 'application/json',
},
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
