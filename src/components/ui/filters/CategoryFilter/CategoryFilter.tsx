// FILE: src/components/ui/filters/CategoryFilter/CategoryFilter.tsx
// Multi-level Category Filter

import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface Category {
  value: string
  label: string
  children?: Category[]
}

export interface CategoryFilterProps {
  categories: Category[]
  value?: string
  onChange: (value: string | undefined) => void
  placeholder?: string
  showAllOption?: boolean
  className?: string
  disabled?: boolean
}

export const CategoryFilter = React.forwardRef<
  HTMLButtonElement,
  CategoryFilterProps
>(
  (
    {
      categories,
      value,
      onChange,
      placeholder,
      showAllOption = true,
      className,
      disabled = false,
    },
    ref
  ) => {
    const { t } = useTranslation()

    const handleChange = (newValue: string) => {
      if (newValue === 'all') {
        onChange(undefined)
      } else {
        onChange(newValue)
      }
    }

    const renderCategories = (cats: Category[], level = 0) => {
      return cats.map(cat => (
        <React.Fragment key={cat.value}>
          <SelectItem value={cat.value}>
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: `${level * 12}px` }}
            >
              {level > 0 && (
                <ChevronRight className="h-3 w-3 text-text-tertiary" />
              )}
              <span>{cat.label}</span>
            </div>
          </SelectItem>
          {cat.children && renderCategories(cat.children, level + 1)}
        </React.Fragment>
      ))
    }

    return (
      <Select
        value={value || 'all'}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger
          ref={ref}
          className={cn('w-full md:w-[200px]', className)}
        >
          <SelectValue placeholder={placeholder || t('filters.category')} />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && (
            <SelectItem value="all">{t('common.all')}</SelectItem>
          )}
          {renderCategories(categories)}
        </SelectContent>
      </Select>
    )
  }
)

CategoryFilter.displayName = 'CategoryFilter'
