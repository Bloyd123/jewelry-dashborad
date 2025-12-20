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
      label: t('shop.categories.jewelry'),
      icon: <Crown className="h-4 w-4" />,
    },
    {
      value: 'gold',
      label: t('shop.categories.gold'),
      icon: <Circle className="h-4 w-4 text-yellow-500" />,
    },
    {
      value: 'silver',
      label: t('shop.categories.silver'),
      icon: <Circle className="h-4 w-4 text-gray-400" />,
    },
    {
      value: 'diamond',
      label: t('shop.categories.diamond'),
      icon: <Diamond className="h-4 w-4" />,
    },
    {
      value: 'gemstone',
      label: t('shop.categories.gemstone'),
      icon: <Gem className="h-4 w-4" />,
    },
    {
      value: 'pearls',
      label: t('shop.categories.pearls'),
      icon: <Circle className="h-4 w-4 text-pink-300" />,
    },
    {
      value: 'platinum',
      label: t('shop.categories.platinum'),
      icon: <Hexagon className="h-4 w-4" />,
    },
    {
      value: 'mixed',
      label: t('shop.categories.mixed'),
      icon: <Sparkles className="h-4 w-4" />,
    },
  ]

  return (
    <TypeFilter
      options={options}
      value={value}
      onChange={onChange}
      placeholder={t('shop.filters.category')}
      className={className}
    />
  )
}
