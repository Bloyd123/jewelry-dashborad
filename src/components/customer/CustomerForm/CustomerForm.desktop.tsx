// FILE: src/components/customer/CustomerForm/CustomerForm.desktop.tsx
// Desktop Layout for CustomerForm

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCustomer } from '@/hooks/useCustomers'

import type { CreateCustomerInput } from '@/validators/customerValidation'
import type { CustomerFormProps } from './CustomerForm.types'
import { createCustomerSchema } from '@/validators/customerValidation'
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
  shopId, // ← ADD THIS PROP
  customerId, // ← ADD THIS PROP (for edit mode)
  onSuccess, // ← CHANGE: onSubmit → onSuccess
  onCancel,
  mode = 'create',
}: CustomerFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] =
    useState<Partial<CreateCustomerInput>>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const { createCustomer, updateCustomer, isCreating, isUpdating } =
    useCustomer(shopId)
  const isLoading = isCreating || isUpdating

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
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
  const handleSubmit = async () => {
    // 1. Validate entire form with Zod
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
      return
    }

    // 2. After validation passes, formData is now valid CreateCustomerInput
    const validatedData = formData as CreateCustomerInput // ← Type assertion after validation

    // 3. Callback for setting field errors from API
    const setFormErrors = (apiErrors: Record<string, string>) => {
      setErrors(apiErrors)
    }

    // 4. Call API with validated data
    const result =
      mode === 'edit' && customerId
        ? await updateCustomer(customerId, validatedData, setFormErrors)
        : await createCustomer(validatedData, setFormErrors)

    // 5. Handle success
    if (result.success) {
      onSuccess?.()
    }
  }

  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">
          {mode === 'create'
            ? t('customer.addCustomer')
            : t('customer.editCustomer')}
        </h1>
        <p className="mt-1 text-text-secondary">
          {mode === 'create'
            ? t('customer.addCustomerDescription')
            : t('customer.editCustomerDescription')}
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
          <Card className="border-border-primary bg-bg-secondary">
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
          <Card className="border-border-primary bg-bg-secondary">
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
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('customer.customerTypetext')}
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
          <Card className="border-border-primary bg-bg-secondary">
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
          <Card className="border-border-primary bg-bg-secondary">
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
          <Card className="border-border-primary bg-bg-secondary">
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
