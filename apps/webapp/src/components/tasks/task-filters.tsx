'use client';
import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { useTaskCategories } from '@appomate-challenge/api-client';
import { Search } from 'lucide-react';

interface TaskFiltersProps {
  categoryId: string;
  search: string;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function TaskFilters({ categoryId, search, onCategoryChange, onSearchChange }: TaskFiltersProps) {
  const { data: categories } = useTaskCategories({
    retry: 1,
  });

  const categoryOptions = useMemo(() => {
    const base = categories ?? [];
    return base.sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  return (
    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex items-center gap-3'>
        <label className='text-sm font-medium text-foreground whitespace-nowrap'>Category</label>
        <select
          className='h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value='All'>All</option>
          {categoryOptions.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
          <option value=''>Uncategorized</option>
        </select>
      </div>

      <div className='relative w-full md:max-w-sm'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search tasks...'
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className='h-10 pl-10'
        />
      </div>
    </div>
  );
}






