// FILE: src/components/purchase/PurchaseFilters/PurchaseSupplierFilter.tsx
// Supplier Filter (TypeFilter)

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  TypeFilter,
  type FilterOption,
} from '@/components/ui/filters/TypeFilter'
import { Building2 } from 'lucide-react'

interface PurchaseSupplierFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  suppliers: Array<{ _id: string; businessName: string; supplierCode: string }>
  className?: string
  disabled?: boolean
}

export const PurchaseSupplierFilter = React.forwardRef<
  HTMLButtonElement,
  PurchaseSupplierFilterProps
>(({ value, onChange, suppliers, className, disabled = false }, ref) => {
  const { t } = useTranslation()

  const supplierOptions: FilterOption[] = suppliers.map(supplier => ({
    value: supplier._id,
    label: `${supplier.businessName} (${supplier.supplierCode})`,
    icon: <Building2 className="h-4 w-4 text-accent" />,
  }))

  return (
    <TypeFilter
      ref={ref}
      options={supplierOptions}
      value={value}
      onChange={onChange}
      placeholder={t('purchase.filters.supplier')}
      className={className}
      disabled={disabled}
    />
  )
})

PurchaseSupplierFilter.displayName = 'PurchaseSupplierFilter'
