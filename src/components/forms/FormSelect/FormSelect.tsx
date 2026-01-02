
// FILE: src/components/forms/FormSelect/FormSelect.tsx
// Theme-based Form Select Component

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps {
  name: string
  label?: string
  value: string
  onChange: (name: string, value: string) => void
  onBlur?: (name: string) => void
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options: SelectOption[]
  className?: string
}

export const FormSelect = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  options,
  className = '',
}: FormSelectProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={name} className="text-text-primary">
          {label}
          {required && <span className="ml-1 text-status-error">*</span>}
        </Label>
      )}

      <Select
        value={value}
        onValueChange={val => onChange(name, val)}
        disabled={disabled}
      >
        <SelectTrigger
          id={name}
          onBlur={() => onBlur?.(name)}
          className={`border-border-primary bg-bg-secondary text-text-primary focus:border-accent focus:ring-accent disabled:bg-bg-tertiary disabled:text-text-tertiary ${error ? 'border-status-error' : ''} `}
        >
          <SelectValue
            placeholder={placeholder}
            className="text-text-tertiary"
          />
        </SelectTrigger>

        <SelectContent className="border-border-primary bg-bg-secondary">
          {options.map(option => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-text-primary hover:bg-bg-tertiary focus:bg-bg-tertiary"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <div className="flex items-center gap-2 text-sm text-status-error">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
