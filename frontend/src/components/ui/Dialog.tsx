/**
 * Dialog Component System (Radix-based)
 * 
 * Enterprise-grade modal dialogs built on Radix UI primitives.
 * Provides base components and pre-built dialogs for common patterns.
 * 
 * CUSTOMIZATION: Update the className values to match your design tokens from tokens.css.
 * Look for comments marked "STYLE:" to find customization points.
 * 
 * Pre-built dialogs:
 *   - AlertDialog: Simple alert with OK button (replaces window.alert)
 *   - ConfirmDialog: Confirm/Cancel dialog (replaces window.confirm)
 *   - PromptDialog: Input dialog (replaces window.prompt)
 *   - CustomDialog: Custom content with standard header/body layout
 * 
 * Usage:
 *   <ConfirmDialog
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     title="Delete item?"
 *     description="This action cannot be undone."
 *     variant="destructive"
 *     onConfirm={handleDelete}
 *   />
 */

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Spinner } from './Spinner'

// ============================================================================
// Base Dialog Components
// ============================================================================

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50',
      // STYLE: Overlay background - adjust opacity and blur
      'bg-black/50 backdrop-blur-[1px]',
      // Animation
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean
  }
>(({ className, children, showCloseButton = true, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Centering
        'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
        // Sizing
        'w-full max-w-md',
        // STYLE: Content background, border, shadow, border-radius
        'bg-[var(--color-bg)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]',
        'border border-[var(--color-border)]',
        // Animation
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
        'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        'duration-200',
        // Focus
        'focus:outline-none',
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close 
          className={cn(
            'absolute right-3 top-3',
            'rounded-sm p-1.5',
            // STYLE: Close button colors
            'text-[var(--color-muted)] hover:text-[var(--color-fg)]',
            'hover:bg-[var(--color-surface)]',
            'transition-colors',
            'focus:outline-none'
          )}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    // STYLE: Header padding
    className={cn('px-5 pt-5 pb-1', className)}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    // STYLE: Body padding
    className={cn('px-5 py-3', className)}
    {...props}
  />
)
DialogBody.displayName = 'DialogBody'

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    // STYLE: Footer padding and layout
    className={cn(
      'flex justify-end gap-2 px-5 pb-5 pt-3',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    // STYLE: Title typography
    className={cn(
      'text-base font-medium text-[var(--color-fg)]',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    // STYLE: Description typography
    className={cn('text-sm text-[var(--color-muted)] mt-1', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

// ============================================================================
// Dialog Variants & Icons
// ============================================================================

type DialogVariant = 'default' | 'destructive' | 'warning' | 'success' | 'info'

// STYLE: Variant icon backgrounds and colors - update to match your design tokens
const variantConfig: Record<DialogVariant, { 
  icon: React.ElementType
  iconBg: string
  iconColor: string
  buttonVariant: 'default' | 'destructive'
}> = {
  default: {
    icon: Info,
    iconBg: 'bg-[var(--color-surface)]',
    iconColor: 'text-[var(--color-muted)]',
    buttonVariant: 'default',
  },
  destructive: {
    icon: AlertCircle,
    iconBg: 'bg-[var(--color-error)]/10',
    iconColor: 'text-[var(--color-error)]',
    buttonVariant: 'destructive',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-[var(--color-warning)]/10',
    iconColor: 'text-[var(--color-warning)]',
    buttonVariant: 'default',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-[var(--color-success)]/10',
    iconColor: 'text-[var(--color-success)]',
    buttonVariant: 'default',
  },
  info: {
    icon: Info,
    iconBg: 'bg-[var(--color-info)]/10',
    iconColor: 'text-[var(--color-info)]',
    buttonVariant: 'default',
  },
}

// ============================================================================
// Alert Dialog
// ============================================================================

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  variant?: DialogVariant
  confirmText?: string
  onConfirm?: () => void
}

function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = 'default',
  confirmText = 'OK',
  onConfirm,
}: AlertDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = () => {
    onConfirm?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-sm">
        <div className="p-5 text-center">
          {/* STYLE: Icon container size */}
          <div className={cn(
            'mx-auto flex h-11 w-11 items-center justify-center rounded-full',
            config.iconBg
          )}>
            <Icon className={cn('h-5 w-5', config.iconColor)} />
          </div>
          
          <DialogTitle className="mt-4">
            {title}
          </DialogTitle>
          
          {description && (
            <DialogDescription className="mt-1.5">
              {description}
            </DialogDescription>
          )}
          
          <div className="mt-5">
            <Button
              onClick={handleConfirm}
              className="w-full"
              variant={config.buttonVariant}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// Confirm Dialog
// ============================================================================

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  variant?: DialogVariant
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  loading?: boolean
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = 'default',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon
  const [isLoading, setIsLoading] = React.useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const showLoading = loading || isLoading

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-sm">
        <div className="p-5 text-center">
          {/* STYLE: Icon container */}
          <div className={cn(
            'mx-auto flex h-11 w-11 items-center justify-center rounded-full',
            config.iconBg
          )}>
            <Icon className={cn('h-5 w-5', config.iconColor)} />
          </div>
          
          <DialogTitle className="mt-4">
            {title}
          </DialogTitle>
          
          {description && (
            <DialogDescription className="mt-1.5">
              {description}
            </DialogDescription>
          )}
          
          {/* STYLE: Button gap */}
          <div className="mt-5 flex gap-2">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
              disabled={showLoading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              variant={config.buttonVariant}
              className="flex-1"
              disabled={showLoading}
            >
              {showLoading ? <Spinner /> : confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// Prompt Dialog
// ============================================================================

interface PromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  placeholder?: string
  defaultValue?: string
  confirmText?: string
  cancelText?: string
  onConfirm: (value: string) => void | Promise<void>
  onCancel?: () => void
  inputType?: 'text' | 'email' | 'password' | 'url' | 'number'
  required?: boolean
}

function PromptDialog({
  open,
  onOpenChange,
  title,
  description,
  placeholder = '',
  defaultValue = '',
  confirmText = 'Continue',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  inputType = 'text',
  required = false,
}: PromptDialogProps) {
  const [value, setValue] = React.useState(defaultValue)
  const [isLoading, setIsLoading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) {
      setValue(defaultValue)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open, defaultValue])

  const handleConfirm = async () => {
    if (required && !value.trim()) return

    setIsLoading(true)
    try {
      await onConfirm(value)
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleConfirm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="max-w-sm">
        <div className="p-5">
          <DialogTitle>
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
          
          {/* Input */}
          <div className="mt-4">
            <input
              ref={inputRef}
              type={inputType}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              className={cn(
                'w-full h-10 px-3 rounded-md text-sm',
                // STYLE: Input border
                'border border-[var(--color-border)]',
                // STYLE: Input background and text
                'bg-[var(--color-bg)] text-[var(--color-fg)]',
                // STYLE: Placeholder color
                'placeholder:text-[var(--color-muted)]',
                // STYLE: Focus state
                'focus:outline-none focus:border-[var(--color-accent)]',
                // Disabled state
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-shadow'
              )}
            />
          </div>
          
          {/* Actions */}
          <div className="mt-5 flex justify-end gap-2">
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              size="sm"
              disabled={isLoading || (required && !value.trim())}
            >
              {isLoading ? <Spinner className="h-3.5 w-3.5" /> : confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// Custom Content Dialog
// ============================================================================

interface CustomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
}

function CustomDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  showCloseButton = true,
}: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={showCloseButton} className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// Exports
// ============================================================================

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  AlertDialog,
  ConfirmDialog,
  PromptDialog,
  CustomDialog,
}

export type { DialogVariant, AlertDialogProps, ConfirmDialogProps, PromptDialogProps, CustomDialogProps }
