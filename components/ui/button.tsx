'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-neumo text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 neumo-interactive neumo-focus active:scale-95',
  {
    variants: {
      variant: {
        default: 'neumo-surface text-foreground hover:shadow-neumo-lg',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-neumo',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-neumo-sm',
        secondary: 'neumo-surface bg-secondary text-secondary-foreground hover:shadow-neumo-lg',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        primary: 'bg-brand-primary text-white shadow-neumo hover:shadow-neumo-lg hover:bg-brand-primary/90',
        success: 'bg-brand-success text-white shadow-neumo hover:shadow-neumo-lg hover:bg-brand-success/90',
        warning: 'bg-brand-warning text-white shadow-neumo hover:shadow-neumo-lg hover:bg-brand-warning/90',
        pressed: 'neumo-pressed text-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-neumo-sm px-3',
        lg: 'h-11 rounded-neumo-lg px-8',
        xl: 'h-14 rounded-neumo-lg px-12 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8 rounded-neumo-sm',
        'icon-lg': 'h-12 w-12 rounded-neumo-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };