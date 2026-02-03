// FILE: src/components/ui/overlay/Dialog/Dialog.tsx
// Simple Dialog Component (Confirmation, Alerts, etc.) - Accessibility Fixed

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import * as DialogPrimitive from '@radix-ui/react-dialog'

// TYPES

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

// VISUALLY HIDDEN COMPONENT (for accessibility)
const VisuallyHidden: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <span
    style={{
      position: 'absolute',
      border: 0,
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      wordWrap: 'normal',
    }}
  >
    {children}
  </span>
)

// DIALOG COMPONENT

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

  // EFFECTS

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

  // RENDER

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
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

        {/* Dialog Content */}
        <DialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50',
            'translate-x-[-50%] translate-y-[-50%]',
            'w-full max-w-md',
            'rounded-lg border shadow-lg',
            'border-border-primary bg-bg-secondary',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            contentClassName,
            className
          )}
          onEscapeKeyDown={closeOnEscape ? undefined : e => e.preventDefault()}
          onPointerDownOutside={
            closeOnOutsideClick ? undefined : e => e.preventDefault()
          }
          aria-describedby={description ? undefined : 'dialog-description'}
          data-testid={testId}
        >
          {/* Title - Required for Accessibility */}
          {title ? (
            <DialogPrimitive.Title className="mb-2 px-6 pt-6 text-lg font-semibold text-text-primary">
              {t(title)}
            </DialogPrimitive.Title>
          ) : (
            <VisuallyHidden>
              <DialogPrimitive.Title>Dialog</DialogPrimitive.Title>
            </VisuallyHidden>
          )}

          {/* Description - Required for Accessibility */}
          {description ? (
            <DialogPrimitive.Description className="px-6 pb-4 text-sm text-text-secondary">
              {t(description)}
            </DialogPrimitive.Description>
          ) : (
            <VisuallyHidden>
              <DialogPrimitive.Description id="dialog-description">
                Dialog content
              </DialogPrimitive.Description>
            </VisuallyHidden>
          )}

          {/* Content */}
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

Dialog.displayName = 'Dialog'
