// ============================================================================
// FILE: src/components/ui/form/SearchBar/SearchBar.tsx
// Reusable SearchBar Component with Debounce
// ============================================================================

import * as React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
  onClear?: () => void
  className?: string
  disabled?: boolean
  autoFocus?: boolean
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value,
      onChange,
      placeholder,
      debounceMs = 300,
      onClear,
      className,
      disabled = false,
      autoFocus = false,
    },
    ref
  ) => {
    const { t } = useTranslation()
    const [localValue, setLocalValue] = React.useState(value)
    const timeoutRef = React.useRef<NodeJS.Timeout>()

    // Sync external value changes
    React.useEffect(() => {
      setLocalValue(value)
    }, [value])

    // Debounced onChange
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setLocalValue(newValue)

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        onChange(newValue)
      }, debounceMs)
    }

    const handleClear = () => {
      setLocalValue('')
      onChange('')
      onClear?.()
    }

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    return (
      <div className={cn('relative w-full', className)}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
        <Input
          ref={ref}
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder || t('common.search')}
          disabled={disabled}
          autoFocus={autoFocus}
          className="pl-9 pr-9"
        />
        {localValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }
)

SearchBar.displayName = 'SearchBar'