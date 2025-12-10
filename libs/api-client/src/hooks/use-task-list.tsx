import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TaskAPI, TaskListFilters } from '../api/task-api';
import { Task } from '../types';
import { taskKeys } from './task-keys';

/**
 * Hook to fetch the list of all tasks
 * @param filters - Optional filters (category, search)
 * @param options - React Query options
 * @returns Query result with tasks array
 */
export function useTaskList(
  filters?: TaskListFilters,
  options?: Omit<UseQueryOptions<Task[], Error>, 'queryKey' | 'queryFn'>
) {
  const normalizedFilters: TaskListFilters | undefined = filters
    ? {
        categoryId: filters.categoryId ?? undefined,
        search: filters.search?.trim() || undefined,
      }
    : undefined;

  return useQuery<Task[], Error>({
    queryKey: taskKeys.list(normalizedFilters),
    queryFn: () => TaskAPI.fetchTaskList(normalizedFilters),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
    ...options,
  });
}
