// ============================================================================
// FILE: src/components/purchase/PurchaseForm/PurchaseForm.desktop.tsx
// Desktop Layout for PurchaseForm
// ============================================================================

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, Loader2 } from 'lucide-react'
import { BasicInfoSection } from './sections/BasicInfoStep'
import { AddItemsSection } from './sections/AddItemsStep'
import { PaymentDetailsSection } from './sections/PaymentDetailsStep'
import { AdditionalInfoSection } from './sections/AdditionalInfoStep'
import { ReviewSection } from './sections/ReviewStep'
import type { PurchaseFormProps, PurchaseFormData } from './PurchaseForm.types'
// import { validatePurchaseForm } from '@/validators/purchaseValidation'

export default function PurchaseFormDesktop({
  initialData = {},
  shopId,
  purchaseId,
  onSuccess,
  onCancel,
  mode = 'create',
}: PurchaseFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Partial<PurchaseFormData>>({
    purchaseDate: new Date().toISOString(),
    purchaseType: 'new_stock',
    items: [],
    paymentMode: 'cash',
    paidAmount: 0,
    ...initialData,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

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

  const handleSubmit = async () => {

    setIsLoading(true)

    setTimeout(() => {
      console.log('Mock Submit:', { mode, shopId, purchaseId, formData })
      setIsLoading(false)
      onSuccess?.()
    }, 1000)
  }

  const sectionProps = {
    data: formData,
    errors,
    onChange: handleChange,
    onBlur: handleBlur,
    disabled: isLoading,
  }

  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">
          {mode === 'create'
            ? t('purchase.addPurchase')
            : t('purchase.editPurchase')}
        </h1>
        <p className="mt-1 text-text-secondary">
          {mode === 'create'
            ? t('purchase.addPurchaseDescription')
            : t('purchase.editPurchaseDescription')}
        </p>
      </div>

      {/* Form Grid - 2 Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('purchase.basicInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BasicInfoSection {...sectionProps} />
            </CardContent>
          </Card>

          {/* Add Items */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('purchase.addItems')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddItemsSection {...sectionProps} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment Details */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('purchase.paymentDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentDetailsSection {...sectionProps} />
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('purchase.additionalInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdditionalInfoSection {...sectionProps} />
            </CardContent>
          </Card>

          {/* Review */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('purchase.review')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewSection {...sectionProps} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Actions - Sticky Bottom */}
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
    </div>
  )
}
