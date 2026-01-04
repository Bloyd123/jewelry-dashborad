//
// FILE: src/components/sales/SaleForm/SaleForm.mobile.tsx
// Mobile Layout for SaleForm (Tabbed Interface)
//

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Save, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import type { SaleFormProps } from './SaleForm.types'
import { defaultSaleFormData } from './SaleForm.types'
import { CustomerSection } from './sections/CustomerSection'
import { ItemsSection } from './sections/ItemsSection'
import { OldGoldSection } from './sections/OldGoldSection'
import { PaymentSection } from './sections/PaymentSection'
import { DeliverySection } from './sections/DeliverySection'
import { NotesSection } from './sections/NotesSection'

const STEPS = [
  { id: 'customer', label: 'Customer' },
  { id: 'items', label: 'Items' },
  { id: 'oldGold', label: 'Old Gold' },
  { id: 'payment', label: 'Payment' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'notes', label: 'Notes' },
]

export default function SaleFormMobile({
  initialData = {},
  shopId,
  saleId,
  onSuccess,
  onCancel,
  mode = 'create',
}: SaleFormProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    ...defaultSaleFormData,
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
    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.customerId) {
      newErrors.customerId = t('validation.customerRequired')
    }

    if (!formData.items || formData.items.length === 0) {
      newErrors.items = t('validation.itemsRequired')
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Navigate to first error step
      const firstErrorStep = STEPS.findIndex(step => {
        if (step.id === 'customer' && newErrors.customerId) return true
        if (step.id === 'items' && newErrors.items) return true
        return false
      })
      if (firstErrorStep !== -1) setCurrentStep(firstErrorStep)
      return
    }

    // Mock submit
    setIsLoading(true)
    setTimeout(() => {
      console.log('Mock Submit:', { mode, shopId, saleId, formData })
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
      case 'customer':
        return <CustomerSection {...sectionProps} />
      case 'items':
        return <ItemsSection {...sectionProps} />
      case 'oldGold':
        return <OldGoldSection {...sectionProps} />
      case 'payment':
        return <PaymentSection {...sectionProps} />
      case 'delivery':
        return <DeliverySection {...sectionProps} />
      case 'notes':
        return <NotesSection {...sectionProps} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border-primary bg-bg-secondary p-4">
        <h1 className="text-xl font-bold text-text-primary">
          {mode === 'create' ? t('sales.createSale') : t('sales.editSale')}
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
              className="hover:bg-accent/90 flex-1 bg-accent text-white"
            >
              {t('common.next')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="hover:bg-accent/90 flex-1 bg-accent text-white"
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
