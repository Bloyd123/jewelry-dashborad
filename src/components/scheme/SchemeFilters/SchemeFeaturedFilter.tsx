// FILE: src/components/scheme/SchemeFilters/SchemeFeaturedFilter.tsx

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusFilter } from '@/components/ui/filters/StatusFilter'
import type { StatusOption } from '@/components/ui/filters/StatusFilter'

interface SchemeFeaturedFilterProps {
  value?:         string
  onChange:       (value: string | undefined) => void
  showAllOption?: boolean
  className?:     string
}

export const SchemeFeaturedFilter = React.forwardRef<
  HTMLButtonElement,
  SchemeFeaturedFilterProps
>(({ value, onChange, showAllOption = true, className }, ref) => {
  const { t } = useTranslation()

  const featuredOptions: StatusOption[] = [
    {
      value:   'true',
      label:   t('scheme.filters.featured'),
      variant: 'active',
      showDot: true,
    },
    {
      value:   'false',
      label:   t('scheme.filters.notFeatured'),
      variant: 'inactive',
      showDot: true,
    },
  ]

  return (
    <StatusFilter
      ref={ref}
      value={value}
      onChange={onChange}
      options={featuredOptions}
      placeholder={t('scheme.filters.featured')}
      showAllOption={showAllOption}
      className={className}
    />
  )
})

SchemeFeaturedFilter.displayName = 'SchemeFeaturedFilter'