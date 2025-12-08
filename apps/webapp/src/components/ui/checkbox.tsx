'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, checked, ...props }, ref) => {
  return (
    <label className='relative inline-flex items-center cursor-pointer'>
      <input type='checkbox' className='sr-only peer' ref={ref} checked={checked} {...props} />
      <div
        className={cn(
          'h-5 w-5 rounded border-2 border-input bg-background transition-all',
          'peer-checked:bg-primary peer-checked:border-primary',
          'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          'flex items-center justify-center',
          checked && 'bg-primary border-primary',
          className
        )}
      >
        <Check className='h-3.5 w-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity' />
      </div>
    </label>
  );
});
Checkbox.displayName = 'Checkbox';

export { Checkbox };
