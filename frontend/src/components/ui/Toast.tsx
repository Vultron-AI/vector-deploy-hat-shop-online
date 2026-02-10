/**
 * Toast Component
 *
 * Notification toast with auto-dismiss functionality.
 *
 * Usage:
 *   <Toast variant="success" message="Operation successful!" onClose={() => {}} />
 *   <Toast variant="error" message="Something went wrong" duration={5000} />
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const toastVariants = cva(
  'flex items-center justify-between gap-3 rounded-[var(--radius-md)] px-4 py-3 shadow-[var(--shadow-md)] border',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-surface)] text-[var(--color-fg)] border-[var(--color-border)]',
        success: 'bg-green-50 text-green-800 border-green-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ToastProps extends VariantProps<typeof toastVariants> {
  message: string
  duration?: number
  onClose?: () => void
  className?: string
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ message, variant, duration = 4000, onClose, className }, ref) => {
    React.useEffect(() => {
      if (duration && onClose) {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
      }
    }, [duration, onClose])

    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        role="alert"
      >
        <span className="text-sm font-medium">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-black/5 transition-colors"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
Toast.displayName = 'Toast'

// Toast container for positioning toasts
export interface ToastContainerProps {
  children: React.ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
}

const ToastContainer: React.FC<ToastContainerProps> = ({ children, position = 'top-right' }) => (
  <div className={cn('fixed z-50 flex flex-col gap-2', positionClasses[position])}>
    {children}
  </div>
)
ToastContainer.displayName = 'ToastContainer'

export { Toast, ToastContainer, toastVariants }
