// FILE: src/components/girvi/GirviRelease/GirviReleaseForm.tsx
// PATCH /shops/:shopId/girvi/:girviId/release
 
import { useState as useStateRelease } from 'react'
import { useTranslation as useTranslationRelease } from 'react-i18next'
import { Loader2 as Loader2Release, Unlock } from 'lucide-react'
import { Button as ButtonRelease }  from '@/components/ui/button'
import { Card as CardRelease, CardContent as CardContentRelease, CardHeader as CardHeaderRelease, CardTitle as CardTitleRelease } from '@/components/ui/card'
import { ConfirmDialog as ConfirmDialogRelease } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { useGirviActions as useGirviActionsRelease } from '@/hooks/girvi/useGirviActions'
import { useGirviById as useGirviByIdRelease }       from '@/hooks/girvi/useGirviById'
import { releaseGirviSchema } from '@/validators/girviValidation'
import { InterestCalculator } from './InterestCalculator'
import type { GirviInterestType } from '@/types/girvi.types'
 
interface GirviReleaseFormProps {
  shopId:    string
  girviId:   string
  onSuccess: () => void
  onCancel:  () => void
}
 
export const GirviReleaseForm = ({
  shopId,
  girviId,
  onSuccess,
  onCancel,
}: GirviReleaseFormProps) => {
  const { t }   = useTranslationRelease()
  const { girvi, outstandingPrincipal } = useGirviByIdRelease(shopId, girviId)
  const { releaseGirvi, isReleasing }   = useGirviActionsRelease(shopId)
 
  const [formData, setFormData] = useStateRelease({
    releaseInterestType: 'simple' as GirviInterestType,
    interestReceived:    '',
    principalReceived:   String(outstandingPrincipal || ''),
    discountGiven:       '0',
    paymentDate:         new Date().toISOString().split('T')[0],
    paymentMode:         'cash' as const,
    transactionReference: '',
    remarks:             '',
  })
  const [errors,      setErrors]      = useStateRelease<Record<string, string>>({})
  const [showConfirm, setShowConfirm] = useStateRelease(false)
 
  const onChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }
 
  const handleCalculatorApply = (data: { interestCalculated: number; interestType: GirviInterestType; toDate: string }) => {
    setFormData(prev => ({
      ...prev,
      interestReceived:    String(data.interestCalculated),
      releaseInterestType: data.interestType,
      paymentDate:         data.toDate,
    }))
  }
 
  const handleSubmit = () => {
    try {
      releaseGirviSchema.parse({
        ...formData,
        interestReceived:  parseFloat(formData.interestReceived  || '0'),
        principalReceived: parseFloat(formData.principalReceived || '0'),
        discountGiven:     parseFloat(formData.discountGiven     || '0'),
      })
    } catch (error: any) {
      const ve: Record<string, string> = {}
      error.issues?.forEach((e: any) => { if (e.path?.[0]) ve[String(e.path[0])] = e.message })
      setErrors(ve)
      return
    }
    setShowConfirm(true)
  }
 
  const handleConfirmed = async () => {
    const setFormErrors = (apiErrors: Record<string, string>) => setErrors(apiErrors)
    const result = await releaseGirvi(girviId, {
      releaseInterestType:  formData.releaseInterestType,
      interestReceived:     parseFloat(formData.interestReceived  || '0'),
      principalReceived:    parseFloat(formData.principalReceived || '0'),
      discountGiven:        parseFloat(formData.discountGiven     || '0'),
      paymentDate:          formData.paymentDate,
      paymentMode:          formData.paymentMode,
      transactionReference: formData.transactionReference || undefined,
      remarks:              formData.remarks || undefined,
    }, setFormErrors)
 
    if (result.success) {
      setShowConfirm(false)
      onSuccess()
    }
  }
 
  const netReceived =
    parseFloat(formData.interestReceived  || '0') +
    parseFloat(formData.principalReceived || '0') -
    parseFloat(formData.discountGiven     || '0')
 
  const PAYMENT_MODES = [
    { value: 'cash',          label: '💵 Cash' },
    { value: 'upi',           label: '📲 UPI' },
    { value: 'bank_transfer', label: '🏦 Bank' },
    { value: 'cheque',        label: '📄 Cheque' },
  ]
 
  return (
    <div className="space-y-6">
      <InterestCalculator
        shopId={shopId}
        girviId={girviId}
        onApply={handleCalculatorApply}
      />
 
      <CardRelease className="border-border-primary bg-bg-secondary">
        <CardHeaderRelease>
          <CardTitleRelease className="flex items-center gap-2 text-text-primary">
            <Unlock className="h-5 w-5 text-accent" />
            {t('girvi.releaseDetails')}
          </CardTitleRelease>
        </CardHeaderRelease>
        <CardContentRelease className="space-y-4">
 
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              {t('girvi.releaseInterestType')} <span className="text-status-error">*</span>
            </label>
            <div className="flex gap-3">
              {(['simple', 'compound'] as const).map(type => (
                <label key={type} className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 py-2 text-sm font-medium transition-all ${formData.releaseInterestType === type ? 'border-accent bg-accent/10 text-accent' : 'border-border-primary bg-bg-tertiary text-text-secondary'}`}>
                  <input type="radio" name="releaseInterestType" value={type} checked={formData.releaseInterestType === type} onChange={() => onChange('releaseInterestType', type)} className="sr-only" />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>
 
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { name: 'interestReceived',  label: t('girvi.interestReceived'),  required: true  },
              { name: 'principalReceived', label: t('girvi.principalReceived'), required: true  },
              { name: 'discountGiven',     label: t('girvi.discountGiven'),     required: false },
            ].map(field => (
              <div key={field.name} className="space-y-1">
                <label className="text-sm font-medium text-text-primary">
                  {field.label} {field.required && <span className="text-status-error">*</span>}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-text-tertiary">₹</span>
                  <input
                    type="number"
                    value={(formData as any)[field.name]}
                    min={0}
                    step={0.01}
                    onChange={e => onChange(field.name, e.target.value)}
                    className={`h-10 w-full rounded-lg border bg-bg-primary pl-7 pr-3 text-text-primary focus:border-accent focus:outline-none ${errors[field.name] ? 'border-status-error' : 'border-border-primary'}`}
                  />
                </div>
                {errors[field.name] && <p className="text-xs text-status-error">{errors[field.name]}</p>}
              </div>
            ))}
          </div>
 
          <div className="flex items-center justify-between rounded-lg bg-accent/10 px-4 py-3">
            <span className="font-medium text-text-primary">{t('girvi.netAmountReceived')}</span>
            <span className="text-2xl font-bold text-accent">
              ₹{Math.max(0, netReceived).toLocaleString('en-IN')}
            </span>
          </div>
 
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">
                {t('girvi.paymentDate')} <span className="text-status-error">*</span>
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={e => onChange('paymentDate', e.target.value)}
                className={`h-10 w-full rounded-lg border bg-bg-secondary px-3 text-text-primary focus:border-accent focus:outline-none ${errors.paymentDate ? 'border-status-error' : 'border-border-primary'}`}
              />
              {errors.paymentDate && <p className="text-xs text-status-error">{errors.paymentDate}</p>}
            </div>
          </div>
 
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              {t('girvi.paymentMode')} <span className="text-status-error">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PAYMENT_MODES.map(mode => (
                <label key={mode.value} className={`flex cursor-pointer items-center justify-center rounded-lg border-2 py-2 text-sm font-medium transition-all ${formData.paymentMode === mode.value ? 'border-accent bg-accent/10 text-accent' : 'border-border-primary bg-bg-secondary text-text-secondary'}`}>
                  <input type="radio" name="paymentMode" value={mode.value} checked={formData.paymentMode === mode.value} onChange={() => onChange('paymentMode', mode.value)} className="sr-only" />
                  {mode.label}
                </label>
              ))}
            </div>
          </div>
 
          {formData.paymentMode !== 'cash' && (
            <input
              type="text"
              value={formData.transactionReference}
              onChange={e => onChange('transactionReference', e.target.value)}
              placeholder={t('girvi.transactionRefPlaceholder')}
              className="h-10 w-full rounded-lg border border-border-primary bg-bg-secondary px-4 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
            />
          )}
 
          <textarea
            value={formData.remarks}
            onChange={e => onChange('remarks', e.target.value)}
            placeholder={t('girvi.remarksPlaceholder')}
            rows={2}
            maxLength={500}
            className="w-full rounded-lg border border-border-primary bg-bg-secondary px-4 py-2 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
          />
 
          <div className="flex gap-3">
            <ButtonRelease type="button" variant="outline" onClick={onCancel} className="flex-1">
              {t('common.cancel')}
            </ButtonRelease>
            <ButtonRelease type="button" onClick={handleSubmit} disabled={isReleasing} className="flex-1">
              {isReleasing
                ? <><Loader2Release className="mr-2 h-4 w-4 animate-spin" />{t('common.saving')}</>
                : <><Unlock className="mr-2 h-4 w-4" />{t('girvi.releaseGirvi')}</>
              }
            </ButtonRelease>
          </div>
        </CardContentRelease>
      </CardRelease>
 
      <ConfirmDialogRelease
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={t('girvi.confirmRelease')}
        description={t('girvi.confirmReleaseDescription', { amount: Math.max(0, netReceived).toLocaleString('en-IN') })}
        variant="warning"
        confirmLabel={t('girvi.releaseGirvi')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmed}
        onCancel={() => setShowConfirm(false)}
        loading={isReleasing}
      />
    </div>
  )
}
 