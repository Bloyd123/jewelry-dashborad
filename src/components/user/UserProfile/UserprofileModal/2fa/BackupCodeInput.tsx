// FILE: src/components/auth/2fa/BackupCodeInput.tsx
// Backup Code Input Component (XXXX-XXXX-XXXX format)

import { useState, ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// TYPES

export interface BackupCodeInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  error?: string | null
  disabled?: boolean
  label?: string
  placeholder?: string
}

// COMPONENT

export const BackupCodeInput: React.FC<BackupCodeInputProps> = ({
  value,
  onChange,
  onSubmit,
  error,
  disabled = false,
  label,
  placeholder = 'XXXX-XXXX-XXXX',
}) => {
  const { t } = useTranslation()
  const [focused, setFocused] = useState(false)

  // HELPERS

  const formatBackupCode = (input: string): string => {
    // Remove all non-alphanumeric characters
    const cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, '')

    // Split into groups of 4 and join with dashes
    const groups = cleaned.match(/.{1,4}/g) || []
    return groups.join('-').slice(0, 14) // Max length: XXXX-XXXX-XXXX
  }

  // HANDLERS

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const formatted = formatBackupCode(e.target.value)
    onChange(formatted)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (e.key === 'Enter' && value.length === 14 && onSubmit) {
      e.preventDefault()
      onSubmit()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return

    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const formatted = formatBackupCode(pastedData)
    onChange(formatted)
  }

  // RENDER

  const isComplete = value.length === 14
  const showError = error && !focused

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'font-mono text-lg tracking-wider',
            showError && 'border-status-error focus:ring-status-error',
            isComplete && !error && 'border-status-success',
            'text-center'
          )}
          maxLength={14}
        />

        {/* Character count indicator */}
        {focused && (
          <div className="absolute -bottom-5 right-0 text-xs text-text-tertiary">
            {value.length}/14
          </div>
        )}
      </div>

      {/* Helper text or error */}
      {showError ? (
        <p className="text-xs text-status-error">{error}</p>
      ) : (
        <div className="space-y-1">
          <p className="text-xs text-text-tertiary">
            {t('auth.2fa.backupCodeFormat')}
          </p>
          {value.length > 0 && value.length < 14 && (
            <p className="text-xs text-status-warning">
              {t('auth.2fa.backupCodeIncomplete')}
            </p>
          )}
          {isComplete && !error && (
            <p className="text-xs text-status-success">
              {t('auth.2fa.backupCodeComplete')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
