'use client';

import { useTaskList } from '@appomate-challenge/api-client';
import { TaskItem } from './task-item';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';

interface TaskListProps {
  filters: { categoryId: string; search: string };
}

export function TaskList({ filters }: TaskListProps) {
  const queryFilters = useMemo(() => {
    const normalized = {
      categoryId:
        filters.categoryId && filters.categoryId !== 'All'
          ? filters.categoryId === ''
            ? null
            : Number(filters.categoryId)
          : undefined,
      search: filters.search,
    };
    return normalized;
  }, [filters]);

  const { data: tasks, isLoading, error, isFetching } = useTaskList(queryFilters);

  // Log error for debugging
  if (error) {
    console.error('TaskList error:', error);
  }

  // Show loading only on initial load, not when fetching with previous data
  if (isLoading && !tasks) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (error && !tasks) {
    return (
      <div className='py-8'>
        <p className='text-destructive text-center'>Failed to load tasks. Please try again.</p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className='py-8'>
        <p className='text-center text-muted-foreground'>
          No tasks found{filters.search ? ' for this search' : ''}. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-3 relative'>
      {isFetching && (
        <div className='absolute top-0 right-0 z-10'>
          <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
        </div>
      )}
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
