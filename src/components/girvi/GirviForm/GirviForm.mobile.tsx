// FILE: src/components/girvi/GirviForm/GirviForm.mobile.tsx

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button }          from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Save, X, Loader2, ChevronLeft, ChevronRight, Phone, Mail, MapPin } from 'lucide-react'
import { ConfirmDialog }   from '@/components/ui/overlay/Dialog/ConfirmDialog'
    import { useGirviActions } from '@/hooks/girvi/useGirviActions'
import { useNotification } from '@/hooks/useNotification'
import { createGirviSchema } from '@/validators/girviValidation'
import { buildCreateGirviPayload, buildUpdateGirviPayload, calcFormTotals, calcLoanToValue, safeFloat, safeInt } from './GirviForm.utils'
import type { GirviFormProps, GirviFormData } from './GirviForm.types'

import { CustomerSection }          from './sections/CustomerSection'
import { ItemsSection }             from './sections/ItemsSection'
import { InterestSection }          from './sections/InterestSection'
import { BasicInfoSection }         from './sections/BasicInfoSection'
import { AdditionalDetailsSection } from '@/components/payments/PaymentForm/sections/AdditionalDetailsSection'
const RELATION_LABELS: Record<string, string> = {
  son_of:      'S/O',
  daughter_of: 'D/O',
  husband_of:  'H/O',
  wife_of:     'W/O',
  other:       'Rel.',
}

const CustomerViewCard = ({ customer }: { customer: any }) => {
  if (!customer) return null

  const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
  const relationLabel = customer.relationType
    ? RELATION_LABELS[customer.relationType] ?? 'Rel.'
    : null

  return (
    <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">
          {customer.firstName?.[0]?.toUpperCase()}
          {customer.lastName?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-text-primary">{fullName}</p>
          {customer.customerCode && (
            <p className="text-xs text-text-tertiary">#{customer.customerCode}</p>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        {customer.phone && (
          <p className="flex items-center gap-2 text-text-secondary">
            <Phone className="h-3.5 w-3.5 flex-shrink-0 text-text-tertiary" />
            {customer.phone}
          </p>
        )}
        {customer.email && (
          <p className="flex items-center gap-2 text-text-secondary">
            <Mail className="h-3.5 w-3.5 flex-shrink-0 text-text-tertiary" />
            {customer.email}
          </p>
        )}
        {customer.relationName && relationLabel && (
          <p className="text-text-secondary">
            <span className="font-medium text-text-primary">{relationLabel}</span>{' '}
            {customer.relationName}
          </p>
        )}
        {customer.jaati && (
          <p className="text-text-secondary">
            Jaati:{' '}
            <span className="font-medium text-text-primary">{customer.jaati}</span>
          </p>
        )}
        {customer.address?.city && (
          <p className="flex items-center gap-2 text-text-secondary">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-text-tertiary" />
            {customer.address.city}
          </p>
        )}
      </div>
    </div>
  )
}
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

  const defaults: Partial<GirviFormData> = {
    interestType:     'simple',
    calculationBasis: 'monthly',
    paymentMode:      'cash',
    girviDate:        new Date().toISOString(),
    items:            [{ itemName: '', itemType: 'gold', quantity: 1, grossWeight: '' as any, lessWeight: 0, condition: 'good' }],
  }

  const [formData, setFormData] = useState<Partial<GirviFormData>>({
    ...defaults,
    ...initialData,
  })

  // initialData baad mein aaye (edit mode async fetch) toh sync karo
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData({ ...defaults, ...initialData })
    }
  }, [initialData])
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
  // Edit mode mein sirf basic check — createGirviSchema skip karo
  if (mode !== 'edit') {
    try {
      createGirviSchema.parse({
        ...formData,
        principalAmount: safeFloat(formData.principalAmount, 0),
        interestRate:    safeFloat(formData.interestRate, 0),
        items: (formData.items || []).map(item => ({
          ...item,
          grossWeight:    safeFloat(item.grossWeight, 0),
          lessWeight:     safeFloat(item.lessWeight,  0),
          quantity:       safeInt(item.quantity, 1),
          tunch:          safeFloat(item.tunch),
          ratePerGram:    safeFloat(item.ratePerGram),
          approxValue:    safeFloat(item.approxValue),
          userGivenValue: safeFloat(item.userGivenValue),
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
  }
  setShowConfirm(true)
}

const handleConfirmedSubmit = async () => {
  const setFormErrors = (apiErrors: Record<string, string>) => setErrors(apiErrors)

  const result = mode === 'edit' && girviId
    ? await updateGirvi(girviId, buildUpdateGirviPayload(formData), setFormErrors)
    : await createGirvi(buildCreateGirviPayload(formData) as any, setFormErrors)

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
      case 'customer':
        return mode === 'view' ? (
          <CustomerViewCard
            customer={{
              firstName:    formData.customerName?.split(' ')[0] ?? '',
              lastName:     formData.customerName?.split(' ').slice(1).join(' ') ?? '',
              phone:        formData.customerPhone,
              email:        formData.customerEmail,
              customerCode: formData._customerMeta?.customerCode,
              relationType: formData._customerMeta?.relationType,
              relationName: formData._customerMeta?.relationName,
              jaati:        formData._customerMeta?.jaati,
              address:      formData._customerMeta?.address,
            }}
          />
        ) : (
          <CustomerSection {...sectionProps} />
        )
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