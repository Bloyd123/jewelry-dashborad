// ============================================================================
// FILE: src/components/forms/FormTextarea/FormTextarea.tsx
// Theme-based Form Textarea Component
// ============================================================================

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'

interface FormTextareaProps {
  name: string
  label?: string
  value: string
  onChange: (name: string, value: string) => void
  onBlur?: (name: string) => void
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  rows?: number
  maxLength?: number
  showCharCount?: boolean
}

export const FormTextarea = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  rows = 4,
  maxLength,
  showCharCount = false,
}: FormTextareaProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={name} className="text-text-primary">
          {label}
          {required && <span className="ml-1 text-status-error">*</span>}
        </Label>
      )}

      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        onBlur={() => onBlur?.(name)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={`resize-none border-border-primary bg-bg-secondary text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-accent disabled:bg-bg-tertiary disabled:text-text-tertiary ${error ? 'border-status-error focus:border-status-error focus:ring-status-error' : ''} `}
      />

      {showCharCount && maxLength && (
        <div className="text-right text-xs text-text-tertiary">
          {value.length} / {maxLength}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-status-error">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
