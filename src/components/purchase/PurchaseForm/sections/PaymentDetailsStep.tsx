// ============================================================================
// FILE: src/components/purchase/PurchaseForm/sections/PaymentDetailsSection.tsx
// Payment Details Section
// ============================================================================

import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormDatePicker } from '@/components/forms/FormDatePicker/FormDatePicker'
import type { FormSectionProps } from '../PurchaseForm.types'

export const PaymentDetailsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const paymentModeOptions = [
    { value: 'cash', label: t('purchase.paymentModes.cash') },
    { value: 'card', label: t('purchase.paymentModes.card') },
    { value: 'upi', label: t('purchase.paymentModes.upi') },
    { value: 'cheque', label: t('purchase.paymentModes.cheque') },
    { value: 'bank_transfer', label: t('purchase.paymentModes.bankTransfer') },
    { value: 'credit', label: t('purchase.paymentModes.credit') },
  ]

  return (
    <div className="space-y-4">
      <FormSelect
        name="paymentMode"
        label={t('purchase.paymentMode')}
        value={data.paymentMode || 'cash'}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.paymentMode}
        options={paymentModeOptions}
        required
        disabled={disabled}
      />

      <FormInput
        name="paidAmount"
        label={t('purchase.paidAmount')}
        type="number"
        value={data.paidAmount || 0}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.paidAmount}
        disabled={disabled}
      />

      <FormInput
        name="paymentTerms"
        label={t('purchase.paymentTerms')}
        value={data.paymentTerms || ''}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />

      <FormDatePicker
        name="dueDate"
        label={t('purchase.dueDate')}
        value={data.dueDate || ''}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />
    </div>
  )
}
