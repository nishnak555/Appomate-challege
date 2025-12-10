import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { TaskAPI } from '../api/task-api';
import { taskKeys } from './task-keys';

/**
 * Hook to delete a task
 * @param options - React Query mutation options
 * @returns Mutation object with deleteTask function
 */
export function useDeleteTask(options?: UseMutationOptions<void, Error, number>) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => TaskAPI.deleteTask(id),
    onSuccess: (_, id) => {
      // Invalidate and refetch task list
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      // Remove the specific task from cache
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) });
    },
    ...options,
  });
}
