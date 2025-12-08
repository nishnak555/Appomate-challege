import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TaskAPI } from '../api/task-api.js';
import { Task } from '../types/index.js';
import { taskKeys } from './task-keys.js';

/**
 * Hook to fetch the list of all tasks
 * @param options - React Query options
 * @returns Query result with tasks array
 */
export function useTaskList(options?: Omit<UseQueryOptions<Task[], Error>, 'queryKey' | 'queryFn'>) {
    return useQuery<Task[], Error>({
        queryKey: taskKeys.lists(),
        queryFn: () => TaskAPI.fetchTaskList(),
        ...options,
    });
}
