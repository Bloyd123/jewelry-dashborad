
// FILE: src/components/purchase/PurchaseForm/sections/AdditionalInfoSection.tsx
// Additional Info Section

import { useTranslation } from 'react-i18next'
import { FormTextarea } from '@/components/forms/FormTextarea/FormTextarea'
import { FormDatePicker } from '@/components/forms/FormDatePicker/FormDatePicker'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import type { FormSectionProps } from '../PurchaseForm.types'
import { Label } from '@/components/ui/label'

export const AdditionalInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <FormDatePicker
        name="expectedDate"
        label={t('purchase.expectedDeliveryDate')}
        value={data.expectedDate || ''}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />

      <FormInput
        name="deliveryAddress"
        label={t('purchase.deliveryAddress')}
        value={data.deliveryAddress || ''}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />

      <FormTextarea
        name="notes"
        label={t('purchase.notes')}
        value={data.notes || ''}
        onChange={onChange}
        onBlur={onBlur}
        rows={3}
        disabled={disabled}
      />

      <FormTextarea
        name="internalNotes"
        label={t('purchase.internalNotes')}
        value={data.internalNotes || ''}
        onChange={onChange}
        onBlur={onBlur}
        rows={2}
        disabled={disabled}
      />

      <div className="space-y-2">
        <Label className="text-text-primary">{t('purchase.tags')}</Label>
        <input
          type="text"
          placeholder={t('purchase.tagsPlaceholder')}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              e.preventDefault()
              const newTag = e.currentTarget.value.trim()
              const currentTags = data.tags || []
              if (!currentTags.includes(newTag)) {
                onChange('tags', [...currentTags, newTag])
              }
              e.currentTarget.value = ''
            }
          }}
          disabled={disabled}
          className="w-full rounded-md border border-border-primary bg-bg-secondary px-3 py-2 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:bg-bg-tertiary"
        />
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-accent/10 inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm text-accent"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => {
                    const newTags = data.tags?.filter((_, i) => i !== index)
                    onChange('tags', newTags)
                  }}
                  disabled={disabled}
                  className="hover:text-status-error"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
