// ============================================================================
// FILE: src/components/purchase/PurchaseFilters/PurchaseTypeFilter.tsx
// Purchase Type Filter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TypeFilter, type FilterOption } from '@/components/ui/filters/TypeFilter'
import { Package, RefreshCw, Wrench, FileText, Boxes } from 'lucide-react'

interface PurchaseTypeFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
  disabled?: boolean
}

export const PurchaseTypeFilter = React.forwardRef<
  HTMLButtonElement,
  PurchaseTypeFilterProps
>(({ value, onChange, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  const typeOptions: FilterOption[] = [
    {
      value: 'new_stock',
      label: t('purchase.type.newStock'),
      icon: <Package className="h-4 w-4 text-status-success" />,
    },
    {
      value: 'old_gold',
      label: t('purchase.type.oldGold'),
      icon: <RefreshCw className="h-4 w-4 text-status-warning" />,
    },
    {
      value: 'exchange',
      label: t('purchase.type.exchange'),
      icon: <RefreshCw className="h-4 w-4 text-accent" />,
    },
    {
      value: 'consignment',
      label: t('purchase.type.consignment'),
      icon: <Boxes className="h-4 w-4 text-status-info" />,
    },
    {
      value: 'repair_return',
      label: t('purchase.type.repairReturn'),
      icon: <Wrench className="h-4 w-4 text-text-secondary" />,
    },
    {
      value: 'sample',
      label: t('purchase.type.sample'),
      icon: <FileText className="h-4 w-4 text-text-tertiary" />,
    },
  ]

  return (
    <TypeFilter
      ref={ref}
      options={typeOptions}
      value={value}
      onChange={onChange}
      placeholder={t('purchase.filters.purchaseType')}
      className={className}
      disabled={disabled}
    />
  )
})

PurchaseTypeFilter.displayName = 'PurchaseTypeFilter'
