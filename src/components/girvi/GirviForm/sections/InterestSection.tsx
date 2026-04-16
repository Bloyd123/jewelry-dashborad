// FILE: src/components/girvi/GirviForm/sections/InterestSection.tsx
// Interest Rate, Type, Basis, LTV + Payment Mode at Jama time

import { useTranslation } from 'react-i18next'
import { TrendingUp, Percent, CreditCard, Banknote, Smartphone, Building2, FileText } from 'lucide-react'
import type { GirviFormSectionProps } from '../GirviForm.types'
import { calcLoanToValue, numberToWords } from '../GirviForm.utils'

// Payment modes for Girvi — subset only (no card/wallet)
const GIRVI_PAYMENT_MODES = [
  { value: 'cash',          icon: Banknote,   label: 'Cash' },
  { value: 'upi',           icon: Smartphone, label: 'UPI' },
  { value: 'bank_transfer', icon: Building2,  label: 'Transfer' },
  { value: 'cheque',        icon: FileText,   label: 'Cheque' },
]

export const InterestSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: GirviFormSectionProps) => {
  const { t } = useTranslation()

  // Compute LTV live
  const totalApproxValue = (data.items || []).reduce(
    (sum, item) => sum + (item.finalValue ?? 0),
    0
  )
  const principal = parseFloat(String(data.principalAmount || 0))
  const ltv = totalApproxValue > 0 ? calcLoanToValue(principal, totalApproxValue) : null

  const amountInWords = principal > 0 ? numberToWords(principal) : ''

  return (
    <div className="space-y-6">

      {/* ── Principal Amount ─────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t('girvi.principalAmount')}
          <span className="ml-1 text-status-error">*</span>
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <span className="text-lg font-semibold text-text-secondary">₹</span>
          </div>
          <input
            type="text"
            name="principalAmount"
            value={data.principalAmount || ''}
            onChange={e => onChange('principalAmount', e.target.value.replace(/[^0-9.]/g, ''))}
            onBlur={() => onBlur?.('principalAmount')}
            disabled={disabled}
            placeholder="0.00"
            className={`h-14 w-full rounded-lg border bg-bg-secondary pl-10 pr-4 text-xl font-bold text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary ${
              errors.principalAmount ? 'border-status-error' : 'border-border-primary'
            }`}
          />
        </div>

        {amountInWords && (
          <p className="text-sm italic text-text-secondary">
            {amountInWords}
          </p>
        )}

        {/* LTV Badge */}
        {ltv !== null && (
          <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
            ltv > 80
              ? 'bg-status-error/10 text-status-error'
              : ltv > 60
              ? 'bg-status-warning/10 text-status-warning'
              : 'bg-status-success/10 text-status-success'
          }`}>
            <Percent className="h-3.5 w-3.5" />
            LTV: {ltv}% of item value
            {ltv > 80 && ' — High Risk'}
          </div>
        )}

        {errors.principalAmount && (
          <p className="text-sm text-status-error">⚠️ {errors.principalAmount}</p>
        )}
      </div>

      {/* ── Interest Rate ────────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t('girvi.interestRate')}
          <span className="ml-1 text-status-error">*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <TrendingUp className="h-4 w-4 text-text-tertiary" />
          </div>
          <input
            type="number"
            name="interestRate"
            value={data.interestRate || ''}
            min={0}
            step={0.1}
            onChange={e => onChange('interestRate', e.target.value)}
            onBlur={() => onBlur?.('interestRate')}
            disabled={disabled}
            placeholder="e.g. 2.5"
            className={`h-10 w-full rounded-lg border bg-bg-secondary pl-10 pr-16 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary ${
              errors.interestRate ? 'border-status-error' : 'border-border-primary'
            }`}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-sm text-text-tertiary">% / month</span>
          </div>
        </div>
        {errors.interestRate && (
          <p className="text-sm text-status-error">⚠️ {errors.interestRate}</p>
        )}
      </div>

      {/* ── Interest Type + Calculation Basis ────────────── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Interest Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            {t('girvi.interestType')}
          </label>
          <div className="flex gap-3">
            {(['simple', 'compound'] as const).map(type => (
              <label
                key={type}
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 p-3 transition-all ${
                  data.interestType === type
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <input
                  type="radio"
                  name="interestType"
                  value={type}
                  checked={data.interestType === type}
                  onChange={() => onChange('interestType', type)}
                  disabled={disabled}
                  className="sr-only"
                />
                <span className="text-sm font-medium capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Calculation Basis */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            {t('girvi.calculationBasis')}
          </label>
          <div className="flex gap-3">
            {(['monthly', 'daily'] as const).map(basis => (
              <label
                key={basis}
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 p-3 transition-all ${
                  data.calculationBasis === basis
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <input
                  type="radio"
                  name="calculationBasis"
                  value={basis}
                  checked={data.calculationBasis === basis}
                  onChange={() => onChange('calculationBasis', basis)}
                  disabled={disabled}
                  className="sr-only"
                />
                <span className="text-sm font-medium capitalize">{basis}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ── Payment Mode (cash given to customer at jama) ─── */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t('girvi.paymentModeAtJama')}
          <span className="ml-1 text-status-error">*</span>
        </label>
        <p className="text-xs text-text-tertiary">{t('girvi.paymentModeHint')}</p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {GIRVI_PAYMENT_MODES.map(mode => (
            <button
              key={mode.value}
              type="button"
              onClick={() => onChange('paymentMode', mode.value)}
              disabled={disabled}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                data.paymentMode === mode.value
                  ? 'bg-accent/10 border-accent'
                  : 'hover:border-accent/50 border-border-primary bg-bg-secondary hover:bg-bg-tertiary'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                data.paymentMode === mode.value
                  ? 'bg-accent text-white'
                  : 'bg-bg-tertiary text-text-secondary'
              }`}>
                <mode.icon className="h-5 w-5" />
              </div>
              <span className={`text-sm font-medium ${
                data.paymentMode === mode.value ? 'text-accent' : 'text-text-primary'
              }`}>
                {mode.label}
              </span>
            </button>
          ))}
        </div>

        {/* Transaction Reference (shown for non-cash) */}
        {data.paymentMode && data.paymentMode !== 'cash' && (
          <input
            type="text"
            name="transactionReference"
            value={data.transactionReference || ''}
            onChange={e => onChange('transactionReference', e.target.value)}
            onBlur={() => onBlur?.('transactionReference')}
            disabled={disabled}
            placeholder={
              data.paymentMode === 'upi'
                ? t('girvi.upiIdPlaceholder')
                : data.paymentMode === 'cheque'
                ? t('girvi.chequeNumberPlaceholder')
                : t('girvi.transactionRefPlaceholder')
            }
            className="mt-2 h-10 w-full rounded-lg border border-border-primary bg-bg-secondary px-4 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary"
          />
        )}

        {errors.paymentMode && (
          <p className="text-sm text-status-error">⚠️ {errors.paymentMode}</p>
        )}
      </div>
    </div>
  )
}