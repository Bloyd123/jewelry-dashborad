import * as React from 'react'
import {
  Gem,
  Crown,
  Circle,
  Diamond,
  Sparkles,
  Hexagon,
  Star,
} from 'lucide-react'
import { TypeFilter } from '@/components/ui/filters/TypeFilter'
import { useTranslation } from 'react-i18next'

interface ShopCategoryFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
}

export const ShopCategoryFilter: React.FC<ShopCategoryFilterProps> = ({
  value,
  onChange,
  className,
}) => {
  const { t } = useTranslation()

  const options = [
    {
      value: 'jewelry',
      label: t('shops.categories.jewelry'),
      icon: <Crown className="h-4 w-4" />,
    },
    {
      value: 'gold',
      label: t('shops.categories.gold'),
      icon: <Circle className="h-4 w-4 text-yellow-500" />,
    },
    {
      value: 'silver',
      label: t('shops.categories.silver'),
      icon: <Circle className="h-4 w-4 text-gray-400" />,
    },
    {
      value: 'diamond',
      label: t('shops.categories.diamond'),
      icon: <Diamond className="h-4 w-4" />,
    },
    {
      value: 'gemstone',
      label: t('shops.categories.gemstone'),
      icon: <Gem className="h-4 w-4" />,
    },
    {
      value: 'pearls',
      label: t('shops.categories.pearls'),
      icon: <Circle className="h-4 w-4 text-pink-300" />,
    },
    {
      value: 'platinum',
      label: t('shops.categories.platinum'),
      icon: <Hexagon className="h-4 w-4" />,
    },
    {
      value: 'mixed',
      label: t('shops.categories.mixed'),
      icon: <Sparkles className="h-4 w-4" />,
    },
  ]

  return (
    <TypeFilter
      options={options}
      value={value}
      onChange={onChange}
      placeholder={t('shops.filters.category')}
      className={className}
    />
  )
}
