// src/__tests__/api/comments.test.ts
import {
  getPlantComments,
  createComment,
  updateComment,
  deleteComment,
  getUserComments
} from '../../api/comments';
import api from '../../api/api';

// Mock des dépendances
jest.mock('../../api/api');

describe('Comments API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlantComments', () => {
    it('should make get request to correct endpoint', async () => {
      const plantId = 1;
      const mockComments = [
        { id: 1, plant_id: plantId, comment: 'Great plant!' },
        { id: 2, plant_id: plantId, comment: 'Looks healthy!' }
      ];
      const mockResponse = { data: mockComments };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getPlantComments(plantId);

      expect(api.get).toHaveBeenCalledWith(`/plants/${plantId}/comments/`);
      expect(result).toEqual(mockComments);
    });
  });

  describe('createComment', () => {
    it('should make post request with correct parameters', async () => {
      const mockCommentData = {
        plant_id: 1,
        comment: 'This is a test comment'
      };

      const mockResponse = { data: { id: 1, ...mockCommentData } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await createComment(mockCommentData);

      // Vérifier que l'URL contient les paramètres de requête
      const expectedUrl = `/comments/?plant_id=${mockCommentData.plant_id}&comment=${encodeURIComponent(mockCommentData.comment)}`;
      expect(api.post).toHaveBeenCalledWith(expectedUrl);

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateComment', () => {
    it('should make put request with correct comment data', async () => {
      const commentId = 1;
      const mockUpdateData = { comment: 'Updated comment' };
      const mockResponse = { data: { id: commentId, ...mockUpdateData } };

      (api.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await updateComment(commentId, mockUpdateData);

      expect(api.put).toHaveBeenCalledWith(`/comments/${commentId}`, mockUpdateData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteComment', () => {
    it('should make delete request to correct endpoint', async () => {
      const commentId = 1;
      const mockResponse = { data: { success: true } };

      (api.delete as jest.Mock).mockResolvedValue(mockResponse);

      const result = await deleteComment(commentId);

      expect(api.delete).toHaveBeenCalledWith(`/comments/${commentId}`);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getUserComments', () => {
    it('should make get request to correct endpoint', async () => {
      const userId = 1;
      const mockComments = [
        { id: 1, user_id: userId, comment: 'Comment 1' },
        { id: 2, user_id: userId, comment: 'Comment 2' }
      ];
      const mockResponse = { data: mockComments };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getUserComments(userId);

      expect(api.get).toHaveBeenCalledWith(`/users/${userId}/comments/`);
      expect(result).toEqual(mockComments);
    });
  });
});