'use client';

import { useTaskList } from '@appomate-challenge/api-client';
import { TaskItem } from './task-item';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function TaskList() {
  const { data: tasks, isLoading, error } = useTaskList();

  // Log error for debugging
  if (error) {
    console.error('TaskList error:', error);
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className='p-8 flex items-center justify-center'>
          <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='p-8'>
          <p className='text-destructive text-center'>Failed to load tasks. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardContent className='p-8'>
          <p className='text-center text-muted-foreground'>No tasks yet. Add one to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-3'>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
