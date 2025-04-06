import api from './api.ts';
import { Comment, CommentCreate, CommentUpdate } from '../types/comment';

// Obtenir les commentaires d'une plante
export const getPlantComments = async (plantId: number): Promise<Comment[]> => {
  try {
    const response = await api.get(`/plants/${plantId}/comments/`);
    return response.data;
  } catch (error) {
    console.error('Get plant comments error:', error);
    throw error;
  }
};

// Créer un commentaire
export const createComment = async (commentData: CommentCreate) => {
  try {
    // Convert commentData to query parameters
    const url = `/comments/?plant_id=${commentData.plant_id}&comment=${encodeURIComponent(commentData.comment)}`;
    
    // Send a POST request with empty body but parameters in URL
    const response = await api.post(url);
    return response.data;
  } catch (error) {
    console.error('Create comment error:', error);
    throw error;
  }
};

// Mettre à jour un commentaire
export const updateComment = async (commentId: number, commentData: CommentUpdate) => {
  try {
    const response = await api.put(`/comments/${commentId}`, commentData);
    return response.data;
  } catch (error) {
    console.error('Update comment error:', error);
    throw error;
  }
};

// Supprimer un commentaire
export const deleteComment = async (commentId: number) => {
  try {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Delete comment error:', error);
    throw error;
  }
};

// Obtenir les commentaires d'un utilisateur
export const getUserComments = async (userId: number): Promise<Comment[]> => {
  try {
    const response = await api.get(`/users/${userId}/comments/`);
    return response.data;
  } catch (error) {
    console.error('Get user comments error:', error);
    throw error;
  }
};