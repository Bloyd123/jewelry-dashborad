
// ============================================================================
// FILE: src/components/customer/CustomerForm/CustomerForm.desktop.tsx
// Desktop Layout for CustomerForm
// ============================================================================

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateCustomer, validateField } from '@/validators/customerValidation'
import type { CreateCustomerInput } from '@/validators/customerValidation'
import type { CustomerFormProps } from './CustomerForm.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, Loader2 } from 'lucide-react'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { ContactInfoSection } from './sections/ContactInfoSection'
import { AddressSection } from './sections/AddressSection'
import { KYCSection } from './sections/KYCSection'
import { PreferencesSection } from './sections/PreferencesSection'
import { CustomerTypeSection } from './sections/CustomerTypeSection'
import { NotesTagsSection } from './sections/NotesTagsSection'

export default function CustomerFormDesktop({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create',
}: CustomerFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Partial<CreateCustomerInput>>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    
    // Validate field on blur
    const fieldValue = formData[name as keyof CreateCustomerInput]
    const fieldValidation = validateField(name as keyof CreateCustomerInput, fieldValue)
    
    if (!fieldValidation.isValid && fieldValidation.error) {
      setErrors((prev) => ({ ...prev, [name]: fieldValidation.error! }))
    }
  }

  const handleSubmit = async () => {
    // Validate entire form
    const validation = validateCustomer(formData)
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      // Mark all fields as touched
      const allTouched = Object.keys(validation.errors).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      )
      setTouched(allTouched)
      return
    }

    // Submit form
    await onSubmit(formData as CreateCustomerInput)
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">
          {mode === 'create' ? t('customer.addCustomer') : t('customer.editCustomer')}
        </h1>
        <p className="text-text-secondary mt-1">
          {mode === 'create' 
            ? t('customer.addCustomerDescription') 
            : t('customer.editCustomerDescription')}
        </p>
      </div>

      {/* Form Grid - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="bg-bg-secondary border-border-primary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('customer.basicInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BasicInfoSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="bg-bg-secondary border-border-primary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('customer.contactInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContactInfoSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="bg-bg-secondary border-border-primary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('customer.address')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddressSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Type */}
          <Card className="bg-bg-secondary border-border-primary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('customer.customerType')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerTypeSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* KYC Details */}
          <Card className="bg-bg-secondary border-border-primary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('customer.kycDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <KYCSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-bg-secondary border-border-primary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('customer.preferences')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PreferencesSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Notes & Tags */}
          <Card className="bg-bg-secondary border-border-primary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('customer.notesAndTags')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NotesTagsSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Actions - Sticky Bottom */}
      <div className="sticky bottom-0 mt-6 py-4 bg-bg-primary border-t border-border-primary">
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            <X className="h-4 w-4 mr-2" />
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
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('common.saving')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {mode === 'create' ? t('common.save') : t('common.update')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}