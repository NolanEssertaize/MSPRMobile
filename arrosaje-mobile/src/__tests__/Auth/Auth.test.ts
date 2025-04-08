
// src/__tests__/api/auth.test.ts
import * as SecureStore from 'expo-secure-store';
import { login, register, getCurrentUser, updateUser, logout } from '../../api/auth';
import api from '../../api/api';

// Mock des dépendances
jest.mock('expo-secure-store');
jest.mock('../../api/api');

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should make post request with correct params and store token', async () => {
      const mockCredentials = { username: 'test@example.com', password: 'password123' };
      const mockResponse = { data: { access_token: 'test-token' } };

      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      await login(mockCredentials);

      // Vérifier que la requête POST est envoyée avec les bons paramètres
      expect(api.post).toHaveBeenCalledWith(
        '/token',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      );

      // Vérifier que le token est stocké dans SecureStore
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('token', 'test-token');
    });

    it('should throw error when API call fails', async () => {
      const mockError = new Error('API Error');
      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(login({ username: 'test@example.com', password: 'password123' }))
        .rejects.toThrow('API Error');
    });
  });

  describe('register', () => {
    it('should make post request with correct user data', async () => {
      const mockUserData = {
        email: 'test@example.com',
        username: 'testuser',
        phone: '0612345678',
        password: 'password123',
        is_botanist: false
      };
      const mockResponse = { data: { id: 1, ...mockUserData } };

      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await register(mockUserData);

      expect(api.post).toHaveBeenCalledWith('/users/', mockUserData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getCurrentUser', () => {
    it('should make get request to correct endpoint', async () => {
      const mockUserData = { id: 1, username: 'testuser', email: 'test@example.com' };
      const mockResponse = { data: mockUserData };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getCurrentUser();

      expect(api.get).toHaveBeenCalledWith('/users/me/');
      expect(result).toEqual(mockUserData);
    });
  });

  describe('updateUser', () => {
    it('should make put request with correct user data', async () => {
      const userId = 1;
      const mockUpdateData = { username: 'updateduser' };
      const mockResponse = { data: { id: userId, ...mockUpdateData } };

      (api.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await updateUser(userId, mockUpdateData);

      expect(api.put).toHaveBeenCalledWith(`/users/${userId}`, mockUpdateData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('logout', () => {
    it('should delete token from SecureStore', async () => {
      await logout();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('token');
    });
  });
});
