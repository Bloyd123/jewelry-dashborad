// FILE: src/components/payment/PaymentForm/mode-fields/WalletFields.tsx
// Wallet Payment Mode Fields

import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import type { FormSectionProps } from '../PaymentForm.types'

export const WalletFields = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const walletProviderOptions = [
    { value: 'paytm', label: 'Paytm' },
    { value: 'phonepe', label: 'PhonePe' },
    { value: 'mobikwik', label: 'Mobikwik' },
    { value: 'amazonpay', label: 'Amazon Pay' },
    { value: 'other', label: t('common.other') },
  ]

  return (
    <div className="space-y-4">
      {/* Wallet Provider */}
      <FormSelect
        name="walletProvider"
        label={t('payment.walletProvider')}
        value={data.walletProvider || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.walletProvider}
        placeholder={t('payment.selectWalletProvider')}
        disabled={disabled}
        options={walletProviderOptions}
      />

      {/* Wallet Number/Mobile */}
      <div className="space-y-2">
        <FormInput
          name="walletNumber"
          label={t('payment.walletNumber')}
          type="text"
          value={data.walletNumber || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.walletNumber}
          placeholder="9876543210"
          disabled={disabled}
          maxLength={10}
        />
        <p className="text-xs text-text-tertiary">
          {t('payment.walletNumberNote')}
        </p>
      </div>

      {/* Transaction ID */}
      <FormInput
        name="walletTransactionId"
        label={t('payment.transactionId')}
        type="text"
        value={data.walletTransactionId || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.walletTransactionId}
        placeholder="PTM123456789"
        disabled={disabled}
      />
    </div>
  )
}
