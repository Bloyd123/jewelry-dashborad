// FILE: src/components/supplier/SupplierForm/SupplierForm.desktop.tsx

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SupplierFormProps, SupplierFormData } from './SupplierForm.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, Loader2 } from 'lucide-react'
import { SupplierType, SupplierCategory, PaymentTerms } from '@/types/supplier.types'
import { BasicInfoSection } from './sections/BasicInfoStep'
import { ContactInfoSection } from './sections/ContactInfoStep'
import { AddressSection } from './sections/AddressStep'
import { PaymentTermsSection } from './sections/PaymentTermsStep'
import { BankDetailsSection } from './sections/BankDetailsSection'
import { useSupplierActions } from '@/hooks/supplier'
import { NotesTagsSection } from './sections/NotesTagsSection'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { createSupplierSchema } from '@/validators/supplierValidation'
import { MESSAGES }from '@/validators/supplierValidation'

import { useNotification } from '@/hooks/useNotification'
export default function SupplierFormDesktop({
  initialData = {},
  shopId,
  supplierId,
  onSuccess,
  onCancel,
  mode = 'create',
}: SupplierFormProps) {
  // Add karo
  const { t } = useTranslation()
  const { showError } = useNotification()
const [formData, setFormData] = useState<Partial<SupplierFormData>>({
  supplierType: SupplierType.WHOLESALER,
  supplierCategory: SupplierCategory.MIXED,
  paymentTerms: PaymentTerms.NET30,
  creditPeriod: 30,
  creditLimit: 0,
  ...initialData,
})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const { createSupplier, updateSupplier, isCreating, isUpdating } =
    useSupplierActions(shopId!)
  const isLoading = isCreating || isUpdating
  const [showConfirm, setShowConfirm] = useState(false)
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

    // Error clear karna
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

  // Zod baaki validate karega
  try {
    createSupplierSchema.parse(formData)
  } catch (error: any) {
      console.log('Zod errors:', error.issues) 
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

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">
          {mode === 'create'
            ? t('suppliers.addSupplier')
            : t('suppliers.editSupplier')}
        </h1>
        <p className="mt-1 text-text-secondary">
          {mode === 'create'
            ? t('suppliers.addSupplierDescription')
            : t('suppliers.editSupplierDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('suppliers.basicInformation')}
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

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('suppliers.contactInformation')}
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

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('suppliers.addressAndRegistration')}
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

        <div className="space-y-6">
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('suppliers.paymentTermsForm')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentTermsSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('suppliers.bankDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BankDetailsSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('suppliers.notesAndTags')}
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
            {t('suppliers.common.cancel')}
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
