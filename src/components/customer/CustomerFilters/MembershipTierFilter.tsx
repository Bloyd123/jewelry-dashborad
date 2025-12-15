// ============================================================================
// FILE: src/features/customer/components/CustomerFilters/MembershipTierFilter.tsx
// Membership Tier Dropdown Filter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setMembershipTierFilter, selectMembershipTierFilter } from '@/store/slices/customerSlice'
import type { MembershipTier } from '@/types'
import { Badge } from '@/components/ui/data-display/Badge'

const membershipTiers: { value: MembershipTier; label: string; color: string }[] = [
  { value: 'standard', label: 'customer.tiers.standard', color: 'default' },
  { value: 'silver', label: 'customer.tiers.silver', color: 'info' },
  { value: 'gold', label: 'customer.tiers.gold', color: 'warning' },
  { value: 'platinum', label: 'customer.tiers.platinum', color: 'accent' },
]

export const MembershipTierFilter: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const selectedTier = useAppSelector(selectMembershipTierFilter)

  const handleChange = (value: string) => {
    if (value === 'all') {
      dispatch(setMembershipTierFilter(undefined))
    } else {
      dispatch(setMembershipTierFilter(value as MembershipTier))
    }
  }

  return (
    <Select value={selectedTier || 'all'} onValueChange={handleChange}>
      <SelectTrigger className="w-full md:w-[180px]">
        <SelectValue placeholder={t('filters.tier')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('all')}</SelectItem>
        {membershipTiers.map((tier) => (
          <SelectItem key={tier.value} value={tier.value}>
            <div className="flex items-center gap-2">
              <Badge variant={tier.color as any} size="sm">
                {t(tier.label)}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}