//
// FILE: src/components/sales/SaleForm/sections/NotesSection.tsx
// Notes and Tags Section
//

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormTextarea } from '@/components/forms/FormTextarea/FormTextarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { FileText, Tag, X } from 'lucide-react'
import type { FormSectionProps } from '../SaleForm.types'

export const NotesSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()
  const [tagInput, setTagInput] = useState('')

  const tags = data.tags || []

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      onChange('tags', [...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(
      'tags',
      tags.filter(tag => tag !== tagToRemove)
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
      <div>
        <div className="mb-2 flex items-center gap-2">
          <FileText className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold text-text-primary">
            {t('sales.notes')}
          </h3>
        </div>

        <FormTextarea
          name="notes"
          label={t('sales.notesLabel')}
          value={data.notes || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.notes}
          placeholder={t('sales.notesPlaceholder')}
          disabled={disabled}
          rows={4}
          maxLength={1000}
          showCharCount
        />
      </div>

      {/* Tags */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Tag className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold text-text-primary">
            {t('sales.tags')}
          </h3>
        </div>

        {/* Tag Input */}
        <div className="space-y-2">
          <Label htmlFor="tagInput" className="text-text-primary">
            {t('sales.addTags')}
          </Label>
          <div className="flex gap-2">
            <Input
              id="tagInput"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('sales.tagsPlaceholder')}
              disabled={disabled}
              className="border-border-primary bg-bg-secondary text-text-primary placeholder:text-text-tertiary focus:border-accent"
            />
            <Button
              type="button"
              onClick={handleAddTag}
              disabled={disabled || !tagInput.trim()}
              className="hover:bg-accent/90 bg-accent text-white"
            >
              {t('common.add')}
            </Button>
          </div>
          <p className="text-xs text-text-tertiary">
            {t('sales.pressEnterToAdd')}
          </p>
        </div>

        {/* Tags List */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-accent/10 inline-flex items-center gap-1 rounded-full border border-accent px-3 py-1 text-sm text-accent"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  disabled={disabled}
                  className="hover:text-accent/70 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {tags.length === 0 && (
          <div className="mt-3 rounded-lg border border-dashed border-border-primary bg-bg-tertiary p-4 text-center">
            <p className="text-sm text-text-tertiary">
              {t('sales.noTagsAdded')}
            </p>
          </div>
        )}
      </div>

      {/* Common Tags Suggestions */}
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <p className="mb-2 text-sm font-medium text-text-primary">
          {t('sales.commonTags')}
        </p>
        <div className="flex flex-wrap gap-2">
          {['premium', 'hallmarked', 'gift', 'wholesale', 'urgent'].map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                if (!tags.includes(tag)) {
                  onChange('tags', [...tags, tag])
                }
              }}
              disabled={disabled || tags.includes(tag)}
              className="hover:bg-accent/10 rounded-full border border-border-secondary bg-bg-secondary px-3 py-1 text-xs text-text-secondary hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
