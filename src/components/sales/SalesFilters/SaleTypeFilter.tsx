// FILE: src/components/sales/SalesFilters/SaleTypeFilter.tsx
// Sale Type Filter - Uses Reusable TypeFilter

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TypeFilter } from '@/components/ui/filters/TypeFilter'
import type { FilterOption } from '@/components/ui/filters/TypeFilter'
import {
  ShoppingCart,
  Package,
  RefreshCw,
  FileText,
  Wrench,
  Receipt,
} from 'lucide-react'

interface SaleTypeFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  showAllOption?: boolean
  className?: string
  disabled?: boolean
}

export const SaleTypeFilter = React.forwardRef<
  HTMLButtonElement,
  SaleTypeFilterProps
>(
  (
    { value, onChange, showAllOption = true, className, disabled = false },
    ref
  ) => {
    const { t } = useTranslation()

    const saleTypeOptions: FilterOption[] = [
      {
        value: 'retail',
        label: t('sales.type.retail'),
        icon: <ShoppingCart className="h-4 w-4 text-status-success" />,
      },
      {
        value: 'wholesale',
        label: t('sales.type.wholesale'),
        icon: <Package className="h-4 w-4 text-status-info" />,
      },
      {
        value: 'exchange',
        label: t('sales.type.exchange'),
        icon: <RefreshCw className="h-4 w-4 text-status-warning" />,
      },
      {
        value: 'order_fulfillment',
        label: t('sales.type.orderFulfillment'),
        icon: <FileText className="h-4 w-4 text-accent" />,
      },
      {
        value: 'repair_billing',
        label: t('sales.type.repairBilling'),
        icon: <Wrench className="h-4 w-4 text-text-secondary" />,
      },
      {
        value: 'estimate',
        label: t('sales.type.estimate'),
        icon: <Receipt className="h-4 w-4 text-text-tertiary" />,
      },
    ]

    return (
      <TypeFilter
        ref={ref}
        options={saleTypeOptions}
        value={value}
        onChange={onChange}
        placeholder={t('sales.filters.saleType')}
        showAllOption={showAllOption}
        allOptionLabel={t('sales.filters.allTypes')}
        className={className}
        disabled={disabled}
      />
    )
  }
)

SaleTypeFilter.displayName = 'SaleTypeFilter'
