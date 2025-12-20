import * as React from 'react'
import {
  YearRangeFilter,
  YearRange,
} from '@/components/ui/filters/YearRangeFilter'
import { useTranslation } from 'react-i18next'

interface ShopEstablishedYearFilterProps {
  value?: YearRange
  onChange: (range: YearRange) => void
  className?: string
}

export const ShopEstablishedYearFilter: React.FC<
  ShopEstablishedYearFilterProps
> = ({ value, onChange, className }) => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <YearRangeFilter
      value={value}
      onChange={onChange}
      minPlaceholder="1900"
      maxPlaceholder={currentYear.toString()}
      className={className}
    />
  )
}
