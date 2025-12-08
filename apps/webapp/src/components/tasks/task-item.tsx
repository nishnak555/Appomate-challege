'use client';

import { Task } from '@appomate-challenge/api-client';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUpdateTask, useDeleteTask } from '@appomate-challenge/api-client';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface TaskItemProps {
    task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();
    const [isDeleting, setIsDeleting] = useState(false);

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
        <Card className={task.completed ? 'opacity-60' : ''}>
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Checkbox
                        checked={task.completed}
                        onChange={handleToggleComplete}
                        disabled={updateTask.isPending}
                        className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                        <h3
                            className={`text-base font-medium ${
                                task.completed ? 'line-through text-muted-foreground' : ''
                            }`}
                        >
                            {task.title}
                        </h3>
                        {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                            {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDelete}
                        disabled={deleteTask.isPending || isDeleting}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
