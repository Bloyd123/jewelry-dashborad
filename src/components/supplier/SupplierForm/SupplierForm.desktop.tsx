//
// FILE: src/components/supplier/SupplierForm/SupplierForm.desktop.tsx
// Desktop Layout for SupplierForm
//

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SupplierFormProps, SupplierFormData } from './SupplierForm.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, Loader2 } from 'lucide-react'
import { BasicInfoSection } from './sections/BasicInfoStep'
import { ContactInfoSection } from './sections/ContactInfoStep'
import { AddressSection } from './sections/AddressStep'
import { PaymentTermsSection } from './sections/PaymentTermsStep'
import { BankDetailsSection } from './sections/BankDetailsSection'
import { useSupplierActions } from '@/hooks/supplier'
import { NotesTagsSection } from './sections/NotesTagsSection'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog/ConfirmDialog'
export default function SupplierFormDesktop({
  initialData = {},
  shopId,
  supplierId,
  onSuccess,
  onCancel,
  mode = 'create',
}: SupplierFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] =
    useState<Partial<SupplierFormData>>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const { createSupplier, updateSupplier, isCreating, isUpdating } =
    useSupplierActions(shopId!)
  const isLoading = isCreating || isUpdating
  const [showConfirm, setShowConfirm] = useState(false)
  const handleChange = (name: string, value: any) => {
    // Nested keys handle karna (e.g. contactPerson.firstName)
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

    // Required fields validation on blur
    const requiredFields: Record<string, string> = {
      businessName: 'Business name is required',
      'contactPerson.firstName': 'First name is required',
      'contactPerson.phone': 'Phone is required',
    }

    // Nested value nikalenge (e.g. contactPerson.firstName)
    const value = name.includes('.')
      ? name.split('.').reduce<any>((obj, key) => obj?.[key], formData)
      : formData[name as keyof typeof formData]

    if (requiredFields[name] && (!value || String(value).trim() === '')) {
      setErrors(prev => ({ ...prev, [name]: requiredFields[name] }))
    }
  }

  // Save button click pe sirf dialog khulega
  // Save button click pe pehle validation, tab dialog
  const handleSaveClick = () => {
    const requiredFields: Record<string, { value: any; message: string }> = {
      businessName: {
        value: formData.businessName,
        message: 'Business name is required',
      },
      'contactPerson.firstName': {
        value: formData.contactPerson?.firstName,
        message: 'First name is required',
      },
      'contactPerson.phone': {
        value: formData.contactPerson?.phone,
        message: 'Phone is required',
      },
    }

    const newErrors: Record<string, string> = {}

    Object.entries(requiredFields).forEach(([field, { value, message }]) => {
      if (!value || String(value).trim() === '') {
        newErrors[field] = message
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }))
      return // Dialog nahi khulega
    }

    setShowConfirm(true)
  }

  // Dialog confirm pe actual API call
  const handleSubmit = async () => {
    const payload = formData as SupplierFormData

    const result =
      mode === 'edit' && supplierId
        ? await updateSupplier(supplierId, payload, setErrors)
        : await createSupplier(payload, setErrors)

    if (result.success) {
      setShowConfirm(false)
      onSuccess?.()
    }
  }

  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* Header */}
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

      {/* Form Grid - 2 Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Info */}
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

          {/* Contact Info */}
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

          {/* Address & Registration */}
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

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment Terms */}
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

          {/* Bank Details */}
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

          {/* Notes & Tags */}
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
            {t('suppliers.common.cancel')}
          </Button>

          <Button
            type="button"
            onClick={handleSaveClick}
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
        {/* Confirm Dialog */}
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
          onConfirm={handleSubmit}
          loading={isLoading}
        />
      </div>
    </div>
  )
}
