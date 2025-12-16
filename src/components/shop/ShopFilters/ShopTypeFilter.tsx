import * as React from 'react'
import { Store, Warehouse, Wrench, Building2, Globe, Factory, ShoppingBag } from 'lucide-react'
import { TypeFilter } from '@/components/ui/filters/TypeFilter'
import { useTranslation } from 'react-i18next'

interface ShopTypeFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
}

export const ShopTypeFilter: React.FC<ShopTypeFilterProps> = ({
  value,
  onChange,
  className,
}) => {
  const { t } = useTranslation()

  const options = [
    { value: 'retail', label: t('shop.types.retail'), icon: <Store className="h-4 w-4" /> },
    { value: 'wholesale', label: t('shop.types.wholesale'), icon: <ShoppingBag className="h-4 w-4" /> },
    { value: 'manufacturing', label: t('shop.types.manufacturing'), icon: <Factory className="h-4 w-4" /> },
    { value: 'showroom', label: t('shop.types.showroom'), icon: <Building2 className="h-4 w-4" /> },
    { value: 'workshop', label: t('shop.types.workshop'), icon: <Wrench className="h-4 w-4" /> },
    { value: 'warehouse', label: t('shop.types.warehouse'), icon: <Warehouse className="h-4 w-4" /> },
    { value: 'online', label: t('shop.types.online'), icon: <Globe className="h-4 w-4" /> },
  ]

  return (
    <TypeFilter
      options={options}
      value={value}
      onChange={onChange}
      placeholder={t('shop.filters.shopType')}
      className={className}
    />
  )
}