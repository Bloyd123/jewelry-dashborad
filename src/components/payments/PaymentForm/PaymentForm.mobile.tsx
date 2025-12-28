// ============================================================================
// FILE: src/components/payment/PaymentForm/PaymentForm.mobile.tsx
// Mobile Layout for PaymentForm (Stepper Interface)
// ============================================================================

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Save, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaymentFormProps, PaymentFormData } from './PaymentForm.types'

// Import all sections
import { TransactionTypeSection } from './sections/TransactionTypeSection'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { PartyDetailsSection } from './sections/PartyDetailsSection'
import { ReferenceLinkSection } from './sections/ReferenceLinkSection'
import { PaymentModeSection } from './sections/PaymentModeSection'
import { ModeSpecificDetailsSection } from './sections/ModeSpecificDetailsSection'
import { AdditionalDetailsSection } from './sections/AdditionalDetailsSection'

const STEPS = [
  { id: 'transaction-type', label: 'Transaction Type' },
  { id: 'basic-info', label: 'Basic Info' },
  { id: 'party', label: 'Party Details' },
  { id: 'reference', label: 'Reference' },
  { id: 'payment-mode', label: 'Payment Mode' },
  { id: 'mode-details', label: 'Mode Details' },
  { id: 'additional', label: 'Additional' },
]

export default function PaymentFormMobile({
  initialData = {},
  shopId,
  paymentId,
  onSuccess,
  onCancel,
  mode = 'create',
}: PaymentFormProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<PaymentFormData>>({
    transactionType: 'receipt',
    paymentDate: new Date().toISOString(),
    paymentTime: new Date().toTimeString().slice(0, 5),
    referenceType: 'none',
    ...initialData,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  const handleNext = () => {
    // Skip mode-details step if no payment mode selected
    if (currentStep === 4 && !formData.paymentMode) {
      setCurrentStep(6)
    } else if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    // Skip mode-details step when going back if no payment mode
    if (currentStep === 6 && !formData.paymentMode) {
      setCurrentStep(4)
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    // Mock validation
    const newErrors: Record<string, string> = {}

    if (!formData.paymentType) newErrors.paymentType = t('validation.required')
    if (!formData.amount) newErrors.amount = t('validation.required')
    if (!formData.partyId) newErrors.partyId = t('validation.required')
    if (!formData.paymentMode) newErrors.paymentMode = t('validation.required')

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    // Mock delay
    setTimeout(() => {
      console.log('Mock Submit:', { mode, shopId, paymentId, formData })
      setIsLoading(false)
      onSuccess?.()
    }, 1000)
  }

  const renderCurrentStep = () => {
    const sectionProps = {
      data: formData,
      errors,
      onChange: handleChange,
      onBlur: handleBlur,
      disabled: isLoading || mode === 'view',
    }

    switch (STEPS[currentStep].id) {
      case 'transaction-type':
        return <TransactionTypeSection {...sectionProps} />
      case 'basic-info':
        return <BasicInfoSection {...sectionProps} />
      case 'party':
        return <PartyDetailsSection {...sectionProps} />
      case 'reference':
        return <ReferenceLinkSection {...sectionProps} />
      case 'payment-mode':
        return <PaymentModeSection {...sectionProps} />
      case 'mode-details':
        return <ModeSpecificDetailsSection {...sectionProps} />
      case 'additional':
        return <AdditionalDetailsSection {...sectionProps} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border-primary bg-bg-secondary p-4">
        <h1 className="text-xl font-bold text-text-primary">
          {mode === 'create'
            ? t('payment.createPayment')
            : mode === 'edit'
              ? t('payment.editPayment')
              : t('payment.viewPayment')}
        </h1>

        {/* Step Indicator */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {t('common.step')} {currentStep + 1} {t('common.of')} {STEPS.length}
          </span>
          <span className="text-sm font-medium text-accent">
            {STEPS[currentStep].label}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-bg-tertiary">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4">
        <Card className="border-border-primary bg-bg-secondary">
          <CardContent className="p-4">{renderCurrentStep()}</CardContent>
        </Card>

        {/* Payment Summary (Always Visible) */}
        <Card className="mt-4 border-border-primary bg-bg-secondary">
          <CardContent className="p-4">
            <h3 className="mb-3 font-bold text-text-primary">
              💰 {t('payment.summary')}
            </h3>
            <div className="space-y-2 text-sm">
              {formData.amount && (
                <div className="flex justify-between">
                  <span className="text-text-tertiary">
                    {t('payment.amount')}:
                  </span>
                  <span className="font-semibold text-text-primary">
                    ₹
                    {parseFloat(String(formData.amount)).toLocaleString(
                      'en-IN'
                    )}
                  </span>
                </div>
              )}
              {formData.transactionType && (
                <div className="flex justify-between">
                  <span className="text-text-tertiary">
                    {t('payment.type')}:
                  </span>
                  <span
                    className={`font-semibold ${
                      formData.transactionType === 'receipt'
                        ? 'text-status-success'
                        : 'text-status-error'
                    }`}
                  >
                    {formData.transactionType === 'receipt'
                      ? t('payment.receipt')
                      : t('payment.payment')}
                  </span>
                </div>
              )}
              {formData.paymentMode && (
                <div className="flex justify-between">
                  <span className="text-text-tertiary">
                    {t('payment.mode')}:
                  </span>
                  <span className="font-semibold capitalize text-text-primary">
                    {formData.paymentMode.replace('_', ' ')}
                  </span>
                </div>
              )}
              {formData.partyName && (
                <div className="flex justify-between">
                  <span className="text-text-tertiary">
                    {t('payment.party')}:
                  </span>
                  <span className="font-semibold text-text-primary">
                    {formData.partyName}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border-primary bg-bg-secondary p-4">
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={isLoading}
              className="flex-1"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('common.previous')}
            </Button>
          )}

          {currentStep === 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              {t('common.cancel')}
            </Button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1"
            >
              {t('common.next')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.saving')}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === 'create' ? t('common.save') : t('common.update')}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
