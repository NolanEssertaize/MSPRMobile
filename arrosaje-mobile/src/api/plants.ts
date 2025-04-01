import api from './api.ts';
import { Plant, PlantCreate, PlantUpdate } from '../types/plant';

// Obtenir toutes les plantes de l'utilisateur
export const getUserPlants = async (): Promise<Plant[]> => {
  try {
    const response = await api.get('/my_plants/');
    return response.data;
  } catch (error) {
    console.error('Get user plants error:', error);
    throw error;
  }
};

// Obtenir toutes les plantes sauf celles de l'utilisateur
export const getAllOtherPlants = async (): Promise<Plant[]> => {
  try {
    const response = await api.get('/all_plants/');
    return response.data;
  } catch (error) {
    console.error('Get all other plants error:', error);
    throw error;
  }
};

// Créer une nouvelle plante
export const createPlant = async (plantData: PlantCreate) => {
  try {
    const formData = new FormData();
    formData.append('name', plantData.name);
    formData.append('location', plantData.location);

    if (plantData.care_instructions) {
      formData.append('care_instructions', plantData.care_instructions);
    }

    if (plantData.photo) {
      const photoName = plantData.photo.uri.split('/').pop();
      const mimeType = 'image/jpeg'; // Vous pouvez détecter le type MIME si nécessaire

      formData.append('photo', {
        uri: plantData.photo.uri,
        name: photoName,
        type: mimeType,
      } as any);
    }

    const response = await api.post('/plants/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Create plant error:', error);
    throw error;
  }
};

// Mettre à jour une plante
export const updatePlant = async (plantId: number, plantData: PlantUpdate) => {
  try {
    const formData = new FormData();

    if (plantData.name) formData.append('name', plantData.name);
    if (plantData.location) formData.append('location', plantData.location);
    if (plantData.care_instructions) formData.append('care_instructions', plantData.care_instructions);
    if (plantData.in_care_id) formData.append('in_care_id', plantData.in_care_id.toString());

    if (plantData.photo) {
      const photoName = plantData.photo.uri.split('/').pop();
      const mimeType = 'image/jpeg';

      formData.append('photo', {
        uri: plantData.photo.uri,
        name: photoName,
        type: mimeType,
      } as any);
    }

    const response = await api.put(`/plants/${plantId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Update plant error:', error);
    throw error;
  }
};

// Supprimer une plante
export const deletePlant = async (plantId: number) => {
  try {
    const response = await api.delete(`/plants?plant_id=${plantId}`);
    return response.data;
  } catch (error) {
    console.error('Delete plant error:', error);
    throw error;
  }
};

// Commencer à prendre soin d'une plante
export const startPlantCare = async (plantId: number) => {
  try {
    const response = await api.put(`/plants/${plantId}/start-care`);
    return response.data;
  } catch (error) {
    console.error('Start plant care error:', error);
    throw error;
  }
};

// Arrêter de prendre soin d'une plante
export const endPlantCare = async (plantId: number) => {
  try {
    const response = await api.put(`/plants/${plantId}/end-care`);
    return response.data;
  } catch (error) {
    console.error('End plant care error:', error);
    throw error;
  }
};

// Obtenir les demandes de soins
export const getCareRequests = async () => {
  try {
    const response = await api.get('/care-requests/');
    return response.data;
  } catch (error) {
    console.error('Get care requests error:', error);
    throw error;
  }
};
