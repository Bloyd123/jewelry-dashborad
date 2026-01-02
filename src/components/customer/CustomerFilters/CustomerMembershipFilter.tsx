// FILE: src/components/customer/CustomerFilters/CustomerMembershipFilter.tsx
// Customer Membership Tier Filter - Uses Reusable TypeFilter

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TypeFilter } from '@/components/ui/filters/TypeFilter'
import type { FilterOption } from '@/components/ui/filters/TypeFilter'
import { Award, Medal, Trophy, Crown } from 'lucide-react'

// TYPES

interface CustomerMembershipFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  showAllOption?: boolean
  className?: string
  disabled?: boolean
}

// CUSTOMER MEMBERSHIP FILTER COMPONENT

export const CustomerMembershipFilter = React.forwardRef<
  HTMLButtonElement,
  CustomerMembershipFilterProps
>(
  (
    { value, onChange, showAllOption = true, className, disabled = false },
    ref
  ) => {
    const { t } = useTranslation()

    // Membership Tier Options
    const membershipTierOptions: FilterOption[] = [
      {
        value: 'platinum',
        label: t('customer.tier.platinum'),
        icon: <Crown className="h-4 w-4 text-accent" />,
      },
      {
        value: 'gold',
        label: t('customer.tier.gold'),
        icon: <Trophy className="h-4 w-4 text-status-warning" />,
      },
      {
        value: 'silver',
        label: t('customer.tier.silver'),
        icon: <Medal className="h-4 w-4 text-text-tertiary" />,
      },
      {
        value: 'standard',
        label: t('customer.tier.standard'),
        icon: <Award className="h-4 w-4 text-text-secondary" />,
      },
    ]

    return (
      <TypeFilter
        ref={ref}
        options={membershipTierOptions}
        value={value}
        onChange={onChange}
        placeholder={t('customer.filters.membershipTier')}
        showAllOption={showAllOption}
        allOptionLabel={t('customer.filters.allTiers')}
        className={className}
        disabled={disabled}
      />
    )
  }
)

CustomerMembershipFilter.displayName = 'CustomerMembershipFilter'
