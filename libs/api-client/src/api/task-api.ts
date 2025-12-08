import { ApiClient } from './api-client.js';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/index.js';

/**
 * TaskAPI class with static methods for task-related API calls
 */
export class TaskAPI {
  private static apiClient: ApiClient | null = null;

  /**
   * Initialize the TaskAPI with an ApiClient instance
   * This should be called once before using any TaskAPI methods
   */
  static initialize(apiClient: ApiClient): void {
    TaskAPI.apiClient = apiClient;
  }

  /**
   * Get the current ApiClient instance
   * @throws Error if TaskAPI has not been initialized
   */
  private static getClient(): ApiClient {
    if (!TaskAPI.apiClient) {
      throw new Error('TaskAPI has not been initialized. Call TaskAPI.initialize(apiClient) first.');
    }
    return TaskAPI.apiClient;
  }

  /**
   * Fetch all tasks
   * @returns Promise resolving to an array of tasks
   */
  static async fetchTaskList(): Promise<Task[]> {
    const client = TaskAPI.getClient();
    return client.get<Task[]>('/api/tasks');
  }

  /**
   * Fetch a single task by ID
   * @param id - The task ID
   * @returns Promise resolving to a task
   * @throws ApiError if task is not found
   */
  static async fetchTask(id: number): Promise<Task> {
    const client = TaskAPI.getClient();
    return client.get<Task>(`/api/tasks/${id}`);
  }

  /**
   * Create a new task
   * @param taskData - The task data
   * @returns Promise resolving to the created task
   */
  static async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const client = TaskAPI.getClient();
    return client.post<Task>('/api/tasks', taskData);
  }

  /**
   * Update an existing task
   * @param id - The task ID
   * @param taskData - The task data to update
   * @returns Promise resolving to the updated task
   * @throws ApiError if task is not found
   */
  static async updateTask(id: number, taskData: UpdateTaskRequest): Promise<Task> {
    const client = TaskAPI.getClient();
    return client.put<Task>(`/api/tasks/${id}`, taskData);
  }

  /**
   * Delete a task
   * @param id - The task ID
   * @returns Promise resolving when the task is deleted
   * @throws ApiError if task is not found
   */
  static async deleteTask(id: number): Promise<void> {
    const client = TaskAPI.getClient();
    await client.delete(`/api/tasks/${id}`);
  }
}
