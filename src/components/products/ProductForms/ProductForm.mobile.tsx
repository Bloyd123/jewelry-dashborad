// ============================================================================
// FILE: src/components/products/ProductForm/ProductForm.mobile.tsx
// Mobile Layout for ProductForm (Tabbed Steps)
// ============================================================================

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Save, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { BasicInfoSection } from './sections/BasicInfoForm'
import { MetalWeightSection } from './sections/MetalWeightForm'
import { StonesSection } from './sections/StonesForm'
import { PricingSection } from './sections/PricingForm'
import { StockDetailsSection } from './sections/StockDetailsForm'
import type { ProductFormProps, ProductFormData } from './ProductForm.types'

const STEPS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'metal', label: 'Metal & Weight' },
  { id: 'stones', label: 'Stones' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'stock', label: 'Stock & Other' },
]

export default function ProductFormMobile({
  initialData = {},
  shopId,
  productId,
  onSuccess,
  onCancel,
  mode = 'create',
}: ProductFormProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<ProductFormData>>({
    productCode: `PRD${Math.floor(100000 + Math.random() * 900000)}`,
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
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    // Basic validation
    const newErrors: Record<string, string> = {}

    if (!formData.name) newErrors.name = t('validation.required')
    if (!formData.categoryId) newErrors.categoryId = t('validation.required')
    if (!formData.productType) newErrors.productType = t('validation.required')
    if (!formData.metal?.type) newErrors['metal.type'] = t('validation.required')
    if (!formData.metal?.purity) newErrors['metal.purity'] = t('validation.required')
    if (!formData.weight?.grossWeight) newErrors['weight.grossWeight'] = t('validation.required')
    if (!formData.stock?.quantity) newErrors['stock.quantity'] = t('validation.required')

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      
      // Navigate to first step with errors
      const errorSteps = [
        ['name', 'categoryId', 'productType'],
        ['metal.type', 'metal.purity', 'weight.grossWeight'],
        [],
        [],
        ['stock.quantity'],
      ]
      
      const firstErrorStep = errorSteps.findIndex(stepFields =>
        stepFields.some(field => newErrors[field])
      )
      
      if (firstErrorStep !== -1) {
        setCurrentStep(firstErrorStep)
      }
      return
    }

    setIsLoading(true)

    // Mock API call
    setTimeout(() => {
      console.log('Mock Submit:', { mode, shopId, productId, formData })
      setIsLoading(false)
      onSuccess?.()
    }, 1500)
  }

  const renderCurrentStep = () => {
    const sectionProps = {
      data: formData,
      errors,
      onChange: handleChange,
      onBlur: handleBlur,
      disabled: isLoading,
    }

    switch (STEPS[currentStep].id) {
      case 'basic':
        return <BasicInfoSection {...sectionProps} />
      case 'metal':
        return <MetalWeightSection {...sectionProps} />
      case 'stones':
        return <StonesSection {...sectionProps} />
      case 'pricing':
        return <PricingSection {...sectionProps} />
      case 'stock':
        return <StockDetailsSection {...sectionProps} />
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
            ? t('product.addProduct')
            : t('product.editProduct')}
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