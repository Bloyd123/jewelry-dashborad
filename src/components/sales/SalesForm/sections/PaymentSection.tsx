// ============================================================================
// FILE: src/components/sales/SaleForm/sections/PaymentSection.tsx
// Payment Details Section
// ============================================================================

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormDatePicker } from '@/components/forms/FormDatePicker/FormDatePicker'
import { CreditCard, Wallet, DollarSign } from 'lucide-react'
import type { FormSectionProps } from '../SaleForm.types'

export const PaymentSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const payment = data.payment || {
    paymentMode: 'cash',
    paidAmount: 0,
    dueDate: undefined,
  }

  const handlePaymentChange = (field: string, value: any) => {
    onChange('payment', {
      ...payment,
      [field]: value,
    })
  }

  // Mock calculations (replace with actual logic)
  const subtotal = 176491
  const oldGoldValue = data.oldGoldExchange?.hasExchange ? 90000 : 0
  const netPayable = subtotal - oldGoldValue
  const paidAmount = payment.paidAmount || 0
  const dueAmount = netPayable - paidAmount

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold text-text-primary">
          {t('sales.paymentDetails')}
        </h3>
      </div>

      {/* Amount Summary */}
      <div className="space-y-3 rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">{t('sales.subtotal')}</span>
          <span className="font-medium text-text-primary">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        {oldGoldValue > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">
              {t('sales.oldGoldValue')}
            </span>
            <span className="font-medium text-status-success">
              - ₹{oldGoldValue.toFixed(2)}
            </span>
          </div>
        )}

        <div className="border-t border-border-primary pt-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-text-primary">
              {t('sales.netPayable')}
            </span>
            <span className="text-xl font-bold text-accent">
              ₹{netPayable.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Mode */}
      <FormSelect
        name="payment.paymentMode"
        label={t('sales.paymentModetext')}
        value={payment.paymentMode || 'cash'}
        onChange={(_, val) => handlePaymentChange('paymentMode', val)}
        onBlur={onBlur}
        error={errors['payment.paymentMode']}
        required
        disabled={disabled}
        options={[
          { value: 'cash', label: t('sales.cash') },
          { value: 'card', label: t('sales.card') },
          { value: 'upi', label: t('sales.upi') },
          { value: 'cheque', label: t('sales.cheque') },
          { value: 'bank_transfer', label: t('sales.bankTransfer') },
          { value: 'mixed', label: t('sales.mixed') },
          { value: 'credit', label: t('sales.credit') },
        ]}
      />

      {/* Paid Amount */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          name="payment.paidAmount"
          label={t('sales.paidAmount')}
          type="number"
          value={payment.paidAmount || 0}
          onChange={(_, val) =>
            handlePaymentChange('paidAmount', parseFloat(val as string) || 0)
          }
          onBlur={onBlur}
          error={errors['payment.paidAmount']}
          placeholder="0.00"
          disabled={disabled}
        />

        <FormInput
          name="payment.dueAmount"
          label={t('sales.dueAmount')}
          type="number"
          value={dueAmount.toFixed(2)}
          onChange={() => {}}
          disabled
          className="bg-bg-tertiary"
        />
      </div>

      {/* Due Date (if partial/unpaid) */}
      {dueAmount > 0 && (
        <FormDatePicker
          name="payment.dueDate"
          label={t('sales.dueDate')}
          value={payment.dueDate || ''}
          onChange={(_, val) => handlePaymentChange('dueDate', val)}
          onBlur={onBlur}
          error={errors['payment.dueDate']}
          placeholder={t('sales.selectDueDate')}
          disabled={disabled}
          minDate={new Date()}
        />
      )}

      {/* Payment Status Badge */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-4">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">
            {t('sales.paymentStatus')}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              dueAmount === 0
                ? 'bg-status-success/10 text-status-success'
                : paidAmount > 0
                  ? 'bg-status-warning/10 text-status-warning'
                  : 'bg-status-error/10 text-status-error'
            }`}
          >
            {dueAmount === 0
              ? t('sales.paid')
              : paidAmount > 0
                ? t('sales.partial')
                : t('sales.unpaid')}
          </span>
        </div>
      </div>

      {/* Payment Mode Icons */}
      <div className="flex items-center gap-4 rounded-lg border border-border-secondary bg-bg-tertiary p-4">
        <Wallet className="h-5 w-5 text-text-tertiary" />
        <CreditCard className="h-5 w-5 text-text-tertiary" />
        <DollarSign className="h-5 w-5 text-text-tertiary" />
        <span className="text-sm text-text-tertiary">
          {t('sales.multiplePaymentModesSupported')}
        </span>
      </div>
    </div>
  )
}
