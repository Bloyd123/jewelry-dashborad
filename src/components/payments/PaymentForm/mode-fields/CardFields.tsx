// ============================================================================
// FILE: src/components/payment/PaymentForm/mode-fields/CardFields.tsx
// Card Payment Mode Fields
// ============================================================================

import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { Label } from '@/components/ui/label'
import type { FormSectionProps } from '../PaymentForm.types'

export const CardFields = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const cardNetworkOptions = [
    { value: 'visa', label: 'Visa' },
    { value: 'mastercard', label: 'Mastercard' },
    { value: 'rupay', label: 'RuPay' },
    { value: 'amex', label: 'American Express' },
    { value: 'other', label: t('common.other') },
  ]

  return (
    <div className="space-y-4">
      {/* Card Type */}
      <div className="space-y-2">
        <Label className="text-text-primary">{t('payment.cardType')}</Label>

        <div className="flex gap-4">
          <label
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
              data.cardType === 'credit'
                ? 'bg-accent/10 border-accent text-accent'
                : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input
              type="radio"
              name="cardType"
              value="credit"
              checked={data.cardType === 'credit'}
              onChange={e => onChange('cardType', e.target.value)}
              disabled={disabled}
              className="sr-only"
            />
            <span className="font-medium">{t('payment.creditCard')}</span>
          </label>

          <label
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
              data.cardType === 'debit'
                ? 'bg-accent/10 border-accent text-accent'
                : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input
              type="radio"
              name="cardType"
              value="debit"
              checked={data.cardType === 'debit'}
              onChange={e => onChange('cardType', e.target.value)}
              disabled={disabled}
              className="sr-only"
            />
            <span className="font-medium">{t('payment.debitCard')}</span>
          </label>
        </div>
      </div>

      {/* Card Network */}
      <FormSelect
        name="cardNetwork"
        label={t('payment.cardNetwork')}
        value={data.cardNetwork || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.cardNetwork}
        placeholder={t('payment.selectCardNetwork')}
        disabled={disabled}
        options={cardNetworkOptions}
      />

      {/* Last 4 Digits */}
      <div className="space-y-2">
        <FormInput
          name="last4Digits"
          label={t('payment.last4Digits')}
          type="text"
          value={data.last4Digits || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.last4Digits}
          placeholder="1234"
          disabled={disabled}
          maxLength={4}
        />
        <p className="text-xs text-text-tertiary">
          **** **** **** {data.last4Digits || 'XXXX'}
        </p>
      </div>

      {/* Bank Name */}
      <FormInput
        name="cardBankName"
        label={t('payment.bankName')}
        type="text"
        value={data.cardBankName || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.cardBankName}
        placeholder={t('payment.enterBankName')}
        disabled={disabled}
      />

      {/* Authorization Code (Optional) */}
      <FormInput
        name="authorizationCode"
        label={t('payment.authorizationCode')}
        type="text"
        value={data.authorizationCode || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.authorizationCode}
        placeholder="AUTH123456"
        disabled={disabled}
      />

      {/* Terminal ID (Optional) */}
      <FormInput
        name="terminalId"
        label={t('payment.terminalId')}
        type="text"
        value={data.terminalId || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.terminalId}
        placeholder="TRM001"
        disabled={disabled}
      />
    </div>
  )
}
