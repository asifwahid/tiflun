'use client';

import { cn } from '@/lib/utils';

function Skeleton({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'neumo';
}) {
  if (variant === 'neumo') {
    return (
      <div
        className={cn('skeleton-neumo', className)}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };