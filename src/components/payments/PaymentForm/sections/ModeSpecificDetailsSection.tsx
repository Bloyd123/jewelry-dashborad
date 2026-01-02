
// FILE: src/components/payment/PaymentForm/sections/ModeSpecificDetailsSection.tsx
// Mode-Specific Details Section (Dynamic Container)


import { useTranslation } from 'react-i18next'
import { CashFields } from '../mode-fields/CashFields'
import { UPIFields } from '../mode-fields/UPIFields'
import { CardFields } from '../mode-fields/CardFields'
import { ChequeFields } from '../mode-fields/ChequeFields'
import { BankTransferFields } from '../mode-fields/BankTransferFields'
import { WalletFields } from '../mode-fields/WalletFields'
import type { FormSectionProps } from '../PaymentForm.types'

export const ModeSpecificDetailsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  if (!data.paymentMode) {
    return null
  }

  const renderModeFields = () => {
    switch (data.paymentMode) {
      case 'cash':
        return (
          <CashFields
            data={data}
            errors={errors}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
          />
        )
      case 'upi':
        return (
          <UPIFields
            data={data}
            errors={errors}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
          />
        )
      case 'card':
        return (
          <CardFields
            data={data}
            errors={errors}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
          />
        )
      case 'cheque':
        return (
          <ChequeFields
            data={data}
            errors={errors}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
          />
        )
      case 'bank_transfer':
        return (
          <BankTransferFields
            data={data}
            errors={errors}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
          />
        )
      case 'wallet':
        return (
          <WalletFields
            data={data}
            errors={errors}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="border-accent/30 bg-accent/5 rounded-lg border-2 p-6">
      <h3 className="mb-4 text-lg font-bold text-text-primary">
        {t('payment.modeSpecificDetails')}
      </h3>
      {renderModeFields()}
    </div>
  )
}
