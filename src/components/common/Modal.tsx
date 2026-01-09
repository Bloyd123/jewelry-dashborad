// Mini-Step 7.5: Modal Component (Theme-Aware)
// FILE: src/components/common/Modal.tsx

import React, { ReactNode, useEffect, useRef } from 'react'

import { useAppSelector } from '../../store/hooks'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  footer?: ReactNode
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Get theme state from Redux
  const appearance = useAppSelector(state => state.ui.appearance)

  // Size styles
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  }

  // Padding based on appearance
  const paddingClass =
    appearance === 'compact'
      ? 'px-4 py-2'
      : appearance === 'comfortable'
        ? 'px-8 py-6'
        : 'px-6 py-4'
  const titleSizeClass =
    appearance === 'compact'
      ? 'text-base'
      : appearance === 'comfortable'
        ? 'text-xl'
        : 'text-lg'

  // Handle Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4 dark:bg-opacity-70"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={`relative w-full ${sizeStyles[size]} transform rounded-lg bg-white shadow-xl transition-all duration-300 dark:bg-gray-800 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={`flex items-center justify-between ${paddingClass} border-b border-gray-200 dark:border-gray-700`}
          >
            {title && (
              <h3
                id="modal-title"
                className={`${titleSizeClass} font-semibold text-gray-900 dark:text-gray-100`}
              >
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                aria-label="Close modal"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          className={`${paddingClass} max-h-[70vh] overflow-y-auto text-gray-900 dark:text-gray-100`}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={`flex items-center justify-end gap-3 ${paddingClass} border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
