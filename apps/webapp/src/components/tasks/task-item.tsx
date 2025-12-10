'use client';

import { Task } from '@appomate-challenge/api-client';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUpdateTask, useDeleteTask } from '@appomate-challenge/api-client';
import { Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { TaskEditDialog } from './task-edit-dialog';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleToggleComplete = () => {
    updateTask.mutate({
      id: task.id,
      data: { completed: !task.completed },
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      deleteTask.mutate(task.id, {
        onSettled: () => setIsDeleting(false),
      });
    }
  };

  return (
    <>
      <Card className={`transition-all hover:shadow-md ${task.completed ? 'opacity-60' : ''}`}>
        <CardContent className='p-4'>
          <div className='flex items-start gap-3'>
            <Checkbox
              checked={task.completed}
              onChange={handleToggleComplete}
              disabled={updateTask.isPending}
              className='mt-1 flex-shrink-0'
            />
            <div className='flex-1 min-w-0'>
              <h3 className={`text-base font-semibold leading-tight ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className='text-sm text-muted-foreground mt-2 leading-relaxed'>
                  {task.description}
                </p>
              )}
              <div className='flex items-center gap-3 mt-3'>
                <span className='text-xs text-muted-foreground'>
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
                {task.category && (
                  <span className='inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium'>
                    {task.category.name}
                  </span>
                )}
              </div>
            </div>
            <div className='flex items-center gap-1'>
              {!task.completed && (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsEditOpen(true)}
                  disabled={updateTask.isPending}
                  className='flex-shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors'
                >
                  <Edit2 className='h-4 w-4' />
                </Button>
              )}
              <Button
                variant='ghost'
                size='icon'
                onClick={handleDelete}
                disabled={deleteTask.isPending || isDeleting}
                className='flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <TaskEditDialog task={task} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </>
  );
}
