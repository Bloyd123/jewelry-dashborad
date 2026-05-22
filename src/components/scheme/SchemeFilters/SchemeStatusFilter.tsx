// FILE: src/components/scheme/SchemeFilters/SchemeStatusFilter.tsx

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusFilter } from '@/components/ui/filters/StatusFilter'
import type { StatusOption } from '@/components/ui/filters/StatusFilter'

interface SchemeStatusFilterProps {
  value?:         string
  onChange:       (value: string | undefined) => void
  showAllOption?: boolean
  className?:     string
}

export const SchemeStatusFilter = React.forwardRef<
  HTMLButtonElement,
  SchemeStatusFilterProps
>(({ value, onChange, showAllOption = true, className }, ref) => {
  const { t } = useTranslation()

  const statusOptions: StatusOption[] = [
    {
      value:   'active',
      label:   t('scheme.status.active'),
      variant: 'active',
      showDot: true,
    },
    {
      value:   'draft',
      label:   t('scheme.status.draft'),
      variant: 'pending',
      showDot: true,
    },
    {
      value:   'paused',
      label:   t('scheme.status.paused'),
      variant: 'warning',
      showDot: true,
    },
    {
      value:   'expired',
      label:   t('scheme.status.expired'),
      variant: 'error',
      showDot: true,
    },
    {
      value:   'archived',
      label:   t('scheme.status.archived'),
      variant: 'inactive',
      showDot: true,
    },
  ]

  return (
    <StatusFilter
      ref={ref}
      value={value}
      onChange={onChange}
      options={statusOptions}
      placeholder={t('filters.status')}
      showAllOption={showAllOption}
      className={className}
    />
  )
})

SchemeStatusFilter.displayName = 'SchemeStatusFilter'