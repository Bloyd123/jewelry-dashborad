// FILE: src/components/girviCashbook/GirviCashbookFilters/EntryTypeFilter.tsx

import * as React       from 'react'
import { useTranslation } from 'react-i18next'
import { TypeFilter, type FilterOption } from '@/components/ui/filters/TypeFilter'
import { ENTRY_TYPE_LABELS } from '@/validators/girviCashbookValidation'

interface EntryTypeFilterProps {
  value?:    string
  onChange:  (value: string | undefined) => void
  className?: string
}

export const EntryTypeFilter = React.forwardRef<
  HTMLButtonElement,
  EntryTypeFilterProps
>(({ value, onChange, className }, ref) => {
  const { t } = useTranslation()

  const options: FilterOption[] = Object.entries(ENTRY_TYPE_LABELS).map(
    ([val, label]) => ({ value: val, label })
  )

  return (
    <TypeFilter
      ref={ref}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={t('girviCashbook.filters.entryType', 'Entry Type')}
      className={className}
    />
  )
})
EntryTypeFilter.displayName = 'EntryTypeFilter'