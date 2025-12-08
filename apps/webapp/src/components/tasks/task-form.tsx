'use client';

import { useState } from 'react';
import { useCreateTask } from '@appomate-challenge/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export function TaskForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const createTask = useCreateTask();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        createTask.mutate(
            {
                title: title.trim(),
                description: description.trim() || null,
            },
            {
                onSuccess: () => {
                    setTitle('');
                    setDescription('');
                },
            }
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Task</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='space-y-2'>
                        <Input
                            placeholder='Task title...'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={createTask.isPending}
                            required
                        />
                    </div>
                    <div className='space-y-2'>
                        <Input
                            placeholder='Description (optional)...'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={createTask.isPending}
                        />
                    </div>
                    <Button type='submit' disabled={createTask.isPending || !title.trim()}>
                        <Plus className='h-4 w-4 mr-2' />
                        {createTask.isPending ? 'Adding...' : 'Add Task'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
