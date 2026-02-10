/**
 * EmptyState Component
 *
 * Displays a placeholder when content is empty, with optional icon, title, description, and CTA.
 *
 * Usage:
 *   <EmptyState
 *     icon={<ShoppingCart />}
 *     title="Your cart is empty"
 *     description="Add items to your cart to see them here."
 *     action={<Button>Browse Products</Button>}
 *   />
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center px-6 py-12 text-center',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 text-[var(--color-muted)]">
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                className: cn('h-12 w-12', (icon as React.ReactElement<{ className?: string }>).props.className),
              })
            : icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--color-fg)]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-[var(--color-muted)]">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
)
EmptyState.displayName = 'EmptyState'

export { EmptyState }
