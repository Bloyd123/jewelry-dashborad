// ============================================================================
// FILE: src/components/modules/payment/filters/PaymentSearchBar.tsx
// Payment Search Bar Component
// ============================================================================

import * as React from 'react'
import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface PaymentSearchBarProps {
  value?: string
  onChange: (value: string | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const PaymentSearchBar: React.FC<PaymentSearchBarProps> = ({
  value = '',
  onChange,
  placeholder,
  className,
  disabled = false,
}) => {
  const { t } = useTranslation()
  const [internalValue, setInternalValue] = React.useState(value)

  // Sync internal value with prop value
  React.useEffect(() => {
    setInternalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInternalValue(newValue)
    onChange(newValue || undefined)
  }

  const handleClear = () => {
    setInternalValue('')
    onChange(undefined)
  }

  return (
    <div className={cn('relative w-full', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
      <Input
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder || t('payment.filters.searchPlaceholder')}
        disabled={disabled}
        className="pl-10 pr-10"
      />
      {internalValue && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          disabled={disabled}
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-bg-tertiary"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

PaymentSearchBar.displayName = 'PaymentSearchBar'
