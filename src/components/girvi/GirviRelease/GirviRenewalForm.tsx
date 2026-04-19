// FILE: src/components/girvi/GirviRelease/GirviRenewalForm.tsx

import { useState }             from 'react'
import { useTranslation }       from 'react-i18next'
import { Loader2, RefreshCw, TrendingUp } from 'lucide-react'
import { Button }               from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog }        from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { useGirviActions }      from '@/hooks/girvi/useGirviActions'
import { InterestCalculator }   from './InterestCalculator'
import { renewalSchema }        from '@/validators/girviValidation'
import type { GirviPaymentMode, RenewalSummary } from '@/types/girvi.types'


interface GirviRenewalFormProps {
  shopId:   string
  girviId:  string
  girviBalance?: {
    outstandingPrincipal: number
    totalAmountDue:       number
    interestRate:         number
    interestType:         string
    dueDate?:             string
    lastInterestCalcDate?: string
    girviDate:            string
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
  const { t }   = useTranslation()
  const today   = new Date().toISOString().split('T')[0]

  // Default new due date = 3 months from today
  const defaultNewDueDate = new Date()
  defaultNewDueDate.setMonth(defaultNewDueDate.getMonth() + 3)
  const defaultDueDateStr = defaultNewDueDate.toISOString().split('T')[0]

  const [interestPaid,    setInterestPaid]    = useState('')
  const [principalPaid,   setPrincipalPaid]   = useState('0')
  const [discountGiven,   setDiscountGiven]   = useState('0')
  const [renewalDate,     setRenewalDate]     = useState(today)
  const [newDueDate,      setNewDueDate]      = useState(defaultDueDateStr)
  const [newInterestRate, setNewInterestRate] = useState(
    girviBalance?.interestRate ? String(girviBalance.interestRate) : ''
  )
  const [changeRate,      setChangeRate]      = useState(false)
  const [paymentMode,     setPaymentMode]     = useState<GirviPaymentMode>('cash')
  const [transactionRef,  setTransactionRef]  = useState('')
  const [remarks,         setRemarks]         = useState('')
  const [errors,          setErrors]          = useState<Record<string, string>>({})
  const [showConfirm,     setShowConfirm]     = useState(false)

  const { renewGirvi, isRenewing } = useGirviActions(shopId)

  // ── Auto-fill from calculator ────────────────────────────────────────────

  const handleCalculatorApply = (data: {
    interestCalculated: number
    interestType: any
    toDate: string
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
        newInterestRate: changeRate && newInterestRate ? parseFloat(newInterestRate) : undefined,
        paymentMode,
        remarks:         remarks || undefined,
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

      <InterestCalculator
        shopId={shopId}
        girviId={girviId}
        onApply={handleCalculatorApply}
      />

      <Card className="border-border-primary bg-bg-secondary">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <RefreshCw className="h-4 w-4 text-accent" />
            {t('girvi.renewalDates')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">
                {t('girvi.renewalDate')} <span className="text-status-error">*</span>
              </label>
              <input
                type="date"
                value={renewalDate}
                max={today}
                onChange={(e) => setRenewalDate(e.target.value)}
                className={`h-10 w-full rounded-lg border bg-bg-secondary px-3 text-text-primary focus:border-accent focus:outline-none ${
                  err('renewalDate') ? 'border-status-error' : 'border-border-primary'
                }`}
              />
              {err('renewalDate') && <p className="text-xs text-status-error"> {err('renewalDate')}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">
                {t('girvi.newDueDate')} <span className="text-status-error">*</span>
              </label>
              <input
                type="date"
                value={newDueDate}
                min={today}
                onChange={(e) => setNewDueDate(e.target.value)}
                className={`h-10 w-full rounded-lg border bg-bg-secondary px-3 text-text-primary focus:border-accent focus:outline-none ${
                  err('newDueDate') ? 'border-status-error' : 'border-border-primary'
                }`}
              />
              {err('newDueDate') && <p className="text-xs text-status-error">{err('newDueDate')}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-text-primary">
              <input
                type="checkbox"
                checked={changeRate}
                onChange={(e) => setChangeRate(e.target.checked)}
                className="rounded"
              />
              <TrendingUp className="h-4 w-4 text-text-tertiary" />
              {t('girvi.changeInterestRate')}
            </label>

            {changeRate && (
              <div className="relative">
                <input
                  type="number"
                  value={newInterestRate}
                  min={0}
                  step={0.1}
                  onChange={(e) => setNewInterestRate(e.target.value)}
                  placeholder={t('girvi.newInterestRatePlaceholder')}
                  className={`h-10 w-full rounded-lg border bg-bg-secondary pr-20 pl-4 text-text-primary focus:border-accent focus:outline-none ${
                    err('newInterestRate') ? 'border-status-error' : 'border-border-primary'
                  }`}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-text-tertiary">% / month</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border-primary bg-bg-secondary">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-text-primary">
            {t('girvi.paymentDetails')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">
          {/* Amounts */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: t('girvi.interestPaid'),  value: interestPaid,  set: setInterestPaid,  required: true,  name: 'interestPaid'  },
              { label: t('girvi.principalPaid'), value: principalPaid, set: setPrincipalPaid, required: false, name: 'principalPaid' },
              { label: t('girvi.discountGiven'), value: discountGiven, set: setDiscountGiven, required: false, name: 'discountGiven' },
            ].map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="text-sm font-medium text-text-primary">
                  {field.label}
                  {field.required && <span className="ml-1 text-status-error">*</span>}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-text-tertiary">₹</span>
                  <input
                    type="number"
                    value={field.value}
                    min={0}
                    step={0.01}
                    onChange={(e) => field.set(e.target.value)}
                    className={`h-10 w-full rounded-lg border bg-bg-secondary pl-7 pr-3 text-text-primary focus:border-accent focus:outline-none ${
                      err(field.name) ? 'border-status-error' : 'border-border-primary'
                    }`}
                  />
                </div>
                {err(field.name) && <p className="text-xs text-status-error"> {err(field.name)}</p>}
              </div>
            ))}
          </div>

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

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              {t('girvi.paymentMode')} <span className="text-status-error">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PAYMENT_MODES.map((mode) => (
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
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder={t('girvi.transactionRefPlaceholder')}
                maxLength={200}
                className="mt-2 h-10 w-full rounded-lg border border-border-primary bg-bg-secondary px-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
              />
            )}
          </div>

          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={t('girvi.renewalRemarksPlaceholder')}
            rows={2}
            maxLength={500}
            className="w-full resize-none rounded-lg border border-border-primary bg-bg-secondary px-4 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
          />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isRenewing} className="flex-1">
            {t('common.cancel')}
          </Button>
        )}
        <Button type="button" onClick={handleSubmit} disabled={isRenewing} className="flex-1">
          {isRenewing
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('common.saving')}</>
            : <><RefreshCw className="mr-2 h-4 w-4" />{t('girvi.renewGirvi')}</>
          }
        </Button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={t('girvi.confirmRenewal')}
        description={t('girvi.confirmRenewalDescription', {
          amount:   netAmount.toLocaleString('en-IN'),
          dueDate:  new Date(newDueDate).toLocaleDateString('en-IN'),
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