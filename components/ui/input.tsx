'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'neumo' | 'flat';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'neumo', ...props }, ref) => {
    const variantClasses = {
      default: 'border border-input bg-background',
      neumo: 'neumo-pressed border-0 bg-neumo-bg focus:shadow-neumo-sm',
      flat: 'border border-border bg-transparent',
    };

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-neumo px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
          variantClasses[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };