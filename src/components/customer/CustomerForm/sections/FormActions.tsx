// ============================================================================
// FILE: src/components/customer/CustomerForm/sections/FormActions.tsx
// Form Actions Component (Submit/Cancel Buttons)
// ============================================================================

import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Save, X, Loader2 } from 'lucide-react'

interface FormActionsProps {
  onSubmit: () => void
  onCancel?: () => void
  isLoading?: boolean
  submitLabel?: string
  cancelLabel?: string
  disabled?: boolean
}

export const FormActions = ({
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel,
  cancelLabel,
  disabled = false,
}: FormActionsProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex justify-end gap-3">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading || disabled}
          className="min-w-[120px]"
        >
          <X className="mr-2 h-4 w-4" />
          {cancelLabel || t('common.cancel')}
        </Button>
      )}

      <Button
        type="button"
        onClick={onSubmit}
        disabled={isLoading || disabled}
        className="min-w-[120px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('common.saving')}
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {submitLabel || t('common.save')}
          </>
        )}
      </Button>
    </div>
  )
}
