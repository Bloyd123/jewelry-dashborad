// FILE: src/components/scheme/SchemeFilters/SchemeSearchBar.tsx

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { SearchBar } from '@/components/ui/SearchBar'

interface SchemeSearchBarProps {
  value:      string
  onChange:   (value: string) => void
  onClear?:   () => void
  className?: string
  disabled?:  boolean
}

export const SchemeSearchBar = React.forwardRef<
  HTMLInputElement,
  SchemeSearchBarProps
>(({ value, onChange, onClear, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  return (
    <SearchBar
      ref={ref}
      value={value}
      onChange={onChange}
      onClear={onClear}
      placeholder={t('scheme.search.placeholder')}
      debounceMs={300}
      disabled={disabled}
      className={className}
    />
  )
})

SchemeSearchBar.displayName = 'SchemeSearchBar'