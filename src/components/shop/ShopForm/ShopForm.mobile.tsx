// 
// FILE: src/components/shop/ShopForm/ShopForm.mobile.tsx
// Mobile Layout for ShopForm (Tabbed Interface)
// 

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ShopFormProps } from './shopForm.types'
import type { Shop } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Save, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { ContactSection } from './sections/ContactSection'
import { AddressSection } from './sections/AddressSection'
import { BusinessRegistrationSection } from './sections/BusinessRegistrationSection'
import { BankingSection } from './sections/BankingSection'
import { UPISection } from './sections/UPISection'

const STEPS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'contact', label: 'Contact' },
  { id: 'address', label: 'Address' },
  { id: 'registration', label: 'Registration' },
  { id: 'banking', label: 'Banking' },
  { id: 'upi', label: 'UPI' },
]

export default function ShopFormMobile({
  initialData = {},
  shopId,
  organizationId,
  onSuccess,
  onCancel,
  mode = 'create',
}: ShopFormProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<Shop>>(initialData)
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

    if (!formData.name?.trim()) {
      newErrors.name = t('shops.validation.nameRequired')
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = t('shops.validation.phoneRequired')
    }
    if (!formData.address?.street?.trim()) {
      newErrors['address.street'] = t('shops.validation.streetRequired')
    }
    if (!formData.address?.city?.trim()) {
      newErrors['address.city'] = t('shops.validation.cityRequired')
    }
    if (!formData.address?.state?.trim()) {
      newErrors['address.state'] = t('shops.validation.stateRequired')
    }
    if (!formData.address?.pincode?.trim()) {
      newErrors['address.pincode'] = t('shops.validation.pincodeRequired')
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Navigate to first step with errors
      const firstErrorStep = STEPS.findIndex(step => {
        return Object.keys(newErrors).some(key => {
          if (
            step.id === 'basic' &&
            ['name', 'shopType', 'category'].includes(key)
          )
            return true
          if (step.id === 'contact' && ['phone', 'email'].includes(key))
            return true
          if (step.id === 'address' && key.startsWith('address.')) return true
          return false
        })
      })
      if (firstErrorStep !== -1) {
        setCurrentStep(firstErrorStep)
      }
      return
    }

    setIsLoading(true)

    // Mock delay
    setTimeout(() => {
      console.log('Mock Submit:', { mode, shopId, organizationId, formData })
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
      disabled: isLoading,
    }

    switch (STEPS[currentStep].id) {
      case 'basic':
        return <BasicInfoSection {...sectionProps} />
      case 'contact':
        return <ContactSection {...sectionProps} />
      case 'address':
        return <AddressSection {...sectionProps} />
      case 'registration':
        return <BusinessRegistrationSection {...sectionProps} />
      case 'banking':
        return <BankingSection {...sectionProps} />
      case 'upi':
        return <UPISection {...sectionProps} />
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
            ? t('shops.form.addShop')
            : t('shops.form.editShop')}
        </h1>

        {/* Step Indicator */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {t('shops.common.step')} {currentStep + 1} {t('shops.common.of')}{' '}
            {STEPS.length}
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
              className="flex-1 border-border-primary text-text-primary hover:bg-bg-tertiary"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('shops.common.previous')}
            </Button>
          )}

          {currentStep === 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 border-border-primary text-text-primary hover:bg-bg-tertiary"
            >
              <X className="mr-2 h-4 w-4" />
              {t('shops.common.cancel')}
            </Button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="hover:bg-accent/90 flex-1 bg-accent text-white"
            >
              {t('shops.common.next')}
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
                  {t('shops.common.saving')}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === 'create'
                    ? t('shops.common.save')
                    : t('shops.common.update')}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
