import * as React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface ShopSearchBarProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export const ShopSearchBar: React.FC<ShopSearchBarProps> = ({
  value,
  onChange,
  className,
}) => {
  const { t } = useTranslation()

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('shop.searchPlaceholder')} // "Search by name or code..."
        className="pl-10"
      />
    </div>
  )
}