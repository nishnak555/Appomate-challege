import type { TaskListFilters } from '../api/task-api';

/**
 * Query key factory for task-related queries
 */
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters?: TaskListFilters) => [...taskKeys.lists(), { filters: filters ?? {} }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: number) => [...taskKeys.details(), id] as const,
};
