// FILE: src/components/supplier/SupplierForm/SupplierForm.mobile.tsx


import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SupplierFormProps, SupplierFormData } from './SupplierForm.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Save, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { BasicInfoSection } from './sections/BasicInfoStep'
import { ContactInfoSection } from './sections/ContactInfoStep'
import { AddressSection } from './sections/AddressStep'
import { useSupplierActions } from '@/hooks/supplier'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { PaymentTermsSection } from './sections/PaymentTermsStep'
import { BankDetailsSection } from './sections/BankDetailsSection'
import { NotesTagsSection } from './sections/NotesTagsSection'
import { SupplierType, SupplierCategory, PaymentTerms } from '@/types/supplier.types'
import { createSupplierSchema, MESSAGES } from '@/validators/supplierValidation'
import { useNotification } from '@/hooks/useNotification'
const STEPS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'contact', label: 'Contact' },
  { id: 'address', label: 'Address' },
  { id: 'payment', label: 'Payment' },
  { id: 'bank', label: 'Bank' },
  { id: 'notes', label: 'Notes' },
]

export default function SupplierFormMobile({
  initialData = {},
  shopId,
  supplierId,
  onSuccess,
  onCancel,
  mode = 'create',
}: SupplierFormProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
const [formData, setFormData] = useState<Partial<SupplierFormData>>({
  supplierType: SupplierType.WHOLESALER,
  supplierCategory: SupplierCategory.MIXED,
  paymentTerms: PaymentTerms.NET30,
  creditPeriod: 30,
  creditLimit: 0,
  ...initialData,
})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const { showError } = useNotification()
  const { createSupplier, updateSupplier, isCreating, isUpdating } =
    useSupplierActions(shopId!)
  const isLoading = isCreating || isUpdating

  const handleChange = (name: string, value: any) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

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
    createSupplierSchema.shape[
      name as keyof typeof createSupplierSchema.shape
    ]?.parse(formData[name as keyof SupplierFormData])
    if (errors[name]) {
      setErrors(prev => {
        const n = { ...prev }
        delete n[name]
        return n
      })
    }
  } catch (error: any) {
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
  const manualErrors: Record<string, string> = {}
  if (!formData.businessName?.trim()) {
    manualErrors['businessName'] = MESSAGES.businessName.required
  }
  if (!formData.contactPerson?.firstName?.trim()) {
    manualErrors['contactPerson.firstName'] = MESSAGES.contactPerson.firstNameRequired
  }
  if (!formData.contactPerson?.phone?.trim()) {
    manualErrors['contactPerson.phone'] = MESSAGES.contactPerson.phoneRequired
  }
  if (Object.keys(manualErrors).length > 0) {
    setErrors(manualErrors)
    const errorMessages = Object.entries(manualErrors)
      .map(([_, message]) => `• ${message}`)
      .join('\n')
    showError(errorMessages, t('suppliers.errors.validationFailed'))
    return
  }
  try {
    createSupplierSchema.parse(formData)
  } catch (error: any) {
    const validationErrors: Record<string, string> = {}
    error.issues?.forEach((err: any) => {
      if (err.path?.length > 0) {
        const fieldPath = err.path.join('.')
        if (
          !err.message.includes('expected object') &&
          !err.message.includes('received undefined') &&
          !err.message.includes('Invalid input')
        ) {
          validationErrors[fieldPath] = err.message
        }
      }
    })
    setErrors(validationErrors)
    const errorMessages = Object.entries(validationErrors)
      .map(([_, message]) => `• ${message}`)
      .join('\n')
    showError(errorMessages, t('suppliers.errors.validationFailed'))
    return
  }
  setShowConfirm(true)
}

const handleConfirmedSubmit = async () => {
  try {
    const result = mode === 'edit' && supplierId
      ? await updateSupplier(supplierId, formData as SupplierFormData, setErrors)
      : await createSupplier(formData as SupplierFormData, setErrors)
    if (result.success) {
      setShowConfirm(false)
      onSuccess?.()
    } else {
      if (result.error) showError(result.error, 'Error')
    }
  } catch (error: any) {
    showError(error?.message || 'Unexpected error occurred', 'Error')
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
      case 'payment':
        return <PaymentTermsSection {...sectionProps} />
      case 'bank':
        return <BankDetailsSection {...sectionProps} />
      case 'notes':
        return <NotesTagsSection {...sectionProps} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <div className="sticky top-0 z-10 border-b border-border-primary bg-bg-secondary p-4">
        <h1 className="text-xl font-bold text-text-primary">
          {mode === 'create'
            ? t('suppliers.addSupplier')
            : t('suppliers.editSupplier')}
        </h1>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {t('suppliers.common.step')} {currentStep + 1}{' '}
            {t('suppliers.common.of')} {STEPS.length}
          </span>
          <span className="text-sm font-medium text-accent">
            {STEPS[currentStep].label}
          </span>
        </div>

        <div className="mt-2 h-1 overflow-hidden rounded-full bg-bg-tertiary">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-4">
        <Card className="border-border-primary bg-bg-secondary">
          <CardContent className="p-4">{renderCurrentStep()}</CardContent>
        </Card>
      </div>

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
              {t('suppliers.common.previous')}
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
              {t('suppliers.common.cancel')}
            </Button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1"
            >
              {t('suppliers.common.next')}
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
                  {t('suppliers.common.saving')}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === 'create'
                    ? t('suppliers.common.save')
                    : t('suppliers.common.update')}
                </>
              )}
            </Button>
          )}
        </div>
        <ConfirmDialog
          open={showConfirm}
          onOpenChange={setShowConfirm}
          title={
            mode === 'create'
              ? t('suppliers.confirmCreate')
              : t('suppliers.confirmUpdate')
          }
          description={
            mode === 'create'
              ? t('suppliers.confirmCreateDescription')
              : t('suppliers.confirmUpdateDescription')
          }
          variant={mode === 'create' ? 'info' : 'warning'}
          confirmLabel={
            mode === 'create' ? t('common.create') : t('common.update')
          }
          cancelLabel={t('common.cancel')}
         onConfirm={handleConfirmedSubmit}
          loading={isLoading}
        />
      </div>
    </div>
  )
}
