// FILE: src/components/shared/sections/AdditionalDetailsSection.tsx
// Reusable Additional Details Section (Notes, Tags, Attachments)
// Used in: PaymentForm, GirviForm, and any future module forms

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, X, FileText, Tag } from 'lucide-react'

// ─── Props Interface ───────────────────────────────────────────────────────────

interface AdditionalDetailsSectionProps {
  data: {
    notes?: string
    tags?: string[]
    attachments?: File[]
    [key: string]: any
  }
  errors: Record<string, string>
  onChange: (name: string, value: any) => void
  onBlur?: (name: string) => void
  disabled?: boolean
}

export const AdditionalDetailsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: AdditionalDetailsSectionProps) => {
  const { t } = useTranslation()
  const [tagInput, setTagInput] = useState('')

  // ── Tag Handlers ──────────────────────────────────────────────────────────────

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

  // ── File Handlers ─────────────────────────────────────────────────────────────

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

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024)        return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const notesLength = (data.notes || '').length

  return (
    <div className="space-y-6">

      {/* ── Notes ──────────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium text-text-primary">
          {t('common.notes')}
        </label>

        <textarea
          id="notes"
          name="notes"
          value={data.notes || ''}
          onChange={e => onChange('notes', e.target.value)}
          onBlur={() => onBlur?.('notes')}
          disabled={disabled}
          placeholder={t('common.notesPlaceholder')}
          rows={4}
          maxLength={1000}
          className={`w-full resize-none rounded-lg border bg-bg-secondary px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary disabled:text-text-tertiary ${
            errors.notes ? 'border-status-error' : 'border-border-primary'
          }`}
        />

        <div className="flex items-center justify-between">
          {errors.notes ? (
            <p className="text-sm text-status-error">⚠️ {errors.notes}</p>
          ) : (
            <span />
          )}
          <span className={`text-xs ${notesLength > 900 ? 'text-status-warning' : 'text-text-tertiary'}`}>
            {notesLength}/1000
          </span>
        </div>
      </div>

      {/* ── Tags ───────────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t('common.tags')}
        </label>

        {/* Tag Input Row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Tag className="h-4 w-4 text-text-tertiary" />
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              disabled={disabled}
              placeholder={t('common.addTagPlaceholder')}
              maxLength={50}
              className="h-10 w-full rounded-lg border border-border-primary bg-bg-secondary pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary"
            />
          </div>
          <button
            type="button"
            onClick={handleAddTag}
            disabled={disabled || !tagInput.trim()}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('common.add')}
          </button>
        </div>

        <p className="text-xs text-text-tertiary">{t('common.tagHint')}</p>

        {/* Tags Display */}
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

      {/* ── Attachments ────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t('common.attachments')}
        </label>

        {/* Drop Zone */}
        {!disabled && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="group rounded-lg border-2 border-dashed border-border-primary bg-bg-secondary p-6 text-center transition-all hover:border-accent hover:bg-accent/5"
          >
            <Upload className="mx-auto h-10 w-10 text-text-tertiary group-hover:text-accent" />
            <p className="mt-2 text-sm font-medium text-text-primary">
              {t('common.dropFilesHere')}
            </p>
            <p className="mt-1 text-xs text-text-tertiary">
              {t('common.supportedFormats')}
            </p>

            <label className="mt-4 inline-block cursor-pointer rounded-lg bg-bg-tertiary px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-tertiary/80 transition-colors">
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

        {/* Uploaded Files List */}
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
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="ml-2 flex-shrink-0 rounded-lg p-1.5 text-status-error hover:bg-status-error/10 transition-colors"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}