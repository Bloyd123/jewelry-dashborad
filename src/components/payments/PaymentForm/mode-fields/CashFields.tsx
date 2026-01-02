
// FILE: src/components/payment/PaymentForm/mode-fields/CashFields.tsx
// Cash Payment Mode Fields

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { AlertCircle } from 'lucide-react'
import type { FormSectionProps } from '../PaymentForm.types'
import { useEffect } from 'react'

export const CashFields = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  // Auto-calculate return amount
  useEffect(() => {
    const amount = parseFloat(String(data.amount)) || 0
    const received = parseFloat(String(data.receivedAmount)) || 0
    const returnAmount = received - amount

    if (returnAmount >= 0) {
      onChange('returnAmount', returnAmount)
    }
  }, [data.amount, data.receivedAmount])

  return (
    <div className="space-y-4">
      {/* Info Alert */}
      <div className="bg-status-info/10 flex items-start gap-2 rounded-lg p-3 text-status-info">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <p className="text-sm">{t('payment.cashPaymentNote')}</p>
      </div>

      {/* Received Amount */}
      <FormInput
        name="receivedAmount"
        label={t('payment.receivedAmount')}
        type="number"
        value={data.receivedAmount || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.receivedAmount}
        placeholder="0.00"
        disabled={disabled}
      />

      {/* Return Amount (Read-only, Auto-calculated) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t('payment.returnAmount')}
        </label>
        <div className="relative">
          <input
            type="text"
            value={
              data.returnAmount
                ? `₹ ${parseFloat(String(data.returnAmount)).toFixed(2)}`
                : '₹ 0.00'
            }
            readOnly
            disabled
            className="h-10 w-full rounded-lg border border-border-primary bg-bg-tertiary px-4 text-text-secondary"
          />
        </div>
        <p className="text-xs text-text-tertiary">
          {t('payment.autoCalculated')}
        </p>
      </div>
    </div>
  )
}
