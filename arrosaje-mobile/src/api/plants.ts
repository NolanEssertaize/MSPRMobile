// src/api/plants.ts - Version corrigée

import api from './api';
import { Platform } from 'react-native';
import { PlantCreate, PlantUpdate } from '../types/plant';

export const createPlant = async (plantData: PlantCreate): Promise<any> => {
  try {
    // Créer un objet FormData pour la photo uniquement
    const formData = new FormData();
    
    // Ajouter la photo si elle existe
    if (plantData.photo) {
      const photoFile = {
        uri: plantData.photo.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      };
      
      // @ts-ignore - TypeScript ne reconnaît pas bien le type pour FormData dans React Native
      formData.append('photo', photoFile);
    }
    
    // Construire l'URL avec les paramètres de requête
    let url = `/plants/?name=${encodeURIComponent(plantData.name)}&location=${encodeURIComponent(plantData.location)}`;
    
    // Ajouter care_instructions comme paramètre de requête si présent
    if (plantData.care_instructions) {
      url += `&care_instructions=${encodeURIComponent(plantData.care_instructions)}`;
    }
    
    console.log('Sending request to URL:', url);
    
    // Envoyer la requête avec les paramètres dans l'URL
    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Create plant error:', error);
    
    // Journalisation détaillée de l'erreur pour le débogage
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    
    throw error;
  }
};

// Fonction pour récupérer les plantes de l'utilisateur
export const getUserPlants = async (): Promise<any[]> => {
  try {
    const response = await api.get('/my_plants/');
    return response.data;
  } catch (error) {
    console.error('Get user plants error:', error);
    throw error;
  }
};

// Fonction pour récupérer toutes les plantes sauf celles de l'utilisateur
export const getAllOtherPlants = async (): Promise<any[]> => {
  try {
    const response = await api.get('/all_plants/');
    return response.data;
  } catch (error) {
    console.error('Get all other plants error:', error);
    throw error;
  }
};

// src/api/plants.ts - Fonction updatePlant corrigée

export const updatePlant = async (plantId: number, plantData: PlantUpdate): Promise<any> => {
  try {
    // Créer un objet FormData pour la photo uniquement
    const formData = new FormData();
    
    // Ajouter la photo si elle existe
    if (plantData.photo) {
      const photoFile = {
        uri: plantData.photo.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      };
      
      // @ts-ignore
      formData.append('photo', photoFile);
    }
    
    // Construire l'URL avec les paramètres de requête
    let url = `/plants/${plantId}?`;
    
    // Ajouter les paramètres de requête seulement s'ils sont présents
    const params = [];
    if (plantData.name) params.push(`name=${encodeURIComponent(plantData.name)}`);
    if (plantData.location) params.push(`location=${encodeURIComponent(plantData.location)}`);
    if (plantData.care_instructions) params.push(`care_instructions=${encodeURIComponent(plantData.care_instructions)}`);
    if (plantData.in_care_id) params.push(`in_care_id=${plantData.in_care_id}`);
    
    url += params.join('&');
    
    console.log('Sending update request to URL:', url);
    
    // Envoyer la requête avec les paramètres dans l'URL
    const response = await api.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Update plant error:', error);
    
    // Journalisation détaillée de l'erreur pour le débogage
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    
    throw error;
  }
};

// Fonction pour supprimer une plante
export const deletePlant = async (plantId: number): Promise<any> => {
  try {
    const response = await api.delete(`/plants?plant_id=${plantId}`);
    return response.data;
  } catch (error) {
    console.error('Delete plant error:', error);
    throw error;
  }
};

// Fonction pour commencer à prendre soin d'une plante
export const startPlantCare = async (plantId: number): Promise<any> => {
  try {
    const response = await api.put(`/plants/${plantId}/start-care`);
    return response.data;
  } catch (error) {
    console.error('Start plant care error:', error);
    throw error;
  }
};

// Fonction pour arrêter de prendre soin d'une plante
export const endPlantCare = async (plantId: number): Promise<any> => {
  try {
    const response = await api.put(`/plants/${plantId}/end-care`);
    return response.data;
  } catch (error) {
    console.error('End plant care error:', error);
    throw error;
  }
};

// Fonction pour récupérer les demandes de soins
export const getCareRequests = async (): Promise<any[]> => {
  try {
    const response = await api.get('/all_plants/');
    return response.data;
  } catch (error) {
    console.error('Get care requests error:', error);
    throw error;
  }
};