// FILE: src/components/scheme/SchemeForm/SchemeForm.mobile.tsx

import { useState }        from 'react'
import { useTranslation }  from 'react-i18next'
import { useSchemeActions} from '@/hooks/scheme/useSchemeActions'
import { useNotification } from '@/hooks/useNotification'
import { createSchemeSchema } from '@/validators/schemeValidation'
import type { CreateSchemeInput } from '@/validators/schemeValidation'
import type { SchemeFormProps }   from './SchemeForm.types'
import { Button }          from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Save, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { ConfirmDialog }   from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { BasicInfoSection }    from './sections/BasicInfoSection'
import { InstallmentSection }  from './sections/InstallmentSection'
import { BonusSection }        from './sections/BonusSection'
import { EligibilitySection }  from './sections/EligibilitySection'
import { RedemptionSection }   from './sections/RedemptionSection'
import { ValiditySection }     from './sections/ValiditySection'
import { LimitsSection }       from './sections/LimitsSection'
import { MarketingSection }    from './sections/MarketingSection'

const STEPS = [
  { id: 'basic',       label: 'Basic Info'    },
  { id: 'installment', label: 'Installments'  },
  { id: 'bonus',       label: 'Bonus'         },
  { id: 'validity',    label: 'Validity'      },
  { id: 'eligibility', label: 'Eligibility'   },
  { id: 'redemption',  label: 'Redemption'    },
  { id: 'limits',      label: 'Limits'        },
  { id: 'marketing',   label: 'Marketing'     },
]

export default function SchemeFormMobile({
  shopId,
  schemeId,
  initialData = {},
  onSuccess,
  onCancel,
  mode = 'create',
}: SchemeFormProps) {
  const { t }                  = useTranslation()
  const { showSuccess, showError } = useNotification()
  const { createScheme, updateScheme, isCreating, isUpdating } =
    useSchemeActions(shopId)

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] =
    useState<Partial<CreateSchemeInput>>(initialData)
  const [errors,  setErrors]   = useState<Record<string, string>>({})
  const [showConfirm, setShowConfirm] = useState(false)

  const isLoading = isCreating || isUpdating

  // ─────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────
  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleBlur = (name: string) => {}

  const handleNext     = () => setCurrentStep(s => Math.min(s + 1, STEPS.length - 1))
  const handlePrevious = () => setCurrentStep(s => Math.max(s - 1, 0))

  const handleSubmit = async () => {
    try {
      createSchemeSchema.parse(formData)
    } catch (error: any) {
      const validationErrors: Record<string, string> = {}
      error.issues?.forEach((err: any) => {
        if (err.path?.length) {
          validationErrors[err.path.join('.')] = err.message
        }
      })
      setErrors(validationErrors)
      showError(
        Object.values(validationErrors).map(m => `• ${m}`).join('\n') ||
          t('scheme.errors.pleaseFillRequired'),
        t('scheme.errors.validationFailed')
      )
      return
    }
    setShowConfirm(true)
  }

  const handleConfirmedSubmit = async () => {
    const setFormErrors = (apiErrors: Record<string, string>) =>
      setErrors(apiErrors)

    try {
      const result =
        mode === 'edit' && schemeId
          ? await updateScheme(schemeId, formData as any, setFormErrors)
          : await createScheme(formData as any, setFormErrors)

      if (result.success) {
        showSuccess(
          mode === 'create'
            ? t('scheme.success.created')
            : t('scheme.success.updated'),
          mode === 'create'
            ? t('scheme.success.createdTitle')
            : t('scheme.success.updatedTitle')
        )
        setShowConfirm(false)
        onSuccess?.()
      } else {
        if (result.error) showError(result.error, t('scheme.errors.errorTitle'))
      }
    } catch (error: any) {
      showError(
        error?.message || t('scheme.errors.unexpectedError'),
        t('scheme.errors.errorTitle')
      )
    }
  }

  const sectionProps = {
    data: formData, errors, onChange: handleChange,
    onBlur: handleBlur, disabled: isLoading,
  }

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'basic':       return <BasicInfoSection    {...sectionProps} />
      case 'installment': return <InstallmentSection  {...sectionProps} />
      case 'bonus':       return <BonusSection        {...sectionProps} />
      case 'validity':    return <ValiditySection     {...sectionProps} />
      case 'eligibility': return <EligibilitySection  {...sectionProps} />
      case 'redemption':  return <RedemptionSection   {...sectionProps} />
      case 'limits':      return <LimitsSection       {...sectionProps} />
      case 'marketing':   return <MarketingSection    {...sectionProps} />
      default:            return null
    }
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border-primary bg-bg-secondary p-4">
        <h1 className="text-xl font-bold text-text-primary">
          {mode === 'create' ? t('scheme.addScheme') : t('scheme.editScheme')}
        </h1>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {t('common.step')} {currentStep + 1} {t('common.of')} {STEPS.length}
          </span>
          <span className="text-sm font-medium text-accent">
            {STEPS[currentStep].label}
          </span>
        </div>

        {/* Progress */}
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-bg-tertiary">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Card className="border-border-primary bg-bg-secondary">
          <CardContent className="p-4">{renderStep()}</CardContent>
        </Card>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border-primary bg-bg-secondary p-4">
        <div className="flex gap-2">
          {currentStep > 0 ? (
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
          ) : (
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={
          mode === 'create'
            ? t('scheme.confirmCreate')
            : t('scheme.confirmUpdate')
        }
        description={
          mode === 'create'
            ? t('scheme.confirmCreateDescription')
            : t('scheme.confirmUpdateDescription')
        }
        variant={mode === 'create' ? 'success' : 'info'}
        confirmLabel={mode === 'create' ? t('common.create') : t('common.update')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmedSubmit}
        onCancel={() => setShowConfirm(false)}
        loading={isLoading}
      />
    </div>
  )
}