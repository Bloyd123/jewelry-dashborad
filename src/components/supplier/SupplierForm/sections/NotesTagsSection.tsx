// 
// FILE: src/components/supplier/SupplierForm/sections/NotesTagsSection.tsx
// Notes & Tags Section
// 

import { useTranslation } from 'react-i18next'
import { FormTextarea } from '@/components/forms/FormTextarea/FormTextarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { X, Plus } from 'lucide-react'
import type { SectionProps } from '../SupplierForm.types'
import { useState } from 'react'

export const NotesTagsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: SectionProps) => {
  const { t } = useTranslation()
  const [tagInput, setTagInput] = useState('')

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = data.tags || []
      if (!currentTags.includes(tagInput.trim())) {
        onChange('tags', [...currentTags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = data.tags || []
    onChange(
      'tags',
      currentTags.filter(tag => tag !== tagToRemove)
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
        label={t('suppliers.notes')}
        value={data.notes || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.notes}
        placeholder={t('suppliers.notesPlaceholder')}
        disabled={disabled}
        rows={4}
        maxLength={1000}
        showCharCount
      />

      {/* Internal Notes */}
      <FormTextarea
        name="internalNotes"
        label={t('suppliers.internalNotes')}
        value={data.internalNotes || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.internalNotes}
        placeholder={t('suppliers.internalNotesPlaceholder')}
        disabled={disabled}
        rows={4}
        maxLength={1000}
        showCharCount
      />

      {/* Tags */}
      <div className="space-y-2">
        <Label className="text-text-primary">{t('suppliers.tags')}</Label>

        {/* Tag Input */}
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('suppliers.tagsPlaceholder')}
            disabled={disabled}
            maxLength={50}
            className="border-border-primary bg-bg-secondary text-text-primary placeholder:text-text-tertiary"
          />
          <Button
            type="button"
            onClick={handleAddTag}
            disabled={disabled || !tagInput.trim()}
            size="icon"
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Tag List */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1 rounded-md border border-border-primary bg-bg-tertiary px-3 py-1.5 text-sm text-text-primary"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  disabled={disabled}
                  className="text-text-tertiary hover:text-status-error disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {errors.tags && (
          <p className="text-sm text-status-error">{errors.tags}</p>
        )}
      </div>
    </div>
  )
}
