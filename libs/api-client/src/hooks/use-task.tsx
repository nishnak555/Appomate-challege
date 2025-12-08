import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TaskAPI } from '../api/task-api.js';
import { Task } from '../types/index.js';
import { taskKeys } from './task-keys.js';

/**
 * Hook to fetch a single task by ID
 * @param id - The task ID
 * @param options - React Query options
 * @returns Query result with task data
 */
export function useTask(id: number, options?: Omit<UseQueryOptions<Task, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery<Task, Error>({
    queryKey: taskKeys.detail(id),
    queryFn: () => TaskAPI.fetchTask(id),
    enabled: !!id && options?.enabled !== false,
    ...options,
  });
}
