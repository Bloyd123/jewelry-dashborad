// FILE: src/components/customer/CustomerForm/sections/NotesTagsSection.tsx
// Notes & Tags Section


import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormTextarea } from '@/components/forms/FormTextarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Plus } from 'lucide-react'
import type { FormSectionProps } from '@/components/customer/CustomerForm/CustomerForm.types'

export const NotesTagsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()
  const [tagInput, setTagInput] = useState('')

  const handleAddTag = () => {
    if (!tagInput.trim()) return

    const currentTags = data.tags || []
    if (currentTags.includes(tagInput.trim())) {
      setTagInput('')
      return
    }

    onChange('tags', [...currentTags, tagInput.trim()])
    setTagInput('')
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
      <FormTextarea
        name="notes"
        label={t('customer.notes')}
        value={data.notes || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.notes}
        placeholder={t('customer.notesPlaceholder')}
        disabled={disabled}
        maxLength={1000}
        rows={4}
        showCharCount
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          {t('customer.tags')}
        </label>

        {/* Tag Input */}
        <div className="mb-3 flex gap-2">
          <Input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('customer.addTag')}
            disabled={disabled}
            maxLength={50}
            className="flex-1 border-border-primary bg-bg-secondary text-text-primary"
          />
          <Button
            type="button"
            onClick={handleAddTag}
            disabled={!tagInput.trim() || disabled}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Tag List */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-accent/10 border-accent/20 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm text-accent"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  disabled={disabled}
                  className="hover:bg-accent/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {errors.tags && (
          <p className="mt-2 text-sm text-status-error">{errors.tags}</p>
        )}
      </div>
    </div>
  )
}
