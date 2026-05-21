// FILE: src/components/scheme/SchemeFilters/SchemeApprovalFilter.tsx

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusFilter } from '@/components/ui/filters/StatusFilter'
import type { StatusOption } from '@/components/ui/filters/StatusFilter'

interface SchemeApprovalFilterProps {
  value?:         string
  onChange:       (value: string | undefined) => void
  showAllOption?: boolean
  className?:     string
}

export const SchemeApprovalFilter = React.forwardRef<
  HTMLButtonElement,
  SchemeApprovalFilterProps
>(({ value, onChange, showAllOption = true, className }, ref) => {
  const { t } = useTranslation()

  const approvalOptions: StatusOption[] = [
    {
      value:   'approved',
      label:   t('scheme.approval.approved'),
      variant: 'active',
      showDot: true,
    },
    {
      value:   'pending',
      label:   t('scheme.approval.pending'),
      variant: 'warning',
      showDot: true,
    },
    {
      value:   'rejected',
      label:   t('scheme.approval.rejected'),
      variant: 'error',
      showDot: true,
    },
  ]

  return (
    <StatusFilter
      ref={ref}
      value={value}
      onChange={onChange}
      options={approvalOptions}
      placeholder={t('scheme.filters.approvalStatus')}
      showAllOption={showAllOption}
      className={className}
    />
  )
})

SchemeApprovalFilter.displayName = 'SchemeApprovalFilter'