// ============================================================================
// FILE: src/components/customer/CustomerForm/CustomerForm.mobile.tsx
// Mobile Layout for CustomerForm (Tabbed Interface)
// ============================================================================

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  validateCustomer,
  validateField,
} from '@/validators/customerValidation'
import type { CreateCustomerInput } from '@/validators/customerValidation'
import type { CustomerFormProps } from './CustomerForm.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Save, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { ContactInfoSection } from './sections/ContactInfoSection'
import { AddressSection } from './sections/AddressSection'
import { KYCSection } from './sections/KYCSection'
import { PreferencesSection } from './sections/PreferencesSection'
import { CustomerTypeSection } from './sections/CustomerTypeSection'
import { NotesTagsSection } from './sections/NotesTagsSection'
// import { useCreateCustomerMutation, useUpdateCustomerMutation } from '@/api/services/customerService'
// import { toast } from 'sonner'
// import { MESSAGES } from '@/constants/messages'
// import type { CreateCustomerRequest, UpdateCustomerRequest } from '@/types'
const STEPS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'contact', label: 'Contact' },
  { id: 'address', label: 'Address' },
  { id: 'type', label: 'Type' },
  { id: 'kyc', label: 'KYC' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'notes', label: 'Notes' },
]

export default function CustomerFormMobile({
  initialData = {},
  shopId, // ← ADD
  customerId, // ← ADD
  onSuccess, // ← CHANGE
  onCancel,
  mode = 'create',
}: CustomerFormProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] =
    useState<Partial<CreateCustomerInput>>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  // ← ADD: RTK Query mutations
  // const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation()
  // const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation()

  // const isLoading = isCreating || isUpdating

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

    const fieldValue = formData[name as keyof CreateCustomerInput]
    const fieldValidation = validateField(
      name as keyof CreateCustomerInput,
      fieldValue
    )

    if (!fieldValidation.isValid && fieldValidation.error) {
      setErrors(prev => ({ ...prev, [name]: fieldValidation.error! }))
    }
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

  // const handleSubmit = async () => {
  //   const validation = validateCustomer(formData)

  //   if (!validation.isValid) {
  //     setErrors(validation.errors)
  //     const allTouched = Object.keys(validation.errors).reduce(
  //       (acc, key) => ({ ...acc, [key]: true }),
  //       {}
  //     )
  //     setTouched(allTouched)

  //     // Navigate to first step with errors
  //     const firstErrorStep = STEPS.findIndex((step) => {
  //       return Object.keys(validation.errors).some((key) => {
  //         // Map error keys to steps (simplified logic)
  //         if (step.id === 'basic' && ['firstName', 'lastName', 'dateOfBirth', 'gender'].includes(key)) return true
  //         if (step.id === 'contact' && ['phone', 'email', 'alternatePhone', 'whatsappNumber'].includes(key)) return true
  //         if (step.id === 'address' && key.startsWith('address.')) return true
  //         if (step.id === 'type' && ['customerType', 'customerCategory'].includes(key)) return true
  //         if (step.id === 'kyc' && ['aadharNumber', 'panNumber', 'gstNumber'].includes(key)) return true
  //         if (step.id === 'preferences' && key.startsWith('preferences.')) return true
  //         if (step.id === 'notes' && ['notes', 'tags'].includes(key)) return true
  //         return false
  //       })
  //     })

  //     if (firstErrorStep !== -1) {
  //       setCurrentStep(firstErrorStep)
  //     }
  //     return
  //   }

  //   try {
  //     if (mode === 'create') {
  //       await createCustomer({ shopId, data: formData as CreateCustomerRequest }).unwrap()
  //       toast.success(MESSAGES.CUSTOMER.CUSTOMER_CREATED)
  //     } else {
  //       await updateCustomer({ shopId, customerId: customerId!, data: formData as UpdateCustomerRequest }).unwrap()
  //       toast.success(MESSAGES.CUSTOMER.CUSTOMER_UPDATED)
  //     }

  //     onSuccess?.()
  //   } catch (error: any) {
  //     toast.error(error.message || MESSAGES.GENERAL.SOMETHING_WENT_WRONG)
  //   }
  // }
  const handleSubmit = async () => {
    // ... validation logic same ...

    setIsLoading(true)

    // Mock delay
    setTimeout(() => {
      console.log('Mock Submit:', { mode, shopId, customerId, formData })
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
        return <ContactInfoSection {...sectionProps} />
      case 'address':
        return <AddressSection {...sectionProps} />
      case 'type':
        return <CustomerTypeSection {...sectionProps} />
      case 'kyc':
        return <KYCSection {...sectionProps} />
      case 'preferences':
        return <PreferencesSection {...sectionProps} />
      case 'notes':
        return <NotesTagsSection {...sectionProps} />
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
            ? t('customer.addCustomer')
            : t('customer.editCustomer')}
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
