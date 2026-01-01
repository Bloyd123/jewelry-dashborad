// ============================================================================
// FILE: src/components/modules/payment/filters/PartyTypeFilter.tsx
// Party Type Filter (Customer/Supplier)
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Users, Package, MoreHorizontal } from 'lucide-react'
import { TypeFilter, FilterOption } from '@/components/ui/filters/TypeFilter/TypeFilter'

export interface PartyTypeFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const PartyTypeFilter: React.FC<PartyTypeFilterProps> = ({
  value,
  onChange,
  className,
  disabled = false,
}) => {
  const { t } = useTranslation()

  const partyTypeOptions: FilterOption[] = [
    {
      value: 'customer',
      label: t('payment.partyTypes.customer'),
      icon: <Users className="h-4 w-4" />,
    },
    {
      value: 'supplier',
      label: t('payment.partyTypes.supplier'),
      icon: <Package className="h-4 w-4" />,
    },
    {
      value: 'other',
      label: t('payment.partyTypes.other'),
      icon: <MoreHorizontal className="h-4 w-4" />,
    },
  ]

  return (
    <TypeFilter
      options={partyTypeOptions}
      value={value}
      onChange={onChange}
      placeholder={t('payment.filters.selectPartyType')}
      className={className}
      disabled={disabled}
    />
  )
}

PartyTypeFilter.displayName = 'PartyTypeFilter'