// FILE: src/components/ui/overlay/Modal/ModalHeader.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import * as DialogPrimitive from '@radix-ui/react-dialog'

export interface ModalHeaderProps {
  children?: React.ReactNode
  title?: string
  description?: string
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}) => {
  const { t } = useTranslation()

  if (children) {
    return (
      <div
        className={cn(
          'flex flex-col space-y-1.5 border-b border-border-primary px-6 py-4',
          className
        )}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5 border-b border-border-primary px-6 py-4',
        className
      )}
    >
      {title && (
        <DialogPrimitive.Title
          className={cn(
            'text-lg font-semibold leading-none tracking-tight text-text-primary',
            titleClassName
          )}
        >
          {t(title)}
        </DialogPrimitive.Title>
      )}
      {description && (
        <DialogPrimitive.Description
          className={cn('text-sm text-text-secondary', descriptionClassName)}
        >
          {t(description)}
        </DialogPrimitive.Description>
      )}
    </div>
  )
}

ModalHeader.displayName = 'ModalHeader'
