import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { TaskAPI } from '../api/task-api.js';
import { Task, UpdateTaskRequest } from '../types/index.js';
import { taskKeys } from './task-keys.js';

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
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            // Update the specific task in cache
            queryClient.setQueryData(taskKeys.detail(variables.id), data);
        },
        ...options,
    });
}
