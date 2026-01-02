
// FILE: src/components/forms/FormSwitch/FormSwitch.tsx
// Theme-based Form Switch Component (More Flexible & Reusable)

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { AlertCircle, Info } from 'lucide-react'

interface FormSwitchProps {
  name: string
  label?: string
  description?: string
  checked: boolean
  onChange: (name: string, checked: boolean) => void
  onBlur?: (name: string) => void
  error?: string
  disabled?: boolean
  className?: string
  // Layout options
  layout?: 'horizontal' | 'vertical'
  labelPosition?: 'left' | 'right'
  // Visual options
  size?: 'sm' | 'md' | 'lg'
  // Additional info
  helpText?: string
  required?: boolean
}

export const FormSwitch = ({
  name,
  label,
  description,
  checked,
  onChange,
  onBlur,
  error,
  disabled = false,
  className = '',
  layout = 'horizontal',
  labelPosition = 'left',
  size = 'md',
  helpText,
  required = false,
}: FormSwitchProps) => {
  const switchSizes = {
    sm: 'h-5 w-9 [&>span]:h-4 [&>span]:w-4 [&>span]:data-[state=checked]:translate-x-4',
    md: 'h-6 w-11 [&>span]:h-5 [&>span]:w-5 [&>span]:data-[state=checked]:translate-x-5',
    lg: 'h-7 w-14 [&>span]:h-6 [&>span]:w-6 [&>span]:data-[state=checked]:translate-x-7',
  }

  const handleCheckedChange = (checkedValue: boolean) => {
    onChange(name, checkedValue)
  }

  const renderLabel = () => {
    if (!label) return null

    return (
      <div className="flex-1 space-y-1">
        <Label htmlFor={name} className="text-text-primary">
          {label}
          {required && <span className="ml-1 text-status-error">*</span>}
        </Label>
        {description && (
          <p className="text-sm text-text-tertiary">{description}</p>
        )}
      </div>
    )
  }

  const renderSwitch = () => (
    <Switch
      id={name}
      checked={checked}
      onCheckedChange={handleCheckedChange}
      disabled={disabled}
      className={switchSizes[size]}
      onBlur={() => onBlur?.(name)}
    />
  )

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main Content */}
      <div
        className={`flex gap-4 ${
          layout === 'vertical'
            ? 'flex-col'
            : `items-center ${labelPosition === 'right' ? 'flex-row-reverse' : ''} justify-between`
        }`}
      >
        {renderLabel()}
        {renderSwitch()}
      </div>

      {/* Help Text */}
      {helpText && !error && (
        <div className="flex items-start gap-2 text-sm text-text-secondary">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-status-error">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
