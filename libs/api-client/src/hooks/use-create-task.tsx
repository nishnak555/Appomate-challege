import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { TaskAPI } from '../api/task-api.js';
import { Task, CreateTaskRequest } from '../types/index.js';
import { taskKeys } from './task-keys.js';

/**
 * Hook to create a new task
 * @param options - React Query mutation options
 * @returns Mutation object with createTask function
 */
export function useCreateTask(options?: UseMutationOptions<Task, Error, CreateTaskRequest>) {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, CreateTaskRequest>({
    mutationFn: (taskData: CreateTaskRequest) => TaskAPI.createTask(taskData),
    onSuccess: () => {
      // Invalidate and refetch task list after successful creation
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    ...options,
  });
}
