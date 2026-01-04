// FILE: src/components/payment/PaymentForm/mode-fields/BankTransferFields.tsx
// Bank Transfer Payment Mode Fields

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { Label } from '@/components/ui/label'
import type { FormSectionProps } from '../PaymentForm.types'

export const BankTransferFields = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {/* Transfer Type */}
      <div className="space-y-2">
        <Label className="text-text-primary">{t('payment.transferType')}</Label>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {['neft', 'rtgs', 'imps', 'other'].map(type => (
            <label
              key={type}
              className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 transition-all ${
                data.transferType === type
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <input
                type="radio"
                name="transferType"
                value={type}
                checked={data.transferType === type}
                onChange={e => onChange('transferType', e.target.value)}
                disabled={disabled}
                className="sr-only"
              />
              <span className="font-medium uppercase">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Transaction ID / UTR Number */}
      <FormInput
        name="transferTransactionId"
        label={t('payment.transactionIdUtr')}
        type="text"
        value={data.transferTransactionId || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.transferTransactionId}
        placeholder="NEFT234567890123"
        disabled={disabled}
        required
      />

      {/* Reference Number */}
      <FormInput
        name="transferReferenceNumber"
        label={t('payment.referenceNumber')}
        type="text"
        value={data.transferReferenceNumber || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.transferReferenceNumber}
        placeholder="REF789456"
        disabled={disabled}
      />

      {/* From Bank */}
      <FormInput
        name="fromBank"
        label={t('payment.fromBank')}
        type="text"
        value={data.fromBank || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.fromBank}
        placeholder="HDFC Bank"
        disabled={disabled}
      />

      {/* From Account Number */}
      <FormInput
        name="fromAccountNumber"
        label={t('payment.fromAccountNumber')}
        type="text"
        value={data.fromAccountNumber || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.fromAccountNumber}
        placeholder="98765432101234"
        disabled={disabled}
      />

      {/* To Bank (Your Bank) */}
      <FormInput
        name="toBank"
        label={t('payment.toBank')}
        type="text"
        value={data.toBank || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.toBank}
        placeholder="State Bank of India"
        disabled={disabled}
      />

      {/* To Account Number (Your Account) */}
      <FormInput
        name="toAccountNumber"
        label={t('payment.toAccountNumber')}
        type="text"
        value={data.toAccountNumber || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.toAccountNumber}
        placeholder="12345678901234"
        disabled={disabled}
      />

      {/* IFSC Code */}
      <div className="space-y-2">
        <FormInput
          name="transferIfscCode"
          label={t('payment.ifscCode')}
          type="text"
          value={data.transferIfscCode || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.transferIfscCode}
          placeholder="SBIN0001234"
          disabled={disabled}
          maxLength={11}
        />
        <p className="text-xs text-text-tertiary">
          {t('payment.ifscCodeFormat')}
        </p>
      </div>
    </div>
  )
}
