// FILE: src/components/user/UserForm/UserForm.desktop.tsx
// Desktop Layout for UserForm (2-Column Cards)

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateUser, validateField } from '@/validators/userValidator'
import type { CreateUserInput } from '@/validators/userValidator'
import type { UserFormProps } from './UserForm.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, Loader2 } from 'lucide-react'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { RolePermissionsSection } from './sections/RolePermissionsSection'
import { ContactInfoSection } from './sections/ContactInfoSection'
import { EmployeeInfoSection } from './sections/EmployeeInfoSection'
import { SalesInfoSection } from './sections/SalesInfoSection'
import { PreferencesSection } from './sections/PreferencesSection'
import { useAuth } from '@/hooks/useAuth' 
import { useNotification } from '@/hooks/useNotification' 
import { useErrorHandler } from '@/hooks/useErrorHandler' 
import {RegisterRequest} from '@/types'

export default function UserFormDesktop({
  initialData = {},
  organizationId,
  userId,
  onSuccess,
  onCancel,
  mode = 'create',
}: UserFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] =
    useState<Partial<CreateUserInput>>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
const { showSuccess, showError } = useNotification()
const { handleError } = useErrorHandler()

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

    // Validate field on blur
    const fieldValue = formData[name as keyof CreateUserInput]
    const fieldValidation = validateField(
      name as keyof CreateUserInput,
      fieldValue
    )

    if (!fieldValidation.isValid && fieldValidation.error) {
      setErrors(prev => ({ ...prev, [name]: fieldValidation.error! }))
    }
  }

const handleSubmit = async () => {
  // Validate entire form
  const validation = validateUser(formData)

  if (!validation.isValid) {
    setErrors(validation.errors)
    const allTouched = Object.keys(validation.errors).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    )
    setTouched(allTouched)
    return
  }

  setIsLoading(true)

  try {
    // ✅ API Call
    const result = await register(formData as RegisterRequest)
    
    if (result.success) {
      showSuccess(
        mode === 'create' ? t('user.userCreated') : t('user.userUpdated'),
        t('user.userCreatedDescription')
      )
      onSuccess?.()
    }
  } catch (error: any) {
    handleError(error, setErrors)
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">
          {mode === 'create' ? t('user.addUser') : t('user.editUser')}
        </h1>
        <p className="mt-1 text-text-secondary">
          {mode === 'create'
            ? t('user.addUserDescription')
            : t('user.editUserDescription')}
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
                {t('user.basicInformation')}
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

          {/* Role & Permissions */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('user.roleAndPermissions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RolePermissionsSection
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
                {t('user.contactInformation')}
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
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Employee Info */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('user.employeeInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeInfoSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Sales Info */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('user.salesInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SalesInfoSection
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
                {t('user.preferences')}
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
