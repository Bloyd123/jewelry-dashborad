// FILE: src/components/girvi/GirviPayment/GirviPaymentForm.tsx
import { useState, useEffect } from 'react'
import { useTranslation }      from 'react-i18next'
import { Loader2, Calculator, Banknote, Smartphone, Building2, FileText, RefreshCw } from 'lucide-react'
import { Button }              from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog }       from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { useGirviPaymentActions } from '@/hooks/girvi/useGirviPaymentActions'
import { useGirviInterestLazy }   from '@/hooks/girvi/useGirviInterest'
import { addGirviPaymentSchema }  from '@/validators/girviValidation'
import type { GirviPaymentFormProps, GirviPaymentFormData } from './GirviPaymentForm.types'
import type { GirviInterestType, GirviPaymentType } from '@/types/girvi.types'


const PAYMENT_TYPES: { value: GirviPaymentType; label: string; desc: string }[] = [
  { value: 'interest_only',      label: 'Interest Only',       desc: 'Pay only interest'            },
  { value: 'principal_partial',  label: 'Partial Principal',   desc: 'Partial principal repayment'  },
  { value: 'principal_full',     label: 'Full Principal',      desc: 'Close the loan'               },
  { value: 'interest_principal', label: 'Interest + Principal', desc: 'Pay both together'           },
]

const PAYMENT_MODES = [
  { value: 'cash',          icon: Banknote,   label: 'Cash'     },
  { value: 'upi',           icon: Smartphone, label: 'UPI'      },
  { value: 'bank_transfer', icon: Building2,  label: 'Bank'     },
  { value: 'cheque',        icon: FileText,   label: 'Cheque'   },
]

export const GirviPaymentForm = ({
  shopId,
  girviId,
  girviBalance,
  onSuccess,
  onCancel,
}: GirviPaymentFormProps) => {
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]

  const [formData, setFormData] = useState<GirviPaymentFormData>({
    paymentType:          'interest_only',
    interestType:         girviBalance?.interestType ?? 'simple',
    interestFrom:         girviBalance?.lastInterestCalcDate
                            ? new Date(girviBalance.lastInterestCalcDate).toISOString().split('T')[0]
                            : today,
    interestTo:           today,
    interestReceived:     '',
    principalReceived:    '',
    discountGiven:        '0',
    paymentDate:          today,
    paymentMode:          'cash',
    transactionReference: '',
    remarks:              '',
  })

  const [errors,      setErrors]      = useState<Record<string, string>>({})
  const [showConfirm, setShowConfirm] = useState(false)

  const { addPayment, isAdding } = useGirviPaymentActions(shopId)
  const { calculate, calculation, isCalculating } = useGirviInterestLazy(shopId, girviId)

  useEffect(() => {
    if (formData.paymentType === 'principal_full' && girviBalance) {
      onChange('principalReceived', String(girviBalance.outstandingPrincipal))
    }
    if (formData.paymentType === 'interest_only') {
      onChange('principalReceived', '0')
    }
  }, [formData.paymentType, girviBalance])

  const onChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n })
  }

  const handleCalculateInterest = async () => {
    const result = await calculate({
      toDate:       formData.interestTo,
      interestType: formData.interestType as GirviInterestType,
    })
    if (result) {
      onChange('interestReceived', String(result.interestCalculated))
    }
  }

  const handleSubmit = () => {
    try {
      addGirviPaymentSchema.parse({
        ...formData,
        interestReceived:  parseFloat(String(formData.interestReceived  || 0)),
        principalReceived: parseFloat(String(formData.principalReceived || 0)),
        discountGiven:     parseFloat(String(formData.discountGiven     || 0)),
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
    setShowConfirm(true)
  }

  const handleConfirmed = async () => {
    const setFormErrors = (apiErrors: Record<string, string>) => setErrors(apiErrors)
    const result = await addPayment(
      girviId,
      {
        paymentType:          formData.paymentType,
        interestType:         formData.interestType as GirviInterestType,
        interestFrom:         formData.interestFrom,
        interestTo:           formData.interestTo,
        interestReceived:     parseFloat(String(formData.interestReceived  || 0)),
        principalReceived:    parseFloat(String(formData.principalReceived || 0)),
        discountGiven:        parseFloat(String(formData.discountGiven     || 0)),
        paymentDate:          formData.paymentDate,
        paymentMode:          formData.paymentMode as any,
        transactionReference: formData.transactionReference || undefined,
        remarks:              formData.remarks              || undefined,
      },
      setFormErrors
    )

    if (result.success) {
      setShowConfirm(false)
      onSuccess?.(result.data!.updatedGirvi)
    }
  }

  const interest   = parseFloat(String(formData.interestReceived  || 0))
  const principal  = parseFloat(String(formData.principalReceived || 0))
  const discount   = parseFloat(String(formData.discountGiven     || 0))
  const netAmount  = Math.max(0, interest + principal - discount)

  const err = (field: string) => errors[field]

  return (
    <div className="space-y-5">

      {girviBalance && (
        <div className="grid grid-cols-3 gap-3 rounded-lg bg-bg-tertiary p-4">
          <div className="text-center">
            <p className="text-xs text-text-tertiary">{t('girviPayment.outstandingPrincipal')}</p>
            <p className="text-lg font-bold text-status-error">
              ₹{girviBalance.outstandingPrincipal.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-tertiary">{t('girviPayment.interestRate')}</p>
            <p className="text-lg font-bold text-text-primary">
              {girviBalance.interestRate}% / mo
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-tertiary">{t('girviPayment.totalDue')}</p>
            <p className="text-lg font-bold text-accent">
              ₹{girviBalance.totalAmountDue.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t('girviPayment.paymentType')} <span className="text-status-error">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PAYMENT_TYPES.map((pt) => (
            <label
              key={pt.value}
              className={`flex cursor-pointer flex-col rounded-lg border-2 p-3 transition-all ${
                formData.paymentType === pt.value
                  ? 'border-accent bg-accent/10'
                  : 'border-border-primary bg-bg-secondary hover:bg-bg-tertiary'
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                value={pt.value}
                checked={formData.paymentType === pt.value}
                onChange={() => onChange('paymentType', pt.value)}
                className="sr-only"
              />
              <span className={`text-sm font-semibold ${formData.paymentType === pt.value ? 'text-accent' : 'text-text-primary'}`}>
                {pt.label}
              </span>
              <span className="mt-0.5 text-xs text-text-tertiary">{pt.desc}</span>
            </label>
          ))}
        </div>
        {err('paymentType') && <p className="text-sm text-status-error">{err('paymentType')}</p>}
      </div>

      <Card className="border-border-primary bg-bg-secondary">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Calculator className="h-4 w-4 text-accent" />
            {t('girviPayment.interestCalculation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pb-4">
          <div className="flex gap-3">
            {(['simple', 'compound'] as const).map((type) => (
              <label
                key={type}
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 py-2 text-sm font-medium transition-all ${
                  formData.interestType === type
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border-primary bg-bg-tertiary text-text-secondary'
                }`}
              >
                <input
                  type="radio"
                  name="interestType"
                  value={type}
                  checked={formData.interestType === type}
                  onChange={() => onChange('interestType', type)}
                  className="sr-only"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">{t('girviPayment.interestFrom')}</label>
              <input
                type="date"
                value={formData.interestFrom}
                onChange={(e) => onChange('interestFrom', e.target.value)}
                className="h-9 w-full rounded-lg border border-border-primary bg-bg-primary px-3 text-sm text-text-primary focus:border-accent focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">{t('girviPayment.interestTo')}</label>
              <input
                type="date"
                value={formData.interestTo}
                onChange={(e) => onChange('interestTo', e.target.value)}
                className="h-9 w-full rounded-lg border border-border-primary bg-bg-primary px-3 text-sm text-text-primary focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCalculateInterest}
            disabled={isCalculating}
            className="w-full"
          >
            {isCalculating
              ? <><RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />{t('common.calculating')}</>
              : <><Calculator className="mr-2 h-3.5 w-3.5" />{t('girviPayment.calculateAndFill')}</>
            }
          </Button>

          {calculation && (
            <div className="rounded-lg bg-accent/5 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">{t('girviPayment.days')}: {calculation.days}</span>
                <span className="font-semibold text-accent">
                  {t('girviPayment.interestAmount')}: ₹{calculation.interestCalculated.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            name:     'interestReceived',
            label:    t('girviPayment.interestReceived'),
            required: true,
            hint:     '',
          },
          {
            name:     'principalReceived',
            label:    t('girviPayment.principalReceived'),
            required: true,
            hint:     girviBalance
              ? `Max: ₹${girviBalance.outstandingPrincipal.toLocaleString('en-IN')}`
              : '',
          },
          {
            name:     'discountGiven',
            label:    t('girviPayment.discountGiven'),
            required: false,
            hint:     '',
          },
        ].map((field) => (
          <div key={field.name} className="space-y-1">
            <label className="text-sm font-medium text-text-primary">
              {field.label}{field.required && <span className="ml-1 text-status-error">*</span>}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-text-tertiary">₹</span>
              <input
                type="number"
                value={(formData as any)[field.name]}
                min={0}
                step={0.01}
                onChange={(e) => onChange(field.name, e.target.value)}
                className={`h-10 w-full rounded-lg border bg-bg-secondary pl-7 pr-3 text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent ${
                  err(field.name) ? 'border-status-error' : 'border-border-primary'
                }`}
              />
            </div>
            {field.hint && <p className="text-xs text-text-tertiary">{field.hint}</p>}
            {err(field.name) && <p className="text-xs text-status-error">⚠️ {err(field.name)}</p>}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-lg bg-accent/10 px-5 py-3">
        <div className="text-sm text-text-secondary">
          <p>{t('girviPayment.interest')} ₹{interest.toLocaleString('en-IN')}</p>
          <p>{t('girviPayment.principal')} ₹{principal.toLocaleString('en-IN')}</p>
          <p className="text-status-error">{t('girviPayment.discount')} — ₹{discount.toLocaleString('en-IN')}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-tertiary">{t('girviPayment.netReceived')}</p>
          <p className="text-2xl font-bold text-accent">₹{netAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t('girviPayment.paymentDate')} <span className="text-status-error">*</span>
        </label>
        <input
          type="date"
          value={formData.paymentDate}
          max={today}
          onChange={(e) => onChange('paymentDate', e.target.value)}
          className={`h-10 w-full rounded-lg border bg-bg-secondary px-3 text-text-primary focus:border-accent focus:outline-none ${
            err('paymentDate') ? 'border-status-error' : 'border-border-primary'
          }`}
        />
        {err('paymentDate') && <p className="text-sm text-status-error">{err('paymentDate')}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t('girviPayment.paymentMode')} <span className="text-status-error">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PAYMENT_MODES.map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => onChange('paymentMode', mode.value)}
              className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all ${
                formData.paymentMode === mode.value
                  ? 'border-accent bg-accent/10'
                  : 'border-border-primary bg-bg-secondary hover:bg-bg-tertiary'
              }`}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                formData.paymentMode === mode.value ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-secondary'
              }`}>
                <mode.icon className="h-4 w-4" />
              </div>
              <span className={`text-xs font-medium ${formData.paymentMode === mode.value ? 'text-accent' : 'text-text-primary'}`}>
                {mode.label}
              </span>
            </button>
          ))}
        </div>

        {formData.paymentMode !== 'cash' && (
          <input
            type="text"
            value={formData.transactionReference}
            onChange={(e) => onChange('transactionReference', e.target.value)}
            placeholder={
              formData.paymentMode === 'upi'    ? t('girviPayment.upiRefPlaceholder')
              : formData.paymentMode === 'cheque' ? t('girviPayment.chequeNoPlaceholder')
              : t('girviPayment.bankRefPlaceholder')
            }
            maxLength={200}
            className="mt-2 h-10 w-full rounded-lg border border-border-primary bg-bg-secondary px-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
          />
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-text-primary">{t('common.remarks')}</label>
        <textarea
          value={formData.remarks}
          onChange={(e) => onChange('remarks', e.target.value)}
          placeholder={t('girviPayment.remarksPlaceholder')}
          rows={2}
          maxLength={500}
          className="w-full resize-none rounded-lg border border-border-primary bg-bg-secondary px-4 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isAdding} className="flex-1">
            {t('common.cancel')}
          </Button>
        )}
        <Button type="button" onClick={handleSubmit} disabled={isAdding} className="flex-1">
          {isAdding
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('common.saving')}</>
            : t('girviPayment.addPayment')
          }
        </Button>
      </div>
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={t('girviPayment.confirmAdd')}
        description={t('girviPayment.confirmAddDescription', {
          amount: netAmount.toLocaleString('en-IN'),
        })}
        variant="success"
        confirmLabel={t('girviPayment.addPayment')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmed}
        onCancel={() => setShowConfirm(false)}
        loading={isAdding}
      />
    </div>
  )
}