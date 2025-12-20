// ============================================================================
// FILE: src/components/ui/overlay/Drawer/Drawer.tsx
// Side Drawer Component (Left/Right)
// ============================================================================

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as DialogPrimitive from '@radix-ui/react-dialog'

// ============================================================================
// TYPES
// ============================================================================

export type DrawerSide = 'left' | 'right'
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface DrawerProps {
  // Control
  open: boolean
  onOpenChange: (open: boolean) => void

  // Content
  children: React.ReactNode
  title?: string
  description?: string

  // Configuration
  side?: DrawerSide
  size?: DrawerSize
  showCloseButton?: boolean
  closeOnEscape?: boolean
  closeOnOutsideClick?: boolean
  preventScroll?: boolean

  // Styling
  className?: string
  overlayClassName?: string
  contentClassName?: string
  headerClassName?: string

  // Callbacks
  onClose?: () => void
  onOpen?: () => void

  // Additional
  testId?: string
}

// ============================================================================
// SIZE CONFIGURATION
// ============================================================================

const sizeClasses: Record<DrawerSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
}

// ============================================================================
// DRAWER COMPONENT
// ============================================================================

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  children,
  title,
  description,
  side = 'right',
  size = 'md',
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  preventScroll = true,
  className,
  overlayClassName,
  contentClassName,
  headerClassName,
  onClose,
  onOpen,
  testId = 'drawer',
}) => {
  const { t } = useTranslation()

  // ========================================================================
  // EFFECTS
  // ========================================================================

  useEffect(() => {
    if (open && onOpen) {
      onOpen()
    }
  }, [open, onOpen])

  useEffect(() => {
    if (!open && onClose) {
      onClose()
    }
  }, [open, onClose])

  // Prevent body scroll
  useEffect(() => {
    if (preventScroll && open) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [open, preventScroll])

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  // ========================================================================
  // POSITIONING
  // ========================================================================

  const positionClasses = {
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0',
  }

  const slideAnimation = {
    left: {
      in: 'data-[state=open]:slide-in-from-left',
      out: 'data-[state=closed]:slide-out-to-left',
    },
    right: {
      in: 'data-[state=open]:slide-in-from-right',
      out: 'data-[state=closed]:slide-out-to-right',
    },
  }

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            'bg-bg-primary/80 fixed inset-0 z-50 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            overlayClassName
          )}
        />

        {/* Drawer Content */}
        <DialogPrimitive.Content
          className={cn(
            'fixed z-50 h-full w-full',
            positionClasses[side],
            sizeClasses[size],
            'border bg-bg-secondary shadow-lg',
            side === 'left'
              ? 'border-r border-border-primary'
              : 'border-l border-border-primary',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:duration-300 data-[state=open]:duration-500',
            slideAnimation[side].in,
            slideAnimation[side].out,
            contentClassName,
            className
          )}
          onEscapeKeyDown={closeOnEscape ? undefined : e => e.preventDefault()}
          onPointerDownOutside={
            closeOnOutsideClick ? undefined : e => e.preventDefault()
          }
          data-testid={testId}
        >
          {/* Header */}
          {(title || description || showCloseButton) && (
            <div
              className={cn(
                'flex items-start justify-between border-b border-border-primary px-6 py-4',
                headerClassName
              )}
            >
              <div className="flex-1">
                {title && (
                  <DialogPrimitive.Title className="mb-1 text-lg font-semibold text-text-primary">
                    {t(title)}
                  </DialogPrimitive.Title>
                )}
                {description && (
                  <DialogPrimitive.Description className="text-sm text-text-secondary">
                    {t(description)}
                  </DialogPrimitive.Description>
                )}
              </div>

              {/* Close Button */}
              {showCloseButton && (
                <DialogPrimitive.Close
                  className={cn(
                    'ring-offset-background rounded-sm opacity-70 transition-opacity',
                    'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
                    'disabled:pointer-events-none',
                    'text-text-secondary hover:text-text-primary',
                    'ml-4'
                  )}
                  onClick={handleClose}
                  aria-label={t('ui.drawer.close')}
                >
                  <X className="h-4 w-4" />
                </DialogPrimitive.Close>
              )}
            </div>
          )}

          {/* Content */}
          <div className="h-[calc(100%-5rem)] overflow-y-auto p-6">
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

Drawer.displayName = 'Drawer'

export default Drawer
