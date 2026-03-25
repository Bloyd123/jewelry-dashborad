// FILE: src/components/purchase/PurchaseForm/sections/BasicInfoSection.tsx
// Basic Info Section

import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormDatePicker } from '@/components/forms/FormDatePicker/FormDatePicker'
import type { FormSectionProps } from '../PurchaseForm.types'
import { useSuppliersList } from '@/hooks/supplier'
import { useAuth } from '@/hooks/auth'

export const BasicInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()
const { suppliers, isLoading: isSuppliersLoading } = useSuppliersList(
  currentShopId || ''
)


const supplierOptions = suppliers.map(s => ({
  value: s._id,           
  label: s.businessName,  
}))

  const purchaseTypeOptions = [
    { value: 'new_stock', label: t('purchase.types.newStock') },
    { value: 'old_gold', label: t('purchase.types.oldGold') },
    { value: 'exchange', label: t('purchase.types.exchange') },
    { value: 'consignment', label: t('purchase.types.consignment') },
    { value: 'repair_return', label: t('purchase.types.repairReturn') },
    { value: 'sample', label: t('purchase.types.sample') },
  ]

  return (
    <div className="space-y-4">
      <FormSelect
        name="supplierId"
        label={t('purchase.supplier')}
        value={data.supplierId || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.supplierId}
          placeholder={
    isSuppliersLoading
      ? t('common.loading', 'Loading suppliers...')
      : t('purchase.selectSupplier')
  }

        options={supplierOptions}
        required
        disabled={disabled || isSuppliersLoading} 
      />

      <FormDatePicker
        name="purchaseDate"
        label={t('purchase.purchaseDate')}
        value={data.purchaseDate || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.purchaseDate}
        required
        disabled={disabled}
      />

      <FormSelect
        name="purchaseType"
        label={t('purchase.purchaseType')}
        value={data.purchaseType || 'new_stock'}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.purchaseType}
        options={purchaseTypeOptions}
        required
        disabled={disabled}
      />
    </div>
  )
}
