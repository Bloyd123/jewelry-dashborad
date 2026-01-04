// FILE: src/components/purchase/PurchaseFilters/PurchaseApprovalStatusFilter.tsx
// Approval Status Filter

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  StatusFilter,
  type StatusOption,
} from '@/components/ui/filters/StatusFilter'

interface PurchaseApprovalStatusFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const PurchaseApprovalStatusFilter = React.forwardRef<
  HTMLButtonElement,
  PurchaseApprovalStatusFilterProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  const approvalOptions: StatusOption[] = [
    {
      value: 'pending',
      label: t('purchase.approvalStatus.pending'),
      variant: 'pending',
      showDot: true,
    },
    {
      value: 'approved',
      label: t('purchase.approvalStatus.approved'),
      variant: 'completed',
      showDot: true,
    },
    {
      value: 'rejected',
      label: t('purchase.approvalStatus.rejected'),
      variant: 'cancelled',
      showDot: true,
    },
  ]

  return (
    <StatusFilter
      ref={ref}
      value={value}
      onChange={onChange}
      options={approvalOptions}
      placeholder={t('purchase.filters.approvalStatus')}
      className={className}
    />
  )
})

PurchaseApprovalStatusFilter.displayName = 'PurchaseApprovalStatusFilter'
