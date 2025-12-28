// ============================================================================
// FILE: src/components/payment/PaymentForm/sections/TransactionTypeSection.tsx
// Transaction Type Toggle Section (Receipt/Payment)
// ============================================================================

import { useTranslation } from 'react-i18next'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import type { FormSectionProps } from '../PaymentForm.types'

export const TransactionTypeSection = ({
  data,
  onChange,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const handleToggle = (type: 'receipt' | 'payment') => {
    onChange('transactionType', type)
  }

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Receipt Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleToggle('receipt')}
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 p-6 transition-all ${
            data.transactionType === 'receipt'
              ? 'bg-status-success/10 border-status-success shadow-lg'
              : 'border-border-primary bg-bg-secondary hover:bg-bg-tertiary'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <div
            className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full ${
              data.transactionType === 'receipt'
                ? 'bg-status-success text-white'
                : 'bg-bg-tertiary text-text-secondary'
            }`}
          >
            <ArrowDownLeft className="h-8 w-8" />
          </div>
          <h3
            className={`text-lg font-bold ${
              data.transactionType === 'receipt'
                ? 'text-status-success'
                : 'text-text-primary'
            }`}
          >
            {t('payment.receipt')}
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            {t('payment.moneyIn')}
          </p>

          {data.transactionType === 'receipt' && (
            <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-status-success text-white">
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

        {/* Payment Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleToggle('payment')}
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 p-6 transition-all ${
            data.transactionType === 'payment'
              ? 'bg-status-error/10 border-status-error shadow-lg'
              : 'border-border-primary bg-bg-secondary hover:bg-bg-tertiary'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <div
            className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full ${
              data.transactionType === 'payment'
                ? 'bg-status-error text-white'
                : 'bg-bg-tertiary text-text-secondary'
            }`}
          >
            <ArrowUpRight className="h-8 w-8" />
          </div>
          <h3
            className={`text-lg font-bold ${
              data.transactionType === 'payment'
                ? 'text-status-error'
                : 'text-text-primary'
            }`}
          >
            {t('payment.payment')}
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            {t('payment.moneyOut')}
          </p>

          {data.transactionType === 'payment' && (
            <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-status-error text-white">
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
      </div>
    </div>
  )
}
