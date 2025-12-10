'use client';

import { useState, useEffect, useMemo } from 'react';
import { Task, useUpdateTask, useTaskCategories, useCreateCategory, Category } from '@appomate-challenge/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface TaskEditDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskEditDialog({ task, isOpen, onClose }: TaskEditDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [categoryId, setCategoryId] = useState<string>(task.category?.id ? String(task.category.id) : '');
  const [newCategory, setNewCategory] = useState('');
  
  const updateTask = useUpdateTask();
  const { data: categories, isLoading: isLoadingCategories, refetch: refetchCategories } = useTaskCategories({
    retry: 1,
  });
  const createCategory = useCreateCategory({
    onSuccess: (created) => {
      setCategoryId(String(created.id));
      setNewCategory('');
      refetchCategories();
    },
  });

  // Reset form when task changes
  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCategoryId(task.category?.id ? String(task.category.id) : '');
      setNewCategory('');
    }
  }, [task, isOpen]);

  const categoryOptions = useMemo(() => {
    const base: Category[] = categories ?? [];
    const merged = new Map<number, Category>();
    base.forEach((c) => merged.set(c.id, c));
    return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateTask.mutate(
      {
        id: task.id,
        data: {
          title: title.trim(),
          description: description.trim() || null,
          categoryId: categoryId ? Number(categoryId) : null,
        },
      },
      {
        onSuccess: () => {
          onClose();
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

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4' onClick={onClose}>
      <Card className='w-full max-w-md shadow-xl' onClick={(e) => e.stopPropagation()}>
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-xl'>Edit Task</CardTitle>
            <Button variant='ghost' size='icon' onClick={onClose} className='h-8 w-8'>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground'>Title</label>
              <Input
                placeholder='Task title...'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={updateTask.isPending}
                required
                className='h-11'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground'>Description</label>
              <Input
                placeholder='Description (optional)...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={updateTask.isPending}
                className='h-11'
              />
            </div>
            <div className='space-y-3'>
              <label className='text-sm font-medium text-foreground'>Category</label>
              <select
                className='w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={updateTask.isPending || isLoadingCategories || createCategory.isPending}
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
            <div className='flex gap-2 pt-2'>
              <Button 
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={updateTask.isPending}
                className='flex-1 h-11'
              >
                Cancel
              </Button>
              <Button 
                type='submit' 
                disabled={updateTask.isPending || !title.trim()}
                className='flex-1 h-11'
              >
                {updateTask.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


