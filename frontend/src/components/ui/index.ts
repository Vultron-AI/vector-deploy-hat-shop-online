/**
 * UI Component Exports
 * 
 * All reusable UI components are exported from here.
 * Import as: import { Button, Select, ConfirmDialog } from '@/components/ui'
 */

// Button
export { Button, buttonVariants } from './Button'
export type { ButtonProps } from './Button'

// Spinner
export { Spinner } from './Spinner'

// Select
export { Select } from './Select'
export type { SelectProps, SelectOption } from './Select'

// Dialog System
export {
  // Base components
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
  // Pre-built dialogs
  AlertDialog,
  ConfirmDialog,
  PromptDialog,
  CustomDialog,
  // Types
  type DialogVariant,
  type AlertDialogProps,
  type ConfirmDialogProps,
  type PromptDialogProps,
  type CustomDialogProps,
} from './Dialog'

// Dialog Provider & Hook
export {
  DialogProvider,
  useDialog,
  type AlertOptions,
  type ConfirmOptions,
  type PromptOptions,
} from './DialogProvider'

// Input
export { Input } from './Input'
export type { InputProps } from './Input'

// Card
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './Card'
export type { CardProps } from './Card'

// Badge
export { Badge, badgeVariants } from './Badge'
export type { BadgeProps } from './Badge'

// Table
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './Table'

// Toast
export { Toast, ToastContainer, toastVariants } from './Toast'
export type { ToastProps, ToastContainerProps } from './Toast'

// EmptyState
export { EmptyState } from './EmptyState'
export type { EmptyStateProps } from './EmptyState'

// Loading
export {
  Skeleton,
  SkeletonCard,
  SkeletonText,
  SkeletonTableRow,
  LoadingSpinner,
  PageLoading,
} from './Loading'
export type { SkeletonProps, SkeletonTextProps, LoadingSpinnerProps, PageLoadingProps } from './Loading'
