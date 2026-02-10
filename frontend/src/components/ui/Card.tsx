/**
 * Card Component
 *
 * A versatile content container with optional title, description, and footer.
 *
 * Usage:
 *   <Card>Basic content</Card>
 *   <Card title="Card Title" description="Subtitle">Content</Card>
 *   <Card footer={<Button>Action</Button>}>Content</Card>
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  footer?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, description, footer, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]',
        'shadow-[var(--shadow-sm)]',
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="border-b border-[var(--color-border)] p-4 md:p-6">
          {title && <h3 className="text-lg font-semibold text-[var(--color-fg)]">{title}</h3>}
          {description && <p className="mt-1 text-sm text-[var(--color-muted)]">{description}</p>}
        </div>
      )}
      <div className="p-4 md:p-6">{children}</div>
      {footer && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] p-4 md:px-6 md:py-4 rounded-b-[var(--radius-lg)]">
          {footer}
        </div>
      )}
    </div>
  )
)
Card.displayName = 'Card'

// Simplified Card parts for more flexibility
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('border-b border-[var(--color-border)] p-4 md:p-6', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 md:p-6', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'border-t border-[var(--color-border)] bg-[var(--color-bg)] p-4 md:px-6 md:py-4 rounded-b-[var(--radius-lg)]',
        className
      )}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold text-[var(--color-fg)]', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('mt-1 text-sm text-[var(--color-muted)]', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription }
