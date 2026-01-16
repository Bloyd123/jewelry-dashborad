// FILE: src/components/user/UserForm/UserForm.mobile.tsx
// Mobile Layout for UserForm (6-Step Tabbed Interface)

import { useState } from 'react'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog'
import { useTranslation } from 'react-i18next'
import { validateUser, validateField } from '@/validators/userValidator'
import type { CreateUserInput } from '@/validators/userValidator'
import type { UserFormProps } from './UserForm.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Save, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { RolePermissionsSection } from './sections/RolePermissionsSection'
import { ContactInfoSection } from './sections/ContactInfoSection'
import { EmployeeInfoSection } from './sections/EmployeeInfoSection'
import { SalesInfoSection } from './sections/SalesInfoSection'
import { PreferencesSection } from './sections/PreferencesSection'
import { useAuth } from '@/hooks/useAuth'
import { useNotification } from '@/hooks/useNotification'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { RegisterRequest } from '@/types'

const STEPS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'role', label: 'Role & Access' },
  { id: 'contact', label: 'Contact' },
  { id: 'employee', label: 'Employee Info' },
  { id: 'sales', label: 'Sales Info' },
  { id: 'preferences', label: 'Preferences' },
]

export default function UserFormMobile({
  initialData = {},
  organizationId,
  userId,
  onSuccess,
  onCancel,
  mode = 'create',
}: UserFormProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<CreateUserInput>>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  
  const { register } = useAuth()
  const { showSuccess, showError } = useNotification()
  const { handleError } = useErrorHandler()

  const hasFormChanged = () => {
    return Object.keys(formData).length > 0
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

    const fieldValue = formData[name as keyof CreateUserInput]
    const fieldValidation = validateField(
      name as keyof CreateUserInput,
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

  const handleSubmit = async () => {
    // Show confirm dialog
    setShowSaveDialog(true)
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
      case 'role':
        return <RolePermissionsSection {...sectionProps} />
      case 'contact':
        return <ContactInfoSection {...sectionProps} />
      case 'employee':
        return <EmployeeInfoSection {...sectionProps} />
      case 'sales':
        return <SalesInfoSection {...sectionProps} />
      case 'preferences':
        return <PreferencesSection {...sectionProps} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border-primary bg-bg-secondary p-4">
        <h1 className="text-xl font-bold text-text-primary">
          {mode === 'create' ? t('user.addUser') : t('user.editUser')}
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
              onClick={() => {
                if (hasFormChanged()) {
                  setShowCancelDialog(true)
                } else {
                  onCancel?.()
                }
              }}
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

      {/* Dialogs */}
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        variant="warning"
        title="user.form.cancelTitle"
        description="user.form.cancelDescription"
        confirmLabel="common.yesDiscard"
        cancelLabel="common.noKeepEditing"
        onConfirm={() => {
          setShowCancelDialog(false)
          onCancel?.()
        }}
      />

      <ConfirmDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        variant="success"
        title={mode === 'create' ? 'user.form.saveTitle' : 'user.form.updateTitle'}
        description={mode === 'create' ? 'user.form.saveDescription' : 'user.form.updateDescription'}
        confirmLabel="common.yesSave"
        cancelLabel="common.cancel"
        onConfirm={async () => {
          // Validation
          const validation = validateUser(formData)

          if (!validation.isValid) {
            setErrors(validation.errors)
            const allTouched = Object.keys(validation.errors).reduce(
              (acc, key) => ({ ...acc, [key]: true }),
              {}
            )
            setTouched(allTouched)

            showError(
              t('user.validationError'),
              t('user.validationErrorDescription')
            )

            // Navigate to first step with errors
            const firstErrorStep = STEPS.findIndex(step => {
              return Object.keys(validation.errors).some(key => {
                if (
                  step.id === 'basic' &&
                  [
                    'username',
                    'email',
                    'password',
                    'confirmPassword',
                    'firstName',
                    'lastName',
                  ].includes(key)
                )
                  return true
                if (
                  step.id === 'role' &&
                  ['role', 'organizationId', 'primaryShop'].includes(key)
                )
                  return true
                if (step.id === 'contact' && key === 'phone') return true
                if (
                  step.id === 'employee' &&
                  ['designation', 'department', 'employeeId', 'joiningDate'].includes(
                    key
                  )
                )
                  return true
                if (
                  step.id === 'sales' &&
                  ['salesTarget', 'commissionRate'].includes(key)
                )
                  return true
                if (step.id === 'preferences' && key.startsWith('preferences.'))
                  return true
                return false
              })
            })

            if (firstErrorStep !== -1) {
              setCurrentStep(firstErrorStep)
            }

            setShowSaveDialog(false)
            return
          }

          // If valid, proceed with API call
          setIsLoading(true)
          try {
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
        }}
        loading={isLoading}
      />
    </div>
  )
}