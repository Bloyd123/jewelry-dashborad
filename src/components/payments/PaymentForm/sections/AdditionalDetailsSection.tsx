// ============================================================================
// FILE: src/components/payment/PaymentForm/sections/AdditionalDetailsSection.tsx
// Additional Details Section (Notes, Tags, Attachments)
// ============================================================================

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormTextarea } from '@/components/forms/FormTextarea/FormTextarea'
import { Upload, X, FileText } from 'lucide-react'
import type { FormSectionProps } from '../PaymentForm.types'

export const AdditionalDetailsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()
  const [tagInput, setTagInput] = useState('')

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = data.tags || []
      onChange('tags', [...currentTags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (index: number) => {
    const currentTags = data.tags || []
    onChange(
      'tags',
      currentTags.filter((_, i) => i !== index)
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="space-y-4">
      {/* Notes */}
      <FormTextarea
        name="notes"
        label={t('payment.notes')}
        value={data.notes || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.notes}
        placeholder={t('payment.notesPlaceholder')}
        disabled={disabled}
        rows={4}
        maxLength={1000}
        showCharCount
      />

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t('payment.tags')}
        </label>

        {/* Tag Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder={t('payment.addTag')}
            className="flex-1 rounded-lg border border-border-primary bg-bg-secondary px-4 py-2 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary"
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={disabled || !tagInput.trim()}
            className="hover:bg-accent/90 rounded-lg bg-accent px-4 py-2 text-white disabled:opacity-50"
          >
            {t('common.add')}
          </button>
        </div>

        {/* Tags Display */}
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
                  onClick={() => handleRemoveTag(index)}
                  disabled={disabled}
                  className="hover:text-accent/70 disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Attachments */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t('payment.attachments')}
        </label>

        <div className="rounded-lg border-2 border-dashed border-border-primary bg-bg-secondary p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-text-tertiary" />
          <p className="mt-2 text-sm text-text-primary">
            {t('payment.uploadFiles')}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">
            {t('payment.supportedFormats')}
          </p>

          <button
            type="button"
            disabled={disabled}
            className="hover:bg-bg-tertiary/80 mt-4 rounded-lg bg-bg-tertiary px-4 py-2 text-sm text-text-primary disabled:opacity-50"
          >
            {t('common.browse')}
          </button>
        </div>

        {/* Uploaded Files List (if any) */}
        {data.attachments && data.attachments.length > 0 && (
          <div className="space-y-2">
            {data.attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border-primary bg-bg-secondary p-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-text-tertiary" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {file.name}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={disabled}
                  className="hover:text-status-error/70 text-status-error disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
