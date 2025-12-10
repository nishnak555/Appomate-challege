import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { TaskAPI } from '../api/task-api';
import { taskKeys } from './task-keys';
import { Category } from '../types';

/**
 * Hook to fetch distinct task categories
 */
export function useTaskCategories(options?: Omit<UseQueryOptions<Category[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery<Category[], Error>({
    queryKey: [...taskKeys.all, 'categories'],
    queryFn: () => TaskAPI.fetchCategories(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useCreateCategory(options?: UseMutationOptions<Category, Error, string>) {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, string>({
    mutationFn: (name) => TaskAPI.createCategory(name),
    onSuccess: (newCategory) => {
      // Invalidate and refetch categories immediately
      queryClient.invalidateQueries({ queryKey: [...taskKeys.all, 'categories'] });
      // Optimistically add the new category to the cache
      queryClient.setQueryData<Category[]>([...taskKeys.all, 'categories'], (old = []) => {
        // Check if category already exists to avoid duplicates
        if (old.some(cat => cat.id === newCategory.id)) {
          return old;
        }
        return [...old, newCategory];
      });
    },
    ...options,
  });
}

