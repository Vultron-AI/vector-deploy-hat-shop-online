/**
 * Loading Components
 *
 * Various loading skeleton and spinner components.
 *
 * Usage:
 *   <Skeleton className="h-4 w-[250px]" />
 *   <SkeletonCard />
 *   <LoadingSpinner size="lg" />
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

// Basic skeleton element
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'animate-pulse rounded-[var(--radius-md)] bg-[var(--color-border)]',
        className
      )}
      {...props}
    />
  )
)
Skeleton.displayName = 'Skeleton'

// Skeleton card
const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      'rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4',
      className
    )}
  >
    <Skeleton className="h-40 w-full mb-4" />
    <Skeleton className="h-4 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2" />
  </div>
)
SkeletonCard.displayName = 'SkeletonCard'

// Skeleton text lines
export interface SkeletonTextProps {
  lines?: number
  className?: string
}

const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 3, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn('h-4', i === lines - 1 ? 'w-2/3' : 'w-full')}
      />
    ))}
  </div>
)
SkeletonText.displayName = 'SkeletonText'

// Skeleton table row
const SkeletonTableRow: React.FC<{ columns?: number; className?: string }> = ({
  columns = 4,
  className,
}) => (
  <div className={cn('flex gap-4 py-4 border-b border-[var(--color-border)]', className)}>
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton key={i} className="h-4 flex-1" />
    ))}
  </div>
)
SkeletonTableRow.displayName = 'SkeletonTableRow'

// Loading spinner with sizes
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-3',
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className }) => (
  <div
    className={cn(
      'animate-spin rounded-full border-[var(--color-border)] border-t-[var(--color-accent)]',
      sizeClasses[size],
      className
    )}
    role="status"
    aria-label="Loading"
  />
)
LoadingSpinner.displayName = 'LoadingSpinner'

// Full page loading state
export interface PageLoadingProps {
  message?: string
}

const PageLoading: React.FC<PageLoadingProps> = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
    <LoadingSpinner size="lg" />
    <p className="text-sm text-[var(--color-muted)]">{message}</p>
  </div>
)
PageLoading.displayName = 'PageLoading'

export { Skeleton, SkeletonCard, SkeletonText, SkeletonTableRow, LoadingSpinner, PageLoading }
