// FILE: src/components/payments/PaymentForm/sections/PaymentModeSection.tsx
// Payment Mode Section (Visual Card Selection)

import { useTranslation } from 'react-i18next'
import {
  Banknote,
  CreditCard,
  Smartphone,
  FileText,
  Building2,
  Wallet,
  MoreHorizontal,
} from 'lucide-react'
import type { FormSectionProps } from '../PaymentForm.types'

const paymentModes = [
  { value: 'cash', icon: Banknote, label: 'Cash' },
  { value: 'upi', icon: Smartphone, label: 'UPI' },
  { value: 'card', icon: CreditCard, label: 'Card' },
  { value: 'cheque', icon: FileText, label: 'Cheque' },
  { value: 'bank_transfer', icon: Building2, label: 'Transfer' },
  { value: 'wallet', icon: Wallet, label: 'Wallet' },
  { value: 'other', icon: MoreHorizontal, label: 'Other' },
]

export const PaymentModeSection = ({
  data,
  errors,
  onChange,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const handleModeSelect = (mode: string) => {
    onChange('paymentMode', mode)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t('payment.howWasPaymentMade')}
          <span className="ml-1 text-status-error">*</span>
        </label>

        {/* Payment Mode Grid */}
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {paymentModes.map(mode => (
            <button
              key={mode.value}
              type="button"
              onClick={() => handleModeSelect(mode.value)}
              disabled={disabled}
              className={`group flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                data.paymentMode === mode.value
                  ? 'bg-accent/10 border-accent shadow-lg'
                  : 'hover:border-accent/50 border-border-primary bg-bg-secondary hover:bg-bg-tertiary'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                  data.paymentMode === mode.value
                    ? 'bg-accent text-white'
                    : 'group-hover:bg-accent/20 bg-bg-tertiary text-text-secondary group-hover:text-accent'
                }`}
              >
                <mode.icon className="h-6 w-6" />
              </div>

              <span
                className={`text-sm font-medium ${
                  data.paymentMode === mode.value
                    ? 'text-accent'
                    : 'text-text-primary'
                }`}
              >
                {mode.label}
              </span>

              {/* Selected Indicator */}
              {data.paymentMode === mode.value && (
                <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {errors.paymentMode && (
          <p className="flex items-center gap-2 text-sm text-status-error">
            <span>⚠️</span>
            <span>{errors.paymentMode}</span>
          </p>
        )}
      </div>
    </div>
  )
}
