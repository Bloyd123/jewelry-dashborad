// FILE: src/components/auth/2fa/TwoFactorCodeInput.tsx
// 6-Digit Code Input Component

import { useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

// TYPES

export interface TwoFactorCodeInputProps {
  value: string
  onChange: (value: string) => void
  onComplete?: () => void
  error?: string | null
  disabled?: boolean
  autoFocus?: boolean
}

// COMPONENT

export const TwoFactorCodeInput: React.FC<TwoFactorCodeInputProps> = ({
  value,
  onChange,
  onComplete,
  error,
  disabled = false,
  autoFocus = true,
}) => {
  const { t } = useTranslation()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const digits = value.split('').concat(Array(6 - value.length).fill(''))

  // EFFECTS

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])
  const hasCalledRef = useRef(false)
  useEffect(() => {
    // ✅ Only call once when reaching 6 digits
    if (
      value.length === 6 &&
      onComplete &&
      !disabled &&
      !hasCalledRef.current
    ) {
      hasCalledRef.current = true
      onComplete()
    }

    // ✅ Reset when code is cleared/changed
    if (value.length < 6) {
      hasCalledRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, disabled])

  // HANDLERS

  const handleChange = (index: number, digit: string) => {
    if (disabled) return

    // Only allow digits
    const sanitized = digit.replace(/[^0-9]/g, '')
    if (!sanitized && digit !== '') return

    const newDigits = [...digits]
    newDigits[index] = sanitized.slice(-1) // Take last character only

    const newValue = newDigits.join('').slice(0, 6)
    onChange(newValue)

    // Auto-advance to next input
    if (sanitized && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus()
      }
      // Clear current digit
      const newDigits = [...digits]
      newDigits[index] = ''
      const newValue = newDigits.join('').replace(/\s/g, '')
      onChange(newValue)
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return

    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const sanitized = pastedData.replace(/[^0-9]/g, '').slice(0, 6)

    if (sanitized) {
      onChange(sanitized)

      // Focus last filled input or last input
      const focusIndex = Math.min(sanitized.length, 5)
      inputRefs.current[focusIndex]?.focus()
    }
  }

  const handleFocus = (index: number) => {
    // Select all text on focus
    inputRefs.current[index]?.select()
  }

  // RENDER

  return (
    <div className="space-y-2">
      <div className="flex justify-center gap-2">
        {digits.map((digit, index) => (
          <Input
            key={index}
            ref={el => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={cn(
              'h-12 w-12 text-center text-lg font-semibold',
              'rounded-lg border-2 transition-all',
              'bg-bg-secondary text-text-primary',
              error
                ? 'border-status-error'
                : 'border-border-primary focus:border-accent',
              disabled && 'cursor-not-allowed opacity-50',
              digit && 'border-accent'
            )}
            aria-label={t('auth.2fa.digitPosition', { position: index + 1 })}
          />
        ))}
      </div>

      {/* Helper text or error */}
      {error ? (
        <p className="text-center text-xs text-status-error">{error}</p>
      ) : (
        <p className="text-center text-xs text-text-tertiary">
          {t('auth.2fa.enter6DigitCode')}
        </p>
      )}
    </div>
  )
}
