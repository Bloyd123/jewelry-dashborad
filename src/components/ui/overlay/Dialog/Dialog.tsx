// ============================================================================
// FILE: src/components/ui/overlay/Dialog/Dialog.tsx
// Simple Dialog Component (Confirmation, Alerts, etc.)
// ============================================================================

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import * as DialogPrimitive from '@radix-ui/react-dialog'

// ============================================================================
// TYPES
// ============================================================================

export interface DialogProps {
  // Control
  open: boolean
  onOpenChange: (open: boolean) => void
  
  // Content
  children: React.ReactNode
  title?: string
  description?: string
  
  // Configuration
  closeOnEscape?: boolean
  closeOnOutsideClick?: boolean
  preventScroll?: boolean
  
  // Styling
  className?: string
  overlayClassName?: string
  contentClassName?: string
  
  // Callbacks
  onClose?: () => void
  onOpen?: () => void
  
  // Additional
  testId?: string
}

// ============================================================================
// DIALOG COMPONENT
// ============================================================================

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
  title,
  description,
  closeOnEscape = true,
  closeOnOutsideClick = false,
  preventScroll = true,
  className,
  overlayClassName,
  contentClassName,
  onClose,
  onOpen,
  testId = 'dialog',
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
  // RENDER
  // ========================================================================

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-bg-primary/80 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            overlayClassName
          )}
        />

        {/* Dialog Content */}
        <DialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50',
            'translate-x-[-50%] translate-y-[-50%]',
            'w-full max-w-md',
            'rounded-lg border shadow-lg',
            'bg-bg-secondary border-border-primary',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            contentClassName,
            className
          )}
          onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
          onPointerDownOutside={
            closeOnOutsideClick ? undefined : (e) => e.preventDefault()
          }
          data-testid={testId}
        >
          {/* Header */}
          {(title || description) && (
            <div className="px-6 pt-6 pb-4">
              {title && (
                <DialogPrimitive.Title className="text-lg font-semibold text-text-primary mb-2">
                  {t(title)}
                </DialogPrimitive.Title>
              )}
              {description && (
                <DialogPrimitive.Description className="text-sm text-text-secondary">
                  {t(description)}
                </DialogPrimitive.Description>
              )}
            </div>
          )}

          {/* Content */}
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

Dialog.displayName = 'Dialog'