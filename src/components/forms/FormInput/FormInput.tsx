
// FILE: src/components/forms/FormInput/FormInput.tsx
// Theme-based Form Input Component
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'

interface FormInputProps {
  name: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel'
  value: string | number
  onChange: (name: string, value: string | number) => void
  onBlur?: (name: string) => void
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  maxLength?: number
  minLength?: number
}

export const FormInput = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  maxLength,
  minLength,
}: FormInputProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={name} className="text-text-primary">
          {label}
          {required && <span className="ml-1 text-status-error">*</span>}
        </Label>
      )}

      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        onBlur={() => onBlur?.(name)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        className={`border-border-primary bg-bg-secondary text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-accent disabled:bg-bg-tertiary disabled:text-text-tertiary ${error ? 'border-status-error focus:border-status-error focus:ring-status-error' : ''} `}
      />

      {error && (
        <div className="flex items-center gap-2 text-sm text-status-error">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
