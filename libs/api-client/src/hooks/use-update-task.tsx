import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { TaskAPI } from '../api/task-api';
import { Task, UpdateTaskRequest } from '../types';
import { taskKeys } from './task-keys';

/**
 * Hook to update an existing task
 * @param options - React Query mutation options
 * @returns Mutation object with updateTask function
 */
export function useUpdateTask(options?: UseMutationOptions<Task, Error, { id: number; data: UpdateTaskRequest }>) {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, { id: number; data: UpdateTaskRequest }>({
    mutationFn: ({ id, data }) => TaskAPI.updateTask(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch task list
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      // Update the specific task in cache
      queryClient.setQueryData(taskKeys.detail(variables.id), data);
    },
    ...options,
  });
}
