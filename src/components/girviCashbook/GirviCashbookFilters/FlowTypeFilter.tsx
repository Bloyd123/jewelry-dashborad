// FILE: src/components/girviCashbook/GirviCashbookFilters/FlowTypeFilter.tsx

import * as React       from 'react'
import { useTranslation } from 'react-i18next'
import { StatusFilter, type StatusOption } from '@/components/ui/filters/StatusFilter'

interface FlowTypeFilterProps {
  value?:    string
  onChange:  (value: string | undefined) => void
  className?: string
}

export const FlowTypeFilter = React.forwardRef<
  HTMLButtonElement,
  FlowTypeFilterProps
>(({ value, onChange, className }, ref) => {
  const { t } = useTranslation()

  const options: StatusOption[] = [
    {
      value:   'inflow',
      label:   t('girviCashbook.flowType.inflow', 'Inflow'),
      variant: 'completed',
      showDot: true,
    },
    {
      value:   'outflow',
      label:   t('girviCashbook.flowType.outflow', 'Outflow'),
      variant: 'cancelled',
      showDot: true,
    },
  ]

  return (
    <StatusFilter
      ref={ref}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={t('girviCashbook.filters.flowType', 'Flow Type')}
      className={className}
    />
  )
})
FlowTypeFilter.displayName = 'FlowTypeFilter'