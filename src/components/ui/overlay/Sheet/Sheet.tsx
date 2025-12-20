// ============================================================================
// FILE: src/components/ui/overlay/Sheet/Sheet.tsx
// Bottom Sheet Component - Mobile-First (Native Feel)
// ============================================================================

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type SheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: React.ReactNode
  size?: SheetSize
  showHandle?: boolean
  showClose?: boolean
  preventOutsideClick?: boolean
  className?: string
}

// ============================================================================
// SIZE VARIANTS
// ============================================================================

const sizeStyles: Record<SheetSize, string> = {
  sm: 'h-[30vh] min-h-[250px]',
  md: 'h-[50vh] min-h-[400px]',
  lg: 'h-[70vh] min-h-[500px]',
  xl: 'h-[85vh] min-h-[600px]',
  full: 'h-[95vh]',
}

// ============================================================================
// SHEET ROOT
// ============================================================================

const Sheet = DialogPrimitive.Root

// ============================================================================
// SHEET TRIGGER
// ============================================================================

const SheetTrigger = DialogPrimitive.Trigger

// ============================================================================
// SHEET CLOSE
// ============================================================================

const SheetClose = DialogPrimitive.Close

// ============================================================================
// SHEET PORTAL
// ============================================================================

const SheetPortal = DialogPrimitive.Portal

// ============================================================================
// SHEET OVERLAY
// ============================================================================

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
SheetOverlay.displayName = 'SheetOverlay'

// ============================================================================
// SHEET CONTENT
// ============================================================================

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: SheetSize
  showHandle?: boolean
  showClose?: boolean
  preventOutsideClick?: boolean
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      className,
      children,
      size = 'md',
      showHandle = true,
      showClose = true,
      preventOutsideClick = false,
      ...props
    },
    ref
  ) => {
    // Prevent body scroll when sheet is open
    React.useEffect(() => {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [])

    return (
      <SheetPortal>
        <SheetOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 flex flex-col',
            'border-t border-border-primary bg-bg-secondary',
            'rounded-t-2xl shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
            'data-[state=closed]:duration-300 data-[state=open]:duration-500',
            sizeStyles[size],
            className
          )}
          onInteractOutside={
            preventOutsideClick ? e => e.preventDefault() : undefined
          }
          {...props}
        >
          {/* Handle Bar */}
          {showHandle && (
            <div className="flex cursor-grab justify-center py-3 active:cursor-grabbing">
              <div className="h-1 w-12 rounded-full bg-border-primary" />
            </div>
          )}

          {/* Close Button */}
          {showClose && (
            <DialogPrimitive.Close
              className={cn(
                'absolute right-4 top-4 z-10 rounded-sm p-1',
                'ring-offset-background opacity-70 transition-all',
                'hover:bg-bg-tertiary hover:opacity-100',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
                'disabled:pointer-events-none',
                'text-text-secondary hover:text-text-primary'
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}

          {/* Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
        </DialogPrimitive.Content>
      </SheetPortal>
    )
  }
)
SheetContent.displayName = 'SheetContent'

// ============================================================================
// SHEET HEADER
// ============================================================================

const SheetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-2 px-6 pb-4',
      'border-b border-border-secondary',
      className
    )}
    {...props}
  />
))
SheetHeader.displayName = 'SheetHeader'

// ============================================================================
// SHEET BODY
// ============================================================================

const SheetBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex-1 overflow-y-auto px-6 py-4',
      'scrollbar-thin scrollbar-thumb-border-primary scrollbar-track-transparent',
      className
    )}
    {...props}
  />
))
SheetBody.displayName = 'SheetBody'

// ============================================================================
// SHEET FOOTER
// ============================================================================

const SheetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row',
      'border-t border-border-secondary bg-bg-secondary',
      className
    )}
    {...props}
  />
))
SheetFooter.displayName = 'SheetFooter'

// ============================================================================
// SHEET TITLE
// ============================================================================

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none text-text-primary',
      className
    )}
    {...props}
  />
))
SheetTitle.displayName = 'SheetTitle'

// ============================================================================
// SHEET DESCRIPTION
// ============================================================================

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-text-secondary', className)}
    {...props}
  />
))
SheetDescription.displayName = 'SheetDescription'

// ============================================================================
// EXPORTS
// ============================================================================

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
