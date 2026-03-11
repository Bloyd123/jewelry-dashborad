// FILE: src/components/customer/CustomerFilters/CustomerVIPFilter.tsx

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusFilter } from '@/components/ui/filters/StatusFilter'
import type { StatusOption } from '@/components/ui/filters/StatusFilter'


interface CustomerVIPFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  showAllOption?: boolean
  className?: string
}

export const CustomerVIPFilter = React.forwardRef<
  HTMLButtonElement,
  CustomerVIPFilterProps
>(({ value, onChange, showAllOption = true, className }, ref) => {
  const { t } = useTranslation()

  const vipOptions: StatusOption[] = [
    {
      value: 'vip',
      label: t('filters.vipOnly'),
      variant: 'active',
      showDot: true,
    },
    {
      value: 'non_vip',
      label: t('filters.nonVIP'),
      variant: 'inactive',
      showDot: true,
    },
  ]

  return (
    <StatusFilter
      ref={ref}
      value={value}
      onChange={onChange}
      options={vipOptions}
      placeholder={t('filters.vipStatus')}
      showAllOption={showAllOption}
      className={className}
    />
  )
})

CustomerVIPFilter.displayName = 'CustomerVIPFilter'
