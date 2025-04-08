
// src/__tests__/api/plants.test.ts
import {
  createPlant,
  getUserPlants,
  getAllOtherPlants,
  updatePlant,
  deletePlant,
  startPlantCare,
  endPlantCare
} from '../../api/plants';
import api from '../../api/api';
import { Platform } from 'react-native';

// Mock des dépendances
jest.mock('../../api/api');
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios'
  }
}));

describe('Plants API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPlant', () => {
    it('should make post request with correct params and form data', async () => {
      const mockPlantData = {
        name: 'Test Plant',
        location: 'Living Room',
        care_instructions: 'Water daily',
        photo: {
          uri: 'file://test/photo.jpg',
          type: 'image/jpeg',
          name: 'photo.jpg'
        }
      };

      const mockResponse = { data: { id: 1, ...mockPlantData } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await createPlant(mockPlantData);

      // Vérifier que la requête POST est envoyée avec les bons paramètres
      expect(api.post).toHaveBeenCalledWith(
        expect.stringContaining('/plants/'),
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      );

      // Vérifier que l'URL contient les paramètres de requête
      const callArgs = (api.post as jest.Mock).mock.calls[0];
      expect(callArgs[0]).toContain(`name=${encodeURIComponent(mockPlantData.name)}`);
      expect(callArgs[0]).toContain(`location=${encodeURIComponent(mockPlantData.location)}`);
      expect(callArgs[0]).toContain(`care_instructions=${encodeURIComponent(mockPlantData.care_instructions)}`);

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle case with no photo', async () => {
      const mockPlantData = {
        name: 'Test Plant',
        location: 'Living Room',
        care_instructions: 'Water daily'
      };

      const mockResponse = { data: { id: 1, ...mockPlantData } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      await createPlant(mockPlantData);

      // Vérifier que FormData n'a pas ajouté de photo
      expect(api.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(FormData),
        expect.any(Object)
      );
    });
  });

  describe('getUserPlants', () => {
    it('should make get request to correct endpoint', async () => {
      const mockPlants = [{ id: 1, name: 'Plant 1' }, { id: 2, name: 'Plant 2' }];
      const mockResponse = { data: mockPlants };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getUserPlants();

      expect(api.get).toHaveBeenCalledWith('/my_plants/');
      expect(result).toEqual(mockPlants);
    });
  });

  describe('getAllOtherPlants', () => {
    it('should make get request to correct endpoint', async () => {
      const mockPlants = [{ id: 3, name: 'Plant 3' }, { id: 4, name: 'Plant 4' }];
      const mockResponse = { data: mockPlants };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getAllOtherPlants();

      expect(api.get).toHaveBeenCalledWith('/all_plants/');
      expect(result).toEqual(mockPlants);
    });
  });

  describe('updatePlant', () => {
    it('should make put request with correct plant data and form data', async () => {
      const plantId = 1;
      const mockUpdateData = {
        name: 'Updated Plant',
        location: 'Kitchen',
        care_instructions: 'Water weekly',
        photo: {
          uri: 'file://test/updated-photo.jpg',
          type: 'image/jpeg',
          name: 'photo.jpg'
        }
      };

      const mockResponse = { data: { id: plantId, ...mockUpdateData } };
      (api.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await updatePlant(plantId, mockUpdateData);

      // Vérifier que la requête PUT est envoyée avec les bons paramètres
      expect(api.put).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`/plants/${plantId}\\?`)),
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      );

      // Vérifier que l'URL contient les paramètres de requête
      const callArgs = (api.put as jest.Mock).mock.calls[0];
      expect(callArgs[0]).toContain(`name=${encodeURIComponent(mockUpdateData.name)}`);
      expect(callArgs[0]).toContain(`location=${encodeURIComponent(mockUpdateData.location)}`);
      expect(callArgs[0]).toContain(`care_instructions=${encodeURIComponent(mockUpdateData.care_instructions)}`);

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deletePlant', () => {
    it('should make delete request to correct endpoint', async () => {
      const plantId = 1;
      const mockResponse = { data: { success: true } };

      (api.delete as jest.Mock).mockResolvedValue(mockResponse);

      const result = await deletePlant(plantId);

      expect(api.delete).toHaveBeenCalledWith(`/plants?plant_id=${plantId}`);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('startPlantCare', () => {
    it('should make put request to correct endpoint', async () => {
      const plantId = 1;
      const mockResponse = { data: { success: true } };

      (api.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await startPlantCare(plantId);

      expect(api.put).toHaveBeenCalledWith(`/plants/${plantId}/start-care`);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('endPlantCare', () => {
    it('should make put request to correct endpoint', async () => {
      const plantId = 1;
      const mockResponse = { data: { success: true } };

      (api.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await endPlantCare(plantId);

      expect(api.put).toHaveBeenCalledWith(`/plants/${plantId}/end-care`);
      expect(result).toEqual(mockResponse.data);
    });
  });
});
