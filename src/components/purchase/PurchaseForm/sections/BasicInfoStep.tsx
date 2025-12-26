// ============================================================================
// FILE: src/components/purchase/PurchaseForm/sections/BasicInfoSection.tsx
// Basic Info Section
// ============================================================================

import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormDatePicker } from '@/components/forms/FormDatePicker/FormDatePicker'
import type { FormSectionProps } from '../PurchaseForm.types'
import { dummySuppliers } from '@/pages/purchase/mock.data'

export const BasicInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const supplierOptions = dummySuppliers.map(s => ({
    value: s.supplierCode || '',
    label: s.supplierName,
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
        placeholder={t('purchase.selectSupplier')}
        options={supplierOptions}
        required
        disabled={disabled}
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
