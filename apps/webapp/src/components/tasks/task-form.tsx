'use client';

import { useMemo, useState } from 'react';
import { useCreateTask, useTaskCategories, useCreateCategory, Category } from '@appomate-challenge/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [newCategory, setNewCategory] = useState('');
  const createTask = useCreateTask();
  const { data: categories, isLoading: isLoadingCategories, refetch: refetchCategories } = useTaskCategories({
    retry: 1,
  });
  const createCategory = useCreateCategory({
    onSuccess: (created) => {
      setCategoryId(String(created.id));
      setNewCategory('');
      // Refetch to ensure both form and filters get updated
      refetchCategories();
    },
  });

  const categoryOptions = useMemo(() => {
    const base: Category[] = categories ?? [];
    const merged = new Map<number, Category>();
    base.forEach((c) => merged.set(c.id, c));
    return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask.mutate(
      {
        title: title.trim(),
        description: description.trim() || null,
        categoryId: categoryId ? Number(categoryId) : null,
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setCategoryId('');
        },
      }
    );
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newCategory.trim()) return;
    createCategory.mutate(newCategory.trim());
  };

  return (
    <Card className='shadow-sm'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-xl'>Add New Task</CardTitle>
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
              className='h-11'
            />
          </div>
          <div className='space-y-2'>
            <Input
              placeholder='Description (optional)...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={createTask.isPending}
              className='h-11'
            />
          </div>
          <div className='space-y-3'>
            <label className='text-sm font-medium text-foreground'>Category</label>
            <select
              className='w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={createTask.isPending || isLoadingCategories || createCategory.isPending}
            >
              <option value=''>Uncategorized</option>
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className='flex gap-2'>
              <Input
                placeholder='New category name'
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                disabled={createCategory.isPending}
                className='h-10'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateCategory(e);
                  }
                }}
              />
              <Button 
                type='button' 
                variant='outline' 
                onClick={handleCreateCategory} 
                disabled={!newCategory.trim() || createCategory.isPending}
                className='h-10 px-4 whitespace-nowrap'
              >
                {createCategory.isPending ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </div>
          <Button 
            type='submit' 
            disabled={createTask.isPending || !title.trim()}
            className='w-full h-11 mt-6'
            size='lg'
          >
            <Plus className='h-4 w-4 mr-2' />
            {createTask.isPending ? 'Adding...' : 'Add Task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
