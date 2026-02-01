// FILE: src/components/customer/CustomerForm/CustomerForm.mobile.tsx
// Mobile Layout for CustomerForm (Tabbed Interface)

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createCustomerSchema } from '@/validators/customerValidation'
import { useCustomerActions } from '@/hooks/customer/useCustomerActions'
import type { CreateCustomerInput } from '@/validators/customerValidation'
import type { CustomerFormProps } from './CustomerForm.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Save, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { ContactInfoSection } from './sections/ContactInfoSection'
import { AddressSection } from './sections/AddressSection'
import { useNotification } from '@/hooks/useNotification'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { KYCSection } from './sections/KYCSection'
import { PreferencesSection } from './sections/PreferencesSection'
import { CustomerTypeSection } from './sections/CustomerTypeSection'
import { NotesTagsSection } from './sections/NotesTagsSection'
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
    const { showSuccess, showError } = useNotification() // ✅ ADD
  const [showConfirmDialog, setShowConfirmDialog] = useState(false) // ✅ ADD

const { createCustomer, updateCustomer, isCreating, isUpdating } =
  useCustomerActions(shopId)
  const isLoading = isCreating || isUpdating
  const cleanFormData = (data: Partial<CreateCustomerInput>): Partial<CreateCustomerInput> => {
  const cleaned = { ...data }

  // Convert empty strings to undefined for optional fields
  if (cleaned.referredBy === '') cleaned.referredBy = undefined
  if (cleaned.email === '') cleaned.email = undefined
  if (cleaned.alternatePhone === '') cleaned.alternatePhone = undefined
  if (cleaned.whatsappNumber === '') cleaned.whatsappNumber = undefined
  if (cleaned.dateOfBirth === '') cleaned.dateOfBirth = undefined
  if (cleaned.anniversaryDate === '') cleaned.anniversaryDate = undefined
  if (cleaned.aadharNumber === '') cleaned.aadharNumber = undefined
  if (cleaned.panNumber === '') cleaned.panNumber = undefined
  if (cleaned.gstNumber === '') cleaned.gstNumber = undefined
  if (cleaned.notes === '') cleaned.notes = undefined

  // Clean address
  if (cleaned.address) {
    if (cleaned.address.street === '') cleaned.address.street = undefined
    if (cleaned.address.city === '') cleaned.address.city = undefined
    if (cleaned.address.state === '') cleaned.address.state = undefined
    if (cleaned.address.pincode === '') cleaned.address.pincode = undefined
    
    // Remove address if all fields are empty
    if (
      !cleaned.address.street &&
      !cleaned.address.city &&
      !cleaned.address.state &&
      !cleaned.address.pincode
    ) {
      cleaned.address = undefined
    }
  }

  return cleaned
}
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

    try {
      createCustomerSchema.shape[
        name as keyof typeof createCustomerSchema.shape
      ]?.parse(formData[name as keyof CreateCustomerInput])
      // Clear error if valid
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    } catch (error: any) {
      // Set error if invalid
      if (error.errors?.[0]?.message) {
        setErrors(prev => ({ ...prev, [name]: error.errors[0].message }))
      }
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
  const handleSubmit = async () => {
    try {
      createCustomerSchema.parse(formData)
    } catch (error: any) {
      const validationErrors: Record<string, string> = {}
      error.errors?.forEach((err: any) => {
        if (err.path?.[0]) {
          validationErrors[err.path[0]] = err.message
        }
      })
      setErrors(validationErrors)
      
      const firstError = Object.values(validationErrors)[0]
      if (firstError) {
        showError(String(firstError), t('customer.errors.validationFailed'))
      } else {
        showError(
          t('customer.errors.pleaseFillRequired'),
          t('customer.errors.validationFailed')
        )
      }
      return
    }

    setShowConfirmDialog(true)
  }
const handleConfirmedSubmit = async () => {
  const validatedData = cleanFormData(formData) as CreateCustomerInput
  
  const setFormErrors = (apiErrors: Record<string, string>) => {
    setErrors(apiErrors)
    // DON'T show notification here
  }

  try {
    const result =
      mode === 'edit' && customerId
        ? await updateCustomer(customerId, validatedData, setFormErrors)
        : await createCustomer(validatedData, setFormErrors)

    if (result.success) {
      showSuccess(
        mode === 'create'
          ? t('customer.success.created')
          : t('customer.success.updated'),
        mode === 'create'
          ? t('customer.success.createdTitle')
          : t('customer.success.updatedTitle')
      )
      
      setShowConfirmDialog(false)
      onSuccess?.()
    } else {
      if (result.error) {
        showError(result.error, t('customer.errors.errorTitle'))
      }
    }
  } catch (error: any) {
    console.error('❌ [CustomerForm] Save error:', error)
    showError(
      error?.message || t('customer.errors.unexpectedError'),
      t('customer.errors.errorTitle')
    )
  }
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
              <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={
          mode === 'create'
            ? t('customer.confirmCreate')
            : t('customer.confirmUpdate')
        }
        description={
          mode === 'create'
            ? t('customer.confirmCreateDescription')
            : t('customer.confirmUpdateDescription')
        }
        variant={mode === 'create' ? 'success' : 'info'}
        confirmLabel={mode === 'create' ? t('common.create') : t('common.update')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmedSubmit}
        onCancel={() => setShowConfirmDialog(false)}
        loading={isLoading}
      />
        </div>
      </div>
    </div>
  )
}
