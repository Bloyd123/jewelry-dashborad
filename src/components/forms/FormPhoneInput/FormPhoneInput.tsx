// FILE: src/components/forms/FormPhoneInput/FormPhoneInput.tsx
// Theme-based Form Phone Input Component

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Phone, AlertCircle } from 'lucide-react'

interface FormPhoneInputProps {
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
  countryCode?: string
}

export const FormPhoneInput = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder = '9876543210',
  required = false,
  disabled = false,
  className = '',
  countryCode = '+91',
}: FormPhoneInputProps) => {
  const handleChange = (val: string) => {
    // Only allow numbers
    const numericValue = val.replace(/\D/g, '')
    // Limit to 10 digits
    if (numericValue.length <= 10) {
      onChange(name, numericValue)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={name} className="text-text-primary">
          {label}
          {required && <span className="ml-1 text-status-error">*</span>}
        </Label>
      )}

      <div className="relative">
        <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
          <Phone className="h-4 w-4 text-text-tertiary" />
          <span className="text-text-secondary">{countryCode}</span>
          <span className="text-border-primary">|</span>
        </div>

        <Input
          id={name}
          name={name}
          type="tel"
          value={value}
          onChange={e => handleChange(e.target.value)}
          onBlur={() => onBlur?.(name)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={10}
          className={`border-border-primary bg-bg-secondary pl-24 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-accent disabled:bg-bg-tertiary disabled:text-text-tertiary ${error ? 'border-status-error focus:border-status-error focus:ring-status-error' : ''} `}
        />
      </div>

      <div className="text-xs text-text-tertiary">{value.length}/10 digits</div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-status-error">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
