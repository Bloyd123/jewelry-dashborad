// FILE: src/components/scheme/EnrollmentForm/EnrollmentForm.tsx

import { useState }       from 'react'
import { useTranslation } from 'react-i18next'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/overlay/Modal'
import { Button }   from '@/components/ui/button'
import { Loader2, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useSchemeActions } from '@/hooks/scheme/useSchemeActions'
import { useNotification }  from '@/hooks/useNotification'
import { CustomerSearchStep } from './steps/CustomerSearchStep'
import { EnrollmentDetailsStep } from './steps/EnrollmentDetailsStep'
import { InitialPaymentStep }    from './steps/InitialPaymentStep'
import type { EnrollmentFormData, EnrollmentFormProps } from './EnrollmentForm.types'

// ─────────────────────────────────────────────
// STEPS
// ─────────────────────────────────────────────
const STEPS = [
  { id: 'customer',  label: 'Customer'   },
  { id: 'details',   label: 'Details'    },
  { id: 'payment',   label: 'Payment'    },
]

const DEFAULT_DATA: EnrollmentFormData = {
  customerId:         '',
  installmentAmount:  0,
  startDate:          new Date().toISOString().split('T')[0],
  notes:              '',
  hasInitialPayment:  false,
}

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  shopId,
  schemeId,
  scheme,
  open,
  onClose,
  onSuccess,
}) => {
  const { t }                  = useTranslation()
  const { showError }          = useNotification()
  const { enrollCustomer, isEnrolling } = useSchemeActions(shopId)

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData]       = useState<EnrollmentFormData>({
    ...DEFAULT_DATA,
    installmentAmount: scheme.installments.installmentAmount,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ─────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 0) {
      if (!formData.customerId) {
        newErrors.customerId = t('scheme.enrollment.customerRequired')
      }
    }

    if (currentStep === 1) {
      if (!formData.installmentAmount || formData.installmentAmount <= 0) {
        newErrors.installmentAmount = t('scheme.enrollment.amountRequired')
      }
      if (!formData.startDate) {
        newErrors.startDate = t('scheme.enrollment.startDateRequired')
      }
    }

    if (currentStep === 2 && formData.hasInitialPayment) {
      if (!formData.initialPayment?.amount || formData.initialPayment.amount <= 0) {
        newErrors['initialPayment.amount'] = t('scheme.enrollment.paymentAmountRequired')
      }
      if (!formData.initialPayment?.paymentMode) {
        newErrors['initialPayment.paymentMode'] = t('scheme.enrollment.paymentModeRequired')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep()) return
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
    setErrors({})
  }

  const handleClose = () => {
    setCurrentStep(0)
    setFormData({
      ...DEFAULT_DATA,
      installmentAmount: scheme.installments.installmentAmount,
    })
    setErrors({})
    onClose()
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    const payload: any = {
      customerId:        formData.customerId,
      installmentAmount: formData.installmentAmount,
      startDate:         formData.startDate,
      notes:             formData.notes || '',
    }

    if (formData.hasInitialPayment && formData.initialPayment?.amount) {
      payload.initialPayment = {
        amount:      formData.initialPayment.amount,
        paymentMode: formData.initialPayment.paymentMode,
      }
    }

    const result = await enrollCustomer(
      { schemeId, ...payload },
    )

    if (result.success) {
      handleClose()
      onSuccess()
    } else {
      showError(
        result.error || t('scheme.enrollment.enrollFailed'),
        t('scheme.errors.errorTitle')
      )
    }
  }

  // ─────────────────────────────────────────────
  // STEP RENDER
  // ─────────────────────────────────────────────
  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'customer':
        return (
          <CustomerSearchStep
            shopId={shopId}
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
        )
      case 'details':
        return (
          <EnrollmentDetailsStep
            scheme={scheme}
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
        )
      case 'payment':
        return (
          <InitialPaymentStep
            scheme={scheme}
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />
        )
      default:
        return null
    }
  }

  const isLastStep = currentStep === STEPS.length - 1

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <Modal open={open} onOpenChange={handleClose} size="md">
      <ModalHeader
        title={t('scheme.enrollment.enrollCustomer')}
        description={scheme.schemeName}
      />

      <ModalBody>
        {/* Progress Steps */}
        <div className="mb-6 flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-1 items-center">
              {/* Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex h-8 w-8 items-center justify-center rounded-full
                    text-sm font-medium transition-colors
                    ${index < currentStep
                      ? 'bg-accent text-white'
                      : index === currentStep
                      ? 'border-2 border-accent bg-bg-primary text-accent'
                      : 'border-2 border-border-primary bg-bg-primary text-text-tertiary'
                    }
                  `}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`mt-1 text-xs ${
                    index === currentStep
                      ? 'font-medium text-accent'
                      : 'text-text-tertiary'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`
                    mx-2 h-0.5 flex-1 transition-colors
                    ${index < currentStep ? 'bg-accent' : 'bg-border-primary'}
                  `}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[280px]">
          {renderStep()}
        </div>
      </ModalBody>

      <ModalFooter align="right">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? handleClose : handlePrevious}
          disabled={isEnrolling}
        >
          {currentStep === 0 ? (
            t('common.cancel')
          ) : (
            <>
              <ChevronLeft className="mr-1 h-4 w-4" />
              {t('common.previous')}
            </>
          )}
        </Button>

        {isLastStep ? (
          <Button
            onClick={handleSubmit}
            disabled={isEnrolling}
          >
            {isEnrolling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.saving')}
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t('scheme.actions.enroll')}
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {t('common.next')}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </ModalFooter>
    </Modal>
  )
}