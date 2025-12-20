import * as React from 'react'
import { ArrowUpDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface ShopSortFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
}

export const ShopSortFilter: React.FC<ShopSortFilterProps> = ({
  value,
  onChange,
  className,
}) => {
  const { t } = useTranslation()

  const sortOptions = [
    { value: 'name', label: t('shop.sort.nameAsc') },
    { value: '-name', label: t('shop.sort.nameDesc') },
    { value: 'createdAt', label: t('shop.sort.oldestFirst') },
    { value: '-createdAt', label: t('shop.sort.newestFirst') },
    { value: 'city', label: t('shop.sort.cityAsc') },
    { value: '-city', label: t('shop.sort.cityDesc') },
  ]

  const handleChange = (newValue: string) => {
    if (newValue === 'default') {
      onChange(undefined)
    } else {
      onChange(newValue)
    }
  }

  return (
    <Select value={value || 'default'} onValueChange={handleChange}>
      <SelectTrigger className={cn('w-full md:w-[200px]', className)}>
        <ArrowUpDown className="mr-2 h-4 w-4" />
        <SelectValue placeholder={t('shop.sort.sortBy')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">{t('shop.sort.default')}</SelectItem>
        {sortOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
