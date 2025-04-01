import { useState, useCallback } from 'react';
import { getUserPlants, getAllOtherPlants, createPlant, updatePlant, deletePlant } from '../api/plants';
import { Plant, PlantCreate, PlantUpdate } from '../types/plant';

export const usePlants = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [otherPlants, setOtherPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les plantes de l'utilisateur
  const loadUserPlants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userPlants = await getUserPlants();
      setPlants(userPlants);
    } catch (err) {
      console.error('Failed to load user plants:', err);
      setError('Échec du chargement des plantes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger les plantes des autres utilisateurs
  const loadOtherPlants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const plants = await getAllOtherPlants();
      setOtherPlants(plants);
    } catch (err) {
      console.error('Failed to load other plants:', err);
      setError('Échec du chargement des plantes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ajouter une plante
  const addPlant = useCallback(async (plantData: PlantCreate) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newPlant = await createPlant(plantData);
      setPlants(prev => [...prev, newPlant]);
      return newPlant;
    } catch (err) {
      console.error('Failed to add plant:', err);
      setError('Échec de l\'ajout de la plante');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mettre à jour une plante
  const editPlant = useCallback(async (plantId: number, plantData: PlantUpdate) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedPlant = await updatePlant(plantId, plantData);
      
      // Mettre à jour la plante dans la liste
      setPlants(prev => prev.map(plant => 
        plant.id === plantId ? updatedPlant : plant
      ));
      
      return updatedPlant;
    } catch (err) {
      console.error('Failed to update plant:', err);
      setError('Échec de la mise à jour de la plante');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Supprimer une plante
  const removePlant = useCallback(async (plantId: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await deletePlant(plantId);
      
      // Supprimer la plante de la liste
      setPlants(prev => prev.filter(plant => plant.id !== plantId));
      
      return true;
    } catch (err) {
      console.error('Failed to delete plant:', err);
      setError('Échec de la suppression de la plante');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    plants,
    otherPlants,
    isLoading,
    error,
    loadUserPlants,
    loadOtherPlants,
    addPlant,
    editPlant,
    removePlant,
  };
};
