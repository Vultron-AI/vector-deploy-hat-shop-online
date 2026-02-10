/**
 * Input Component
 *
 * A versatile text input with label, error state, and various sizes.
 *
 * Usage:
 *   <Input label="Email" type="email" placeholder="Enter email" />
 *   <Input label="Password" type="password" error="Invalid password" />
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--color-fg)] mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)] px-3 py-2 text-sm',
            'placeholder:text-[var(--color-muted)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-[var(--motion-fast)]',
            error
              ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
              : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-[var(--color-error)]">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-[var(--color-muted)]">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
