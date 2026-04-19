// FILE: src/components/girvi/GirviForm/GirviForm.mobile.tsx

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button }          from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Save, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { ConfirmDialog }   from '@/components/ui/overlay/Dialog/ConfirmDialog'
    import { useGirviActions } from '@/hooks/girvi/useGirviActions'
import { useNotification } from '@/hooks/useNotification'
import { createGirviSchema } from '@/validators/girviValidation'
import { buildGirviPayload, calcFormTotals } from './GirviForm.utils'
import type { GirviFormProps, GirviFormData } from './GirviForm.types'

import { CustomerSection }          from './sections/CustomerSection'
import { ItemsSection }             from './sections/ItemsSection'
import { InterestSection }          from './sections/InterestSection'
import { BasicInfoSection }         from './sections/BasicInfoSection'
import { AdditionalDetailsSection } from '@/components/payments/PaymentForm/sections/AdditionalDetailsSection'

const STEPS = [
  { id: 'customer',    label: 'Customer'    },
  { id: 'items',       label: 'Pledge Items'},
  { id: 'financial',   label: 'Financial'   },
  { id: 'basic-info',  label: 'Dates'       },
  { id: 'additional',  label: 'Additional'  },
]

export default function GirviFormMobile({
  initialData = {},
  shopId,
  girviId,
  onSuccess,
  onCancel,
  mode = 'create',
}: GirviFormProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<GirviFormData>>({
    interestType:     'simple',
    calculationBasis: 'monthly',
    paymentMode:      'cash',
    girviDate:        new Date().toISOString(),
    items:            [{ itemName: '', itemType: 'gold', quantity: 1, grossWeight: '' as any, lessWeight: 0, condition: 'good' }],
    ...initialData,
  })
  const [errors,            setErrors]     = useState<Record<string, string>>({})
  const [showConfirmDialog, setShowConfirm] = useState(false)

  const { createGirvi, updateGirvi, isCreating, isUpdating } = useGirviActions(shopId)
  const { showError } = useNotification()
  const isLoading = isCreating || isUpdating

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  const handleBlur = (name: string) => {}

  const handleSubmit = async () => {
    try {
      createGirviSchema.parse({
        ...formData,
        principalAmount: parseFloat(String(formData.principalAmount)),
        interestRate:    parseFloat(String(formData.interestRate)),
items: (formData.items || []).map(item => ({
  ...item,
  grossWeight: parseFloat(String(item.grossWeight || 0)),
  lessWeight:  parseFloat(String(item.lessWeight  || 0)),
  quantity:    Number(item.quantity) || 1,

tunch: item.tunch !== '' && item.tunch !== undefined
  ? Number(item.tunch)
  : undefined,
ratePerGram: item.ratePerGram ? Number(item.ratePerGram) : undefined,
approxValue: item.approxValue ? Number(item.approxValue) : undefined,

userGivenValue: item.userGivenValue !== '' 
  ? Number(item.userGivenValue) 
  : undefined,
}))
      })
    } catch (error: any) {
      const validationErrors: Record<string, string> = {}
      error.issues?.forEach((err: any) => {
        const path = err.path?.join('.')
        if (path) validationErrors[path] = err.message
      })
      setErrors(validationErrors)
      showError(
        Object.values(validationErrors).slice(0, 3).map(m => `• ${m}`).join('\n'),
        t('validation.failed')
      )
      return
    }
    setShowConfirm(true)
  }

  const handleConfirmedSubmit = async () => {
    const payload      = buildGirviPayload(formData)
    const setFormErrors = (apiErrors: Record<string, string>) => setErrors(apiErrors)

    const result = mode === 'edit' && girviId
      ? await updateGirvi(girviId, payload, setFormErrors)
      : await createGirvi(payload as any, setFormErrors)

    if (result.success) {
      setShowConfirm(false)
      onSuccess?.()
    } else if (result.error) {
      showError(result.error, t('girvi.errors.errorTitle'))
    }
  }

  const sectionProps = {
    data:     formData,
    errors,
    onChange: handleChange,
    onBlur:   handleBlur,
    disabled: isLoading || mode === 'view',
  }

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'customer':   return <CustomerSection   {...sectionProps} />
      case 'items':      return <ItemsSection      {...sectionProps} />
      case 'financial':  return <InterestSection   {...sectionProps} />
      case 'basic-info': return <BasicInfoSection  {...sectionProps} />
      case 'additional': return <AdditionalDetailsSection {...sectionProps} />
      default: return null
    }
  }

  const totals    = calcFormTotals(formData.items || [])
  const principal = parseFloat(String(formData.principalAmount || 0))

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <div className="sticky top-0 z-10 border-b border-border-primary bg-bg-secondary p-4">
        <h1 className="text-xl font-bold text-text-primary">
          {mode === 'create' ? t('girvi.createGirvi') : mode === 'edit' ? t('girvi.editGirvi') : t('girvi.viewGirvi')}
        </h1>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {t('common.step')} {currentStep + 1} {t('common.of')} {STEPS.length}
          </span>
          <span className="text-sm font-medium text-accent">
            {STEPS[currentStep].label}
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-4">
        <Card className="border-border-primary bg-bg-secondary">
          <CardContent className="p-4">{renderStep()}</CardContent>
        </Card>

        <Card className="mt-4 border-border-primary bg-bg-secondary">
          <CardContent className="p-4">
            <h3 className="mb-3 font-bold text-text-primary">{t('girvi.summary')}</h3>
            <div className="space-y-1.5 text-sm">
              {formData.customerName && (
                <div className="flex justify-between">
                  <span className="text-text-tertiary">{t('girvi.customer')}:</span>
                  <span className="font-semibold text-text-primary">{formData.customerName}</span>
                </div>
              )}
              {(formData.items?.length ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-tertiary">{t('girvi.items')}:</span>
                  <span className="font-semibold text-text-primary">
                    {formData.items?.length} · {totals.totalNetWeight.toFixed(2)}g net
                  </span>
                </div>
              )}
              {principal > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-tertiary">{t('girvi.principal')}:</span>
                  <span className="font-bold text-accent">₹{principal.toLocaleString('en-IN')}</span>
                </div>
              )}
              {formData.interestRate && (
                <div className="flex justify-between">
                  <span className="text-text-tertiary">{t('girvi.interest')}:</span>
                  <span className="font-semibold text-text-primary">
                    {formData.interestRate}% / mo
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border-primary bg-bg-secondary p-4">
        <div className="flex gap-2">
          {currentStep > 0 ? (
            <Button type="button" variant="outline" onClick={() => setCurrentStep(s => s - 1)} disabled={isLoading} className="flex-1">
              <ChevronLeft className="mr-2 h-4 w-4" />{t('common.previous')}
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
              <X className="mr-2 h-4 w-4" />{t('common.cancel')}
            </Button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <Button type="button" onClick={() => setCurrentStep(s => s + 1)} disabled={isLoading} className="flex-1">
              {t('common.next')}<ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('common.saving')}</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />{mode === 'create' ? t('common.save') : t('common.update')}</>
              )}
            </Button>
          )}
        </div>

        <ConfirmDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirm}
          title={mode === 'create' ? t('girvi.confirmCreate') : t('girvi.confirmUpdate')}
          description={mode === 'create' ? t('girvi.confirmCreateDescription') : t('girvi.confirmUpdateDescription')}
          variant={mode === 'create' ? 'success' : 'info'}
          confirmLabel={mode === 'create' ? t('common.create') : t('common.update')}
          cancelLabel={t('common.cancel')}
          onConfirm={handleConfirmedSubmit}
          onCancel={() => setShowConfirm(false)}
          loading={isLoading}
        />
      </div>
    </div>
  )
}