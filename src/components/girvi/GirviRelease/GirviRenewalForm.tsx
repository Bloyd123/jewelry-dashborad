// FILE: src/components/girvi/GirviRelease/GirviRenewalForm.tsx

import { useState }           from 'react'
import { useTranslation }     from 'react-i18next'
import { Loader2, RefreshCw, TrendingUp } from 'lucide-react'
import { Button }             from '@/components/ui/button'
import { Input }              from '@/components/ui/input'
import { Label }              from '@/components/ui/label'
import { Switch }             from '@/components/ui/switch'
import { Textarea }           from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog }      from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { useGirviActions }    from '@/hooks/girvi/useGirviActions'
import { InterestCalculator } from './InterestCalculator'
import { renewalSchema }      from '@/validators/girviValidation'
import type { GirviPaymentMode, RenewalSummary } from '@/types/girvi.types'
import { FormDatePicker } from '@/components/forms/FormDatePicker'


interface GirviRenewalFormProps {
  shopId:   string
  girviId:  string
  girviBalance?: {
    outstandingPrincipal:  number
    totalAmountDue:        number
    interestRate:          number
    interestType:          string
    dueDate?:              string
    lastInterestCalcDate?: string
    girviDate:             string
  }
  onSuccess?: (summary: RenewalSummary) => void
  onCancel?:  () => void
}

const PAYMENT_MODES: { value: GirviPaymentMode; label: string }[] = [
  { value: 'cash',          label: ' Cash'  },
  { value: 'upi',           label: 'UPI'   },
  { value: 'bank_transfer', label: 'Bank'  },
  { value: 'cheque',        label: 'Cheque'},
]

export const GirviRenewalForm = ({
  shopId,
  girviId,
  girviBalance,
  onSuccess,
  onCancel,
}: GirviRenewalFormProps) => {
  const { t } = useTranslation()

  const defaultNewDueDate = new Date()
defaultNewDueDate.setMonth(defaultNewDueDate.getMonth() + 3)

const [renewalDate, setRenewalDate] = useState(new Date().toISOString())
const [newDueDate,  setNewDueDate]  = useState(defaultNewDueDate.toISOString())

  const [interestPaid,    setInterestPaid]    = useState('')
  const [principalPaid,   setPrincipalPaid]   = useState('0')
  const [discountGiven,   setDiscountGiven]   = useState('0')
  const [newInterestRate, setNewInterestRate] = useState(
    girviBalance?.interestRate ? String(girviBalance.interestRate) : ''
  )
  const [changeRate,     setChangeRate]     = useState(false)
  const [paymentMode,    setPaymentMode]    = useState<GirviPaymentMode>('cash')
  const [transactionRef, setTransactionRef] = useState('')
  const [remarks,        setRemarks]        = useState('')
  const [errors,         setErrors]         = useState<Record<string, string>>({})
  const [showConfirm,    setShowConfirm]    = useState(false)

  const { renewGirvi, isRenewing } = useGirviActions(shopId)

  // ── Calculator apply ──────────────────────────────────────────────────────

  const handleCalculatorApply = (data: {
    interestCalculated: number
    interestType:       any
    toDate:             string
  }) => {
    setInterestPaid(String(data.interestCalculated))
    setRenewalDate(data.toDate)
  }

  const netAmount = Math.max(
    0,
    parseFloat(interestPaid  || '0') +
    parseFloat(principalPaid || '0') -
    parseFloat(discountGiven || '0')
  )

  const newPrincipal = Math.max(
    0,
    (girviBalance?.outstandingPrincipal || 0) - parseFloat(principalPaid || '0')
  )

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    try {
      renewalSchema.parse({
        interestPaid:    parseFloat(interestPaid  || '0'),
        principalPaid:   parseFloat(principalPaid || '0'),
        discountGiven:   parseFloat(discountGiven || '0'),
        newDueDate,
        renewalDate,
        newInterestRate: changeRate && newInterestRate
          ? parseFloat(newInterestRate)
          : undefined,
        paymentMode,
      })
    } catch (error: any) {
      const ve: Record<string, string> = {}
      error.issues?.forEach((e: any) => {
        const path = e.path?.join('.')
        if (path) ve[path] = e.message
      })
      setErrors(ve)
      return
    }
    setErrors({})
    setShowConfirm(true)
  }

  const handleConfirmed = async () => {
    const setFormErrors = (e: Record<string, string>) => setErrors(e)
    const result = await renewGirvi(
      girviId,
      {
        interestPaid:    parseFloat(interestPaid  || '0'),
        principalPaid:   parseFloat(principalPaid || '0') || undefined,
        discountGiven:   parseFloat(discountGiven || '0') || undefined,
        newDueDate,
        renewalDate,
        newInterestRate: changeRate && newInterestRate
          ? parseFloat(newInterestRate)
          : undefined,
        paymentMode,
        remarks: remarks || undefined,
      },
      setFormErrors
    )

    if (result.success) {
      setShowConfirm(false)
      onSuccess?.(result.data!.renewalSummary)
    }
  }

  const err = (field: string) => errors[field]

  return (
    <div className="space-y-6">

      {/* Balance Summary */}
      {girviBalance && (
        <div className="grid grid-cols-3 gap-3 rounded-lg bg-bg-tertiary p-4">
          <div className="text-center">
            <p className="text-xs text-text-tertiary">{t('girvi.outstandingPrincipal')}</p>
            <p className="text-lg font-bold text-status-error">
              ₹{girviBalance.outstandingPrincipal.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-tertiary">{t('girvi.interestRate')}</p>
            <p className="text-lg font-bold text-text-primary">
              {girviBalance.interestRate}% / mo
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-tertiary">{t('girvi.currentDueDate')}</p>
            <p className="text-sm font-bold text-text-primary">
              {girviBalance.dueDate
                ? new Date(girviBalance.dueDate).toLocaleDateString('en-IN')
                : '—'
              }
            </p>
          </div>
        </div>
      )}

      {/* Interest Calculator */}
      <InterestCalculator
        shopId={shopId}
        girviId={girviId}
        onApply={handleCalculatorApply}
      />

      {/* Renewal Dates */}
      <Card className="border-border-primary bg-bg-secondary">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <RefreshCw className="h-4 w-4 text-accent" />
            {t('girvi.renewalDates')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
<FormDatePicker
  name="renewalDate"
  label={t('girvi.renewalDate')}
  value={renewalDate}
  onChange={(name, value) => setRenewalDate(value)}
  maxDate={new Date()}
  error={err('renewalDate')}
  required
/>
<FormDatePicker
  name="newDueDate"
  label={t('girvi.newDueDate')}
  value={newDueDate}
  onChange={(name, value) => setNewDueDate(value)}
  minDate={new Date()}
  error={err('newDueDate')}
  required
/>
          </div>

          {/* Change Interest Rate Toggle */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                id="change-rate-switch"
                checked={changeRate}
                onCheckedChange={setChangeRate}
              />
              <Label htmlFor="change-rate-switch" className="flex cursor-pointer items-center gap-2">
                <TrendingUp className="h-4 w-4 text-text-tertiary" />
                {t('girvi.changeInterestRate')}
              </Label>
            </div>

            {changeRate && (
              <div className="relative">
                <Input
                  type="number"
                  value={newInterestRate}
                  min={0}
                  step={0.1}
                  onChange={e => setNewInterestRate(e.target.value)}
                  placeholder={t('girvi.newInterestRatePlaceholder')}
                  className={`pr-24 ${err('newInterestRate') ? 'border-status-error' : ''}`}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-text-tertiary">% / month</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card className="border-border-primary bg-bg-secondary">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-text-primary">
            {t('girvi.paymentDetails')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">

          {/* Amount Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: t('girvi.interestPaid'),  value: interestPaid,  set: setInterestPaid,  required: true,  name: 'interestPaid'  },
              { label: t('girvi.principalPaid'), value: principalPaid, set: setPrincipalPaid, required: false, name: 'principalPaid' },
              { label: t('girvi.discountGiven'), value: discountGiven, set: setDiscountGiven, required: false, name: 'discountGiven' },
            ].map(field => (
              <div key={field.name} className="space-y-1">
                <Label>
                  {field.label}
                  {field.required && <span className="ml-1 text-status-error">*</span>}
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-text-tertiary">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={field.value}
                    min={0}
                    step={0.01}
                    onChange={e => field.set(e.target.value)}
                    className={`pl-7 ${err(field.name) ? 'border-status-error' : ''}`}
                  />
                </div>
                {err(field.name) && (
                  <p className="text-xs text-status-error">{err(field.name)}</p>
                )}
              </div>
            ))}
          </div>

          {/* Net + New Principal */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between rounded-lg bg-accent/10 px-4 py-2">
              <span className="text-sm text-text-secondary">{t('girvi.netReceived')}</span>
              <span className="font-bold text-accent">₹{netAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-bg-tertiary px-4 py-2">
              <span className="text-sm text-text-secondary">{t('girvi.newPrincipal')}</span>
              <span className="font-bold text-text-primary">₹{newPrincipal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Payment Mode */}
          <div className="space-y-2">
            <Label>
              {t('girvi.paymentMode')} <span className="text-status-error">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PAYMENT_MODES.map(mode => (
                <label
                  key={mode.value}
                  className={`flex cursor-pointer items-center justify-center rounded-lg border-2 py-2.5 text-sm font-medium transition-all ${
                    paymentMode === mode.value
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                  }`}
                >
                  <input
                    type="radio"
                    name="renewalPaymentMode"
                    value={mode.value}
                    checked={paymentMode === mode.value}
                    onChange={() => setPaymentMode(mode.value)}
                    className="sr-only"
                  />
                  {mode.label}
                </label>
              ))}
            </div>

            {paymentMode !== 'cash' && (
              <Input
                type="text"
                value={transactionRef}
                onChange={e => setTransactionRef(e.target.value)}
                placeholder={t('girvi.transactionRefPlaceholder')}
                maxLength={200}
                className="mt-2"
              />
            )}
          </div>

          {/* Remarks */}
          <Textarea
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            placeholder={t('girvi.renewalRemarksPlaceholder')}
            rows={2}
            maxLength={500}
            className="resize-none"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isRenewing}
            className="flex-1"
          >
            {t('common.cancel')}
          </Button>
        )}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isRenewing}
          className="flex-1"
        >
          {isRenewing
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('common.saving')}</>
            : <><RefreshCw className="mr-2 h-4 w-4" />{t('girvi.renewGirvi')}</>
          }
        </Button>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={t('girvi.confirmRenewal')}
        description={t('girvi.confirmRenewalDescription', {
          amount:  netAmount.toLocaleString('en-IN'),
          dueDate: new Date(newDueDate).toLocaleDateString('en-IN'),
        })}
        variant="info"
        confirmLabel={t('girvi.renewGirvi')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmed}
        onCancel={() => setShowConfirm(false)}
        loading={isRenewing}
      />
    </div>
  )
}