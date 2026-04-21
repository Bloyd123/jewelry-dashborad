// FILE: src/components/girvi/GirviForm/sections/AdditionalDetailsSection.tsx

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, X, FileText, Tag, Lock } from 'lucide-react'
import { Input }    from '@/components/ui/input'
import { Label }    from '@/components/ui/label'
import { Button }   from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { GirviFormSectionProps } from '../GirviForm.types'

export const AdditionalDetailsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: GirviFormSectionProps) => {
  const { t } = useTranslation()
  const [tagInput, setTagInput] = useState('')

  // ── Tag handlers ────────────────────────────────────────────────────────────
  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (!trimmed) return
    const current = data.tags || []
    if (current.includes(trimmed)) {
      setTagInput('')
      return
    }
    onChange('tags', [...current, trimmed])
    setTagInput('')
  }

  const handleRemoveTag = (index: number) => {
    onChange('tags', (data.tags || []).filter((_, i) => i !== index))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
    if (e.key === 'Backspace' && !tagInput && (data.tags || []).length > 0) {
      onChange('tags', (data.tags || []).slice(0, -1))
    }
  }

  // ── File handlers ────────────────────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    onChange('attachments', [...(data.attachments || []), ...files])
    e.target.value = ''
  }

  const handleRemoveFile = (index: number) => {
    onChange('attachments', (data.attachments || []).filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (disabled) return
    const files = Array.from(e.dataTransfer.files)
    if (files.length) onChange('attachments', [...(data.attachments || []), ...files])
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const notesLength         = (data.notes        || '').length
  const internalNotesLength = (data.internalNotes || '').length

  return (
    <div className="space-y-6">

      {/* ── Notes ── */}
      <div className="space-y-1.5">
        <Label htmlFor="girvi-notes">{t('girvi.notes')}</Label>
        <p className="text-xs text-text-tertiary">{t('girvi.notesHint')}</p>
        <Textarea
          id="girvi-notes"
          name="notes"
          value={data.notes || ''}
          onChange={e => onChange('notes', e.target.value)}
          onBlur={() => onBlur?.('notes')}
          disabled={disabled}
          placeholder={t('girvi.notesPlaceholder')}
          rows={3}
          maxLength={1000}
          className={`resize-none ${errors.notes ? 'border-status-error' : ''}`}
        />
        <div className="flex items-center justify-between">
          {errors.notes
            ? <p className="text-sm text-status-error">{errors.notes}</p>
            : <span />
          }
          <span className={`text-xs ${notesLength > 900 ? 'text-status-warning' : 'text-text-tertiary'}`}>
            {notesLength}/1000
          </span>
        </div>
      </div>

      {/* ── Internal Notes ── */}
      <div className="space-y-1.5">
        <Label htmlFor="girvi-internal-notes" className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-text-tertiary" />
          {t('girvi.internalNotes')}
          <span className="rounded-full bg-bg-tertiary px-2 py-0.5 text-xs text-text-tertiary">
            {t('girvi.staffOnly')}
          </span>
        </Label>
        <p className="text-xs text-text-tertiary">{t('girvi.internalNotesHint')}</p>
        <Textarea
          id="girvi-internal-notes"
          name="internalNotes"
          value={data.internalNotes || ''}
          onChange={e => onChange('internalNotes', e.target.value)}
          onBlur={() => onBlur?.('internalNotes')}
          disabled={disabled}
          placeholder={t('girvi.internalNotesPlaceholder')}
          rows={3}
          maxLength={1000}
          className={`resize-none ${errors.internalNotes ? 'border-status-error' : ''}`}
        />
        <div className="flex items-center justify-between">
          {errors.internalNotes
            ? <p className="text-sm text-status-error">⚠️ {errors.internalNotes}</p>
            : <span />
          }
          <span className={`text-xs ${internalNotesLength > 900 ? 'text-status-warning' : 'text-text-tertiary'}`}>
            {internalNotesLength}/1000
          </span>
        </div>
      </div>

      {/* ── Tags ── */}
      <div className="space-y-1.5">
        <Label>{t('girvi.tags')}</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Tag className="h-4 w-4 text-text-tertiary" />
            </div>
            <Input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              disabled={disabled}
              placeholder={t('girvi.addTagPlaceholder')}
              maxLength={50}
              className="pl-10"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddTag}
            disabled={disabled || !tagInput.trim()}
          >
            {t('common.add')}
          </Button>
        </div>
        <p className="text-xs text-text-tertiary">{t('girvi.tagHint')}</p>

        {(data.tags || []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(data.tags || []).map((tag, index) => (
              <span
                key={index}
                className="bg-accent/10 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-accent"
              >
                {tag}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="rounded-full hover:text-accent/60 focus:outline-none"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>{t('girvi.attachments')}</Label>
        <p className="text-xs text-text-tertiary">{t('girvi.attachmentsHint')}</p>

        {!disabled && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="group cursor-pointer rounded-lg border-2 border-dashed border-border-primary bg-bg-secondary p-6 text-center transition-all hover:border-accent hover:bg-accent/5"
          >
            <Upload className="mx-auto h-10 w-10 text-text-tertiary group-hover:text-accent" />
            <p className="mt-2 text-sm font-medium text-text-primary">
              {t('girvi.dropFilesHere')}
            </p>
            <p className="mt-1 text-xs text-text-tertiary">
              {t('girvi.supportedFormats')}
            </p>
            <label className="mt-4 inline-block cursor-pointer rounded-lg bg-bg-tertiary px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-tertiary/80">
              {t('common.browse')}
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="sr-only"
              />
            </label>
          </div>
        )}

        {(data.attachments || []).length > 0 && (
          <div className="space-y-2">
            {(data.attachments || []).map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border-primary bg-bg-secondary p-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {file.name}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                {!disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                    className="ml-2 flex-shrink-0 text-status-error hover:bg-status-error/10 hover:text-status-error"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}