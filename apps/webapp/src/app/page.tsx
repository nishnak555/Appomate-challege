"use client";

import { useState } from 'react';
import { TaskForm } from '@/components/tasks/task-form';
import { TaskList } from '@/components/tasks/task-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';
import { TaskFilters } from '@/components/tasks/task-filters';
import { useDebounce } from '@/lib/use-debounce';

export default function Home() {
  const [categoryId, setCategoryId] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 300);

  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted/20'>
      <div className='container mx-auto max-w-3xl px-4 py-8 md:py-12'>
        <div className='mb-10'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='p-2 rounded-lg bg-primary/10'>
              <CheckSquare className='h-7 w-7 text-primary' />
            </div>
            <h1 className='text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text'>
              Todo List
            </h1>
          </div>
          <p className='text-muted-foreground text-lg'>Manage your tasks with simplicity and elegance</p>
        </div>

        <div className='space-y-6'>
          <TaskForm />
          <Card className='shadow-lg'>
            <CardHeader className='pb-4'>
              <div className='flex flex-col gap-4'>
                <CardTitle className='text-xl'>Your Tasks</CardTitle>
                <TaskFilters
                  categoryId={categoryId}
                  search={search}
                  onCategoryChange={setCategoryId}
                  onSearchChange={setSearch}
                />
              </div>
            </CardHeader>
            <CardContent>
              <TaskList filters={{ categoryId, search: debouncedSearch }} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
