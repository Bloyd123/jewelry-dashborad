// FILE: src/components/ui/overlay/Dialog/ConfirmDialog.tsx
// Pre-built Confirmation Dialog

import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { Dialog } from './Dialog'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
export type ConfirmDialogVariant =
  | 'default'
  | 'danger'
  | 'warning'
  | 'info'
  | 'success'

export interface ConfirmDialogProps {
  // Control
  open: boolean
  onOpenChange: (open: boolean) => void

  // Content
  title: string
  description?: string

  // Variant
  variant?: ConfirmDialogVariant

  // Actions
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void

  // State
  loading?: boolean
  disabled?: boolean

  // Configuration
  showIcon?: boolean
  closeOnConfirm?: boolean
  closeOnCancel?: boolean

  // Styling
  className?: string

  // Additional
  testId?: string
}

const variantConfig = {
  default: {
    icon: Info,
    iconColor: 'text-text-secondary',
    confirmVariant: 'default' as const,
  },
  danger: {
    icon: AlertCircle,
    iconColor: 'text-status-error',
    confirmVariant: 'destructive' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-status-warning',
    confirmVariant: 'default' as const,
  },
  info: {
    icon: Info,
    iconColor: 'text-status-info',
    confirmVariant: 'default' as const,
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-status-success',
    confirmVariant: 'default' as const,
  },
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  variant = 'default',
  confirmLabel = 'ui.dialog.confirm',
  cancelLabel = 'ui.dialog.cancel',
  onConfirm,
  onCancel,
  loading = false,
  disabled = false,
  showIcon = true,
  closeOnConfirm = true,
  closeOnCancel = true,
  className,
  testId = 'confirm-dialog',
}) => {
  const { t } = useTranslation()
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = async () => {
    await onConfirm()
    if (closeOnConfirm) {
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    if (closeOnCancel) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      closeOnOutsideClick={false}
      className={className}
      testId={testId}
    >
      <div className="px-6 pb-6">
        {/* Icon & Content */}
        <div className="flex gap-4">
          {showIcon && (
            <div className="flex-shrink-0">
              <Icon className={cn('h-6 w-6', config.iconColor)} />
            </div>
          )}

          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-text-primary">
              {t(title)}
            </h3>
            {description && (
              <p className="mb-4 text-sm text-text-secondary">
                {t(description)}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading || disabled}
          >
            {t(cancelLabel)}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            disabled={loading || disabled}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {t(confirmLabel)}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

ConfirmDialog.displayName = 'ConfirmDialog'

export default Dialog
