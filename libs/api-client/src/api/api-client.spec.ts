import { ApiClient, ApiError, createApiClient } from './api-client.js';

// Mock fetch globally
global.fetch = jest.fn();

describe('ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = createApiClient({
      baseURL: 'https://api.example.com',
    });
    jest.clearAllMocks();
  });

  describe('GET requests', () => {
    it('should make a GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await apiClient.get('/users');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should handle query parameters', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await apiClient.get('/users', {
        params: { page: 1, limit: 10 },
      });

      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/users?page=1&limit=10', expect.any(Object));
    });
  });

  describe('POST requests', () => {
    it('should make a POST request with data', async () => {
      const mockData = { id: 1, name: 'Test' };
      const postData = { name: 'Test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await apiClient.post('/users', postData);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('Error handling', () => {
    it('should throw ApiError for non-ok responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await expect(apiClient.get('/users')).rejects.toThrow(ApiError);
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(apiClient.get('/users')).rejects.toThrow(ApiError);
    });
  });

  describe('Headers management', () => {
    it('should allow setting custom headers', () => {
      apiClient.setHeader('Authorization', 'Bearer token123');
      expect(apiClient.getBaseURL()).toBe('https://api.example.com');
    });

    it('should allow removing headers', () => {
      apiClient.setHeader('Authorization', 'Bearer token123');
      apiClient.removeHeader('Authorization');
      expect(apiClient.getBaseURL()).toBe('https://api.example.com');
    });
  });
});
