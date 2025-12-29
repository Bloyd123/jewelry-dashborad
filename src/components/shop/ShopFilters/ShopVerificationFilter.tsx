import * as React from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { TypeFilter } from '@/components/ui/filters/TypeFilter'
import { useTranslation } from 'react-i18next'

interface ShopVerificationFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
}

export const ShopVerificationFilter: React.FC<ShopVerificationFilterProps> = ({
  value,
  onChange,
  className,
}) => {
  const { t } = useTranslation()

  const options = [
    {
      value: 'true',
      label: t('shops.verified'),
      icon: <CheckCircle2 className="h-4 w-4 text-status-success" />,
    },
    {
      value: 'false',
      label: t('shops.unverified'),
      icon: <XCircle className="h-4 w-4 text-text-tertiary" />,
    },
  ]

  return (
    <TypeFilter
      options={options}
      value={value}
      onChange={onChange}
      placeholder={t('shops.filters.verification')}
      className={className}
    />
  )
}
