// FILE: src/components/scheme/SchemeFilters/SchemeTypeFilter.tsx

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TypeFilter } from '@/components/ui/filters/TypeFilter'
import type { FilterOption } from '@/components/ui/filters/TypeFilter'
import { Coins, CreditCard, CalendarClock, Star, Settings } from 'lucide-react'

interface SchemeTypeFilterProps {
  value?:          string
  onChange:        (value: string | undefined) => void
  showAllOption?:  boolean
  className?:      string
  disabled?:       boolean
}

export const SchemeTypeFilter = React.forwardRef<
  HTMLButtonElement,
  SchemeTypeFilterProps
>(
  (
    { value, onChange, showAllOption = true, className, disabled = false },
    ref
  ) => {
    const { t } = useTranslation()

    const schemeTypeOptions: FilterOption[] = [
      {
        value: 'gold_saving',
        label: t('scheme.type.goldSaving'),
        icon:  <Coins className="h-4 w-4 text-status-warning" />,
      },
      {
        value: 'installment',
        label: t('scheme.type.installment'),
        icon:  <CreditCard className="h-4 w-4 text-status-info" />,
      },
      {
        value: 'advance_booking',
        label: t('scheme.type.advanceBooking'),
        icon:  <CalendarClock className="h-4 w-4 text-accent" />,
      },
      {
        value: 'festival_scheme',
        label: t('scheme.type.festival'),
        icon:  <Star className="h-4 w-4 text-status-success" />,
      },
      {
        value: 'custom',
        label: t('scheme.type.custom'),
        icon:  <Settings className="h-4 w-4 text-text-secondary" />,
      },
    ]

    return (
      <TypeFilter
        ref={ref}
        options={schemeTypeOptions}
        value={value}
        onChange={onChange}
        placeholder={t('scheme.filters.schemeType')}
        showAllOption={showAllOption}
        allOptionLabel={t('scheme.filters.allTypes')}
        className={className}
        disabled={disabled}
      />
    )
  }
)

SchemeTypeFilter.displayName = 'SchemeTypeFilter'