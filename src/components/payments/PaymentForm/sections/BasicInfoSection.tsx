// FILE: src/components/payment/PaymentForm/sections/BasicInfoSection.tsx
// Basic Information Section (Payment Type, Amount, Date, Time)

import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormDatePicker } from '@/components/forms/FormDatePicker/FormDatePicker'
import { DollarSign, Calendar, Clock } from 'lucide-react'
import type { FormSectionProps } from '../PaymentForm.types'

// Utility function to convert number to words (Indian style)
const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero Rupees Only'

  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
  ]
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ]
  const teens = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ]

  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return ''
    if (n < 10) return ones[n]
    if (n < 20) return teens[n - 10]
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '')
    return (
      ones[Math.floor(n / 100)] +
      ' Hundred' +
      (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '')
    )
  }

  const crore = Math.floor(num / 10000000)
  const lakh = Math.floor((num % 10000000) / 100000)
  const thousand = Math.floor((num % 100000) / 1000)
  const remainder = num % 1000

  let result = ''
  if (crore > 0) result += convertLessThanThousand(crore) + ' Crore '
  if (lakh > 0) result += convertLessThanThousand(lakh) + ' Lakh '
  if (thousand > 0) result += convertLessThanThousand(thousand) + ' Thousand '
  if (remainder > 0) result += convertLessThanThousand(remainder)

  return result.trim() + ' Rupees Only'
}

export const BasicInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const paymentTypeOptions = [
    { value: 'sale_payment', label: t('payment.salePayment') },
    { value: 'purchase_payment', label: t('payment.purchasePayment') },
    { value: 'scheme_payment', label: t('payment.schemePayment') },
    { value: 'advance_payment', label: t('payment.advancePayment') },
    { value: 'refund', label: t('payment.refund') },
    { value: 'other', label: t('payment.other') },
  ]

  const handleAmountChange = (name: string, value: string | number) => {
    // Allow only numbers and decimal point
    const numericValue = String(value).replace(/[^0-9.]/g, '')
    onChange(name, numericValue)
  }

  const amountInWords = data.amount
    ? numberToWords(parseFloat(String(data.amount)) || 0)
    : ''

  return (
    <div className="space-y-4">
      {/* Payment Type */}
      <FormSelect
        name="paymentType"
        label={t('payment.paymentType')}
        value={data.paymentType || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.paymentType}
        placeholder={t('payment.selectPaymentType')}
        required
        disabled={disabled}
        options={paymentTypeOptions}
      />

      {/* Amount - Large & Prominent */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t('payment.amount')}
          <span className="ml-1 text-status-error">*</span>
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <DollarSign className="h-5 w-5 text-text-tertiary" />
            <span className="ml-1 text-lg font-semibold text-text-secondary">
              ₹
            </span>
          </div>

          <input
            type="text"
            name="amount"
            value={data.amount || ''}
            onChange={e => handleAmountChange('amount', e.target.value)}
            onBlur={() => onBlur?.('amount')}
            disabled={disabled}
            placeholder="0.00"
            className={`h-14 w-full rounded-lg border bg-bg-secondary pl-16 pr-4 text-xl font-bold text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary disabled:text-text-tertiary ${
              errors.amount
                ? 'border-status-error focus:border-status-error focus:ring-status-error'
                : 'border-border-primary'
            }`}
          />
        </div>

        {/* Amount in Words */}
        {data.amount && parseFloat(String(data.amount)) > 0 && (
          <p className="text-sm italic text-text-secondary">
            {t('payment.inWords')}: {amountInWords}
          </p>
        )}

        {errors.amount && (
          <p className="flex items-center gap-2 text-sm text-status-error">
            <span>⚠️</span>
            <span>{errors.amount}</span>
          </p>
        )}
      </div>

      {/* Date & Time - Side by Side */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Payment Date */}
        <FormDatePicker
          name="paymentDate"
          label={t('payment.paymentDate')}
          value={data.paymentDate || new Date().toISOString()}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.paymentDate}
          required
          disabled={disabled}
          maxDate={new Date()}
        />

        {/* Payment Time */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            {t('payment.paymentTime')}
            <span className="ml-1 text-status-error">*</span>
          </label>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Clock className="h-4 w-4 text-text-tertiary" />
            </div>

            <input
              type="time"
              name="paymentTime"
              value={data.paymentTime || new Date().toTimeString().slice(0, 5)}
              onChange={e => onChange('paymentTime', e.target.value)}
              onBlur={() => onBlur?.('paymentTime')}
              disabled={disabled}
              className={`h-10 w-full rounded-lg border bg-bg-secondary pl-10 pr-4 text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary disabled:text-text-tertiary ${
                errors.paymentTime
                  ? 'border-status-error focus:border-status-error focus:ring-status-error'
                  : 'border-border-primary'
              }`}
            />
          </div>

          {errors.paymentTime && (
            <p className="flex items-center gap-2 text-sm text-status-error">
              <span>⚠️</span>
              <span>{errors.paymentTime}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
