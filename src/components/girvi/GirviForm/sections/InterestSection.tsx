// FILE: src/components/girvi/GirviForm/sections/InterestSection.tsx

import { useTranslation } from 'react-i18next'
import { TrendingUp, Percent, Banknote, Smartphone, Building2, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { GirviFormSectionProps } from '../GirviForm.types'
import { calcLoanToValue, numberToWords } from '../GirviForm.utils'

const GIRVI_PAYMENT_MODES = [
  { value: 'cash',          icon: Banknote,   label: 'Cash'     },
  { value: 'upi',           icon: Smartphone, label: 'UPI'      },
  { value: 'bank_transfer', icon: Building2,  label: 'Transfer' },
  { value: 'cheque',        icon: FileText,   label: 'Cheque'   },
]

export const InterestSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
  mode,
}: GirviFormSectionProps) => {
  const { t } = useTranslation()

  const totalApproxValue = (data.items || []).reduce(
    (sum, item) => sum + (item.finalValue ?? 0),
    0
  )
  const principal     = parseFloat(String(data.principalAmount || 0))
  const ltv           = totalApproxValue > 0 ? calcLoanToValue(principal, totalApproxValue) : null
  const amountInWords = principal > 0 ? numberToWords(principal) : ''

  return (
    <div className="space-y-6">

      {/* ── Principal Amount ── */}
      <div className="space-y-1.5">
        <Label htmlFor="principalAmount">
          {t('girvi.principalAmount')}
          <span className="ml-1 text-status-error">*</span>
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <span className="text-lg font-semibold text-text-secondary">₹</span>
          </div>
<Input
  id="principalAmount"
  type="text"
  name="principalAmount"
  value={data.principalAmount || ''}
  onChange={e => onChange('principalAmount', e.target.value.replace(/[^0-9.]/g, ''))}
  onBlur={() => onBlur?.('principalAmount')}
  disabled={disabled || mode === 'edit'}
  placeholder="0.00"
            className={`h-14 pl-10 text-xl font-bold ${errors.principalAmount ? 'border-status-error' : ''}`}
          />
        </div>
        {amountInWords && (
          <p className="text-sm italic text-text-secondary">{amountInWords}</p>
        )}
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
          <p className="text-sm text-status-error">{errors.principalAmount}</p>
        )}
      </div>

      {/* ── Interest Rate ── */}
      <div className="space-y-1.5">
        <Label htmlFor="interestRate">
          {t('girvi.interestRate')}
          <span className="ml-1 text-status-error">*</span>
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <TrendingUp className="h-4 w-4 text-text-tertiary" />
          </div>
          <Input
            id="interestRate"
            type="number"
            name="interestRate"
            value={data.interestRate || ''}
            min={0}
            step={0.1}
            onChange={e => onChange('interestRate', e.target.value)}
            onBlur={() => onBlur?.('interestRate')}
            disabled={disabled}
            placeholder="e.g. 2.5"
            className={`pl-10 pr-24 ${errors.interestRate ? 'border-status-error' : ''}`}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-xs text-text-tertiary sm:text-sm">% / month</span>
          </div>
        </div>
        {errors.interestRate && (
          <p className="text-sm text-status-error">{errors.interestRate}</p>
        )}
      </div>

      {/* ── Interest Type + Calculation Basis ──
           Mobile : stacked (1 col)
           md+    : side by side (2 col)
      ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Interest Type */}
        <div className="space-y-1.5">
          <Label>{t('girvi.interestType')}</Label>
          <div className="flex gap-2 sm:gap-3">
            {(['simple', 'compound'] as const).map(type => (
              <label
                key={type}
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 p-2.5 sm:p-3 transition-all ${
                  data.interestType === type
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                } ${disabled || mode === 'edit' ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <input
                  type="radio"
                  name="interestType"
                  value={type}
                  checked={data.interestType === type}
                  onChange={() => onChange('interestType', type)}
                  disabled={disabled || mode === 'edit'}
                  className="sr-only"
                />
                <span className="text-xs font-medium capitalize sm:text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Calculation Basis */}
        <div className="space-y-1.5">
          <Label>{t('girvi.calculationBasis')}</Label>
          <div className="flex gap-2 sm:gap-3">
            {(['monthly', 'daily'] as const).map(basis => (
              <label
                key={basis}
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 p-2.5 sm:p-3 transition-all ${
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
                <span className="text-xs font-medium capitalize sm:text-sm">{basis}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ── Payment Mode ──
           Mobile : 2×2 grid
           sm+    : 4 in a row
      ── */}
      <div className="space-y-1.5">
        <Label>
          {t('girvi.paymentModeAtJama')}
          <span className="ml-1 text-status-error">*</span>
        </Label>
        <p className="text-xs text-text-tertiary">{t('girvi.paymentModeHint')}</p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {GIRVI_PAYMENT_MODES.map(pm => (
            <button
              key={pm.value}
              type="button"
              onClick={() => onChange('paymentMode', pm.value)}
             disabled={disabled || mode === 'edit'}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 p-3 sm:gap-2 sm:p-4 transition-all ${
                data.paymentMode === pm.value
                  ? 'bg-accent/10 border-accent'
                  : 'hover:border-accent/50 border-border-primary bg-bg-secondary hover:bg-bg-tertiary'
              } ${disabled || mode === 'edit' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10 ${
                data.paymentMode === pm.value
                  ? 'bg-accent text-white'
                  : 'bg-bg-tertiary text-text-secondary'
              }`}>
                <pm.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className={`text-xs font-medium sm:text-sm ${
                data.paymentMode === pm.value ? 'text-accent' : 'text-text-primary'
              }`}>
                {pm.label}
              </span>
            </button>
          ))}
        </div>

        {/* Transaction reference — shown when non-cash */}
        {data.paymentMode && data.paymentMode !== 'cash' && (
          <Input
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
            className="mt-2"
          />
        )}

        {errors.paymentMode && (
          <p className="text-sm text-status-error">{errors.paymentMode}</p>
        )}
      </div>
    </div>
  )
}