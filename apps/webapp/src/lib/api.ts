import { createApiClient, TaskAPI } from '@appomate-challenge/api-client';

// Create and initialize the API client
const apiClient = createApiClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
});

// Initialize TaskAPI
TaskAPI.initialize(apiClient);

export { apiClient, TaskAPI };
