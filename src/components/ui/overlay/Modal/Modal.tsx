// FILE: src/components/ui/overlay/Modal/Modal.tsx
// Adaptive Modal - Auto switches between desktop modal and mobile sheet

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import * as DialogPrimitive from '@radix-ui/react-dialog'

// TYPES

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
  // Control
  open: boolean
  onOpenChange: (open: boolean) => void

  // Content
  children: React.ReactNode

  // Configuration
  size?: ModalSize
  title?: string
  description?: string

  // Behavior
  closeOnEscape?: boolean
  closeOnOutsideClick?: boolean
  showCloseButton?: boolean
  preventScroll?: boolean

  // Styling
  className?: string
  overlayClassName?: string
  contentClassName?: string

  // Mobile behavior
  forceMobile?: boolean
  forceDesktop?: boolean
  mobileAsSheet?: boolean // Show as bottom sheet on mobile

  // Callbacks
  onClose?: () => void
  onOpen?: () => void

  // Additional
  testId?: string
}

// SIZE CONFIGURATION

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
}

// MODAL COMPONENT

export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  children,
  size = 'md',
  title,
  description,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  showCloseButton = true,
  preventScroll = true,
  className,
  overlayClassName,
  contentClassName,
  forceMobile = false,
  forceDesktop = false,
  mobileAsSheet = true,
  onClose,
  onOpen,
  testId = 'modal',
}) => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const shouldShowAsSheet =
    !forceDesktop && (forceMobile || (isMobile && mobileAsSheet))

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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (preventScroll && open) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [open, preventScroll])

  // HANDLERS

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  // RENDER MOBILE SHEET

  if (shouldShowAsSheet) {
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

          {/* Sheet Content */}
          <DialogPrimitive.Content
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'max-h-[90vh] rounded-t-2xl',
              'border-t border-border-primary bg-bg-secondary',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
              'data-[state=closed]:duration-300 data-[state=open]:duration-500',
              contentClassName,
              className
            )}
            onEscapeKeyDown={
              closeOnEscape ? undefined : e => e.preventDefault()
            }
            onPointerDownOutside={
              closeOnOutsideClick ? undefined : e => e.preventDefault()
            }
            data-testid={testId}
          >
            {/* Handle Bar */}
            <div className="flex justify-center py-3">
              <div className="h-1 w-12 rounded-full bg-border-primary" />
            </div>

            {/* Content */}
            <div className="max-h-[90vh] overflow-y-auto">{children}</div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    )
  }

  // RENDER DESKTOP MODAL

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

        {/* Modal Content */}
        <DialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50',
            'translate-x-[-50%] translate-y-[-50%]',
            'w-full',
            sizeClasses[size],
            'max-h-[90vh]',
            'rounded-lg border shadow-lg',
            'border-border-primary bg-bg-secondary',
            'flex flex-col',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            contentClassName,
            className
          )}
          onEscapeKeyDown={closeOnEscape ? undefined : e => e.preventDefault()}
          onPointerDownOutside={
            closeOnOutsideClick ? undefined : e => e.preventDefault()
          }
          data-testid={testId}
        >
          {/* Close Button */}
          {showCloseButton && (
            <DialogPrimitive.Close
              className={cn(
                'absolute right-4 top-4 z-10',
                'ring-offset-background rounded-sm opacity-70 transition-opacity',
                'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
                'disabled:pointer-events-none',
                'text-text-secondary hover:text-text-primary'
              )}
              onClick={handleClose}
              aria-label={t('ui.modal.close')}
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          )}

          {/* Content */}
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

Modal.displayName = 'Modal'

export default Modal
