// FILE: src/components/scheme/SchemeForm/SchemeForm.desktop.tsx

import { useState }        from 'react'
import { useTranslation }  from 'react-i18next'
import { useSchemeActions} from '@/hooks/scheme/useSchemeActions'
import { useNotification } from '@/hooks/useNotification'
import { createSchemeSchema } from '@/validators/schemeValidation'
import type { CreateSchemeInput } from '@/validators/schemeValidation'
import type { SchemeFormProps }   from './SchemeForm.types'
import { Button }          from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, Loader2 } from 'lucide-react'
import { ConfirmDialog }   from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { BasicInfoSection }    from './sections/BasicInfoSection'
import { InstallmentSection }  from './sections/InstallmentSection'
import { BonusSection }        from './sections/BonusSection'
import { EligibilitySection }  from './sections/EligibilitySection'
import { RedemptionSection }   from './sections/RedemptionSection'
import { ValiditySection }     from './sections/ValiditySection'
import { LimitsSection }       from './sections/LimitsSection'
import { MarketingSection }    from './sections/MarketingSection'

export default function SchemeFormDesktop({
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

  const [formData, setFormData] =
    useState<Partial<CreateSchemeInput>>(initialData)
  const [errors,  setErrors]   = useState<Record<string, string>>({})
  const [touched, setTouched]  = useState<Record<string, boolean>>({})
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

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  const handleSubmit = async () => {
    try {
      createSchemeSchema.parse(formData)
    } catch (error: any) {
      const validationErrors: Record<string, string> = {}
      error.issues?.forEach((err: any) => {
        if (err.path?.length) {
          const key = err.path.join('.')
          validationErrors[key] = err.message
        }
      })
      setErrors(validationErrors)
      const messages = Object.values(validationErrors)
        .map(m => `• ${m}`)
        .join('\n')
      showError(
        messages || t('scheme.errors.pleaseFillRequired'),
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

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">
          {mode === 'create'
            ? t('scheme.addScheme')
            : t('scheme.editScheme')}
        </h1>
        <p className="mt-1 text-text-secondary">
          {mode === 'create'
            ? t('scheme.addSchemeDescription')
            : t('scheme.editSchemeDescription')}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('scheme.basicInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BasicInfoSection {...sectionProps} />
            </CardContent>
          </Card>

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('scheme.installmentDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InstallmentSection {...sectionProps} />
            </CardContent>
          </Card>

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('scheme.bonusBenefits')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BonusSection {...sectionProps} />
            </CardContent>
          </Card>

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('scheme.validity1')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ValiditySection {...sectionProps} />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('scheme.eligibility1')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EligibilitySection {...sectionProps} />
            </CardContent>
          </Card>

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('scheme.redemptionRules')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RedemptionSection {...sectionProps} />
            </CardContent>
          </Card>

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('scheme.limits')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LimitsSection {...sectionProps} />
            </CardContent>
          </Card>

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('scheme.marketing1')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MarketingSection {...sectionProps} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 mt-6 border-t border-border-primary bg-bg-primary py-4">
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            <X className="mr-2 h-4 w-4" />
            {t('common.cancel')}
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="min-w-[120px]"
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