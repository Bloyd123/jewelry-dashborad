import * as React from 'react'
import { StatusFilter } from '@/components/ui/filters/StatusFilter'
import { useTranslation } from 'react-i18next'

interface ShopStatusFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
}

export const ShopStatusFilter: React.FC<ShopStatusFilterProps> = ({
  value,
  onChange,
  className,
}) => {
  const { t } = useTranslation()

  const options = [
    {
      value: 'true',
      label: t('status.active'),
      variant: 'active' as const,
      showDot: true,
    },
    {
      value: 'false',
      label: t('status.inactive'),
      variant: 'inactive' as const,
      showDot: true,
    },
  ]

  return (
    <StatusFilter
      value={value}
      onChange={onChange}
      options={options}
      placeholder={t('shops.filters.status')}
      className={className}
    />
  )
}
