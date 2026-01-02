
// FILE: src/components/payment/PaymentForm/mode-fields/UPIFields.tsx
// UPI Payment Mode Fields

import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { AlertCircle, CheckCircle } from 'lucide-react'
import type { FormSectionProps } from '../PaymentForm.types'

export const UPIFields = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const upiAppOptions = [
    { value: 'gpay', label: 'Google Pay' },
    { value: 'phonepe', label: 'PhonePe' },
    { value: 'paytm', label: 'Paytm' },
    { value: 'bhim', label: 'BHIM' },
    { value: 'other', label: t('common.other') },
  ]

  return (
    <div className="space-y-4">
      {/* UPI App */}
      <FormSelect
        name="upiApp"
        label={t('payment.upiAppUsed')}
        value={data.upiApp || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.upiApp}
        placeholder={t('payment.selectUpiApp')}
        disabled={disabled}
        options={upiAppOptions}
      />

      {/* UPI ID */}
      <div className="space-y-2">
        <FormInput
          name="upiId"
          label={t('payment.upiId')}
          type="text"
          value={data.upiId || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.upiId}
          placeholder="username@bankcode"
          disabled={disabled}
        />
        <p className="text-xs text-text-tertiary">
          {t('payment.upiIdFormat')}: username@bankcode
        </p>
      </div>

      {/* Transaction ID */}
      <div className="space-y-2">
        <FormInput
          name="upiTransactionId"
          label={t('payment.transactionId')}
          type="text"
          value={data.upiTransactionId || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.upiTransactionId}
          placeholder="234567890123"
          disabled={disabled}
          maxLength={12}
        />
        <p className="text-xs text-text-tertiary">
          {t('payment.upiTransactionIdFormat')}
        </p>
      </div>

      {/* Info Alert */}
      {data.upiTransactionId && (
        <div className="bg-status-success/10 flex items-start gap-2 rounded-lg p-3 text-status-success">
          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{t('payment.upiAutoCompleteNote')}</p>
        </div>
      )}

      {!data.upiTransactionId && (
        <div className="bg-status-info/10 flex items-start gap-2 rounded-lg p-3 text-status-info">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{t('payment.upiTransactionIdRecommended')}</p>
        </div>
      )}
    </div>
  )
}
