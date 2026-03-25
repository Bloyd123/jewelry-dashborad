// FILE: src/components/purchase/PurchaseForm/PurchaseForm.desktop.tsx

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, Loader2 } from 'lucide-react'
import { BasicInfoSection } from './sections/BasicInfoStep'
import { AddItemsSection } from './sections/AddItemsStep'
import { PaymentDetailsSection } from './sections/PaymentDetailsStep'
import { AdditionalInfoSection } from './sections/AdditionalInfoStep'
import { ReviewSection } from './sections/ReviewStep'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { useNotification } from '@/hooks/useNotification'
import { usePurchaseActions } from '@/hooks/purchase/usePurchaseActions'
import { createPurchaseSchema } from '@/validators/purchaseValidation'
import type { PurchaseFormProps, PurchaseFormData } from './PurchaseForm.types'

export default function PurchaseFormDesktop({
  initialData = {},
  shopId,
  purchaseId,
  onSuccess,
  onCancel,
  mode = 'create',
}: PurchaseFormProps) {
  const { t } = useTranslation()
  const { showSuccess, showError } = useNotification()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const [formData, setFormData] = useState<Partial<PurchaseFormData>>({
    purchaseDate: new Date().toISOString(),
    purchaseType: 'new_stock',
    items:        [],
    paymentMode:  'cash',
    paidAmount:   0,
    ...initialData,
  })
  const [errors,  setErrors]  = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // ── Real API hooks ──
  const {
    createPurchase,
    updatePurchase,
    isCreating,
    isUpdating,
  } = usePurchaseActions(shopId, purchaseId)

  const isLoading = isCreating || isUpdating

  // ── Handlers ──
  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => { const e = { ...prev }; delete e[name]; return e })
    }
  }

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  const handleSubmit = () => {
    // Client-side validation
    try {
      createPurchaseSchema.parse({
        supplierId:   formData.supplierId,
        purchaseType: formData.purchaseType,
        purchaseDate: formData.purchaseDate,
        items:        formData.items,
        payment: {
          paymentMode:  formData.paymentMode,
          paidAmount:   formData.paidAmount,
          paymentTerms: formData.paymentTerms,
          dueDate:      formData.dueDate,
        },
      })
    } catch (error: any) {
      const validationErrors: Record<string, string> = {}
      error.issues?.forEach((err: any) => {
        if (err.path?.[0]) validationErrors[err.path[0]] = err.message
      })
      setErrors(validationErrors)
      showError(
        Object.values(validationErrors).map(m => `• ${m}`).join('\n') ||
          t('purchase.errors.pleaseFillRequired', 'Please fill required fields'),
        t('purchase.errors.validationFailed', 'Validation Failed')
      )
      return
    }
    setShowConfirmDialog(true)
  }

  const handleConfirmedSubmit = async () => {
    const setFormErrors = (apiErrors: Record<string, string>) => setErrors(apiErrors)

// ── Financials calculate karo ──
const items      = formData.items || []
const subtotal   = items.reduce((s, i) => s + Number(i.itemTotal || 0), 0)
const totalGst   = Number((subtotal * 0.03).toFixed(2))
const rawTotal   = subtotal + totalGst
const grandTotal = Math.round(rawTotal)

const payload = {
  supplierId:   formData.supplierId!,
  purchaseDate: formData.purchaseDate,
  purchaseType: formData.purchaseType,
  items,
  // ✅ financials add karo
  financials: {
    subtotal,
    cgst:       Number((totalGst / 2).toFixed(2)),
    sgst:       Number((totalGst / 2).toFixed(2)),
    igst:       0,
    totalGst,
    roundOff:   Number((grandTotal - rawTotal).toFixed(2)),
    grandTotal,
    totalPaid:  Number(formData.paidAmount ?? 0),
    totalDue:   grandTotal - Number(formData.paidAmount ?? 0),
  },
  payment: {
    paymentMode:  formData.paymentMode,
    paidAmount:   Number(formData.paidAmount ?? 0),
    paymentTerms: formData.paymentTerms,
    dueDate:      formData.dueDate,
  },
  delivery: {
    expectedDate:    formData.expectedDate,
    deliveryAddress: formData.deliveryAddress,
  },
  notes:         formData.notes,
  internalNotes: formData.internalNotes,
  tags:          formData.tags,
}
    const result = mode === 'edit' && purchaseId
      ? await updatePurchase(payload, setFormErrors)
      : await createPurchase(payload as any, setFormErrors)

    if (result.success) {
      showSuccess(
        mode === 'create'
          ? t('purchase.success.created', 'Purchase created successfully')
          : t('purchase.success.updated', 'Purchase updated successfully'),
        mode === 'create'
          ? t('purchase.success.createdTitle', 'Created')
          : t('purchase.success.updatedTitle', 'Updated')
      )
      setShowConfirmDialog(false)
      onSuccess?.()
    }
  }

  const sectionProps = {
    data:     formData,
    errors,
    onChange: handleChange,
    onBlur:   handleBlur,
    disabled: isLoading,
  }

  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">
          {mode === 'create' ? t('purchase.addPurchase') : t('purchase.editPurchase')}
        </h1>
        <p className="mt-1 text-text-secondary">
          {mode === 'create' ? t('purchase.addPurchaseDescription') : t('purchase.editPurchaseDescription')}
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left */}
        <div className="space-y-6">
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('purchase.basicInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BasicInfoSection {...sectionProps} />
            </CardContent>
          </Card>

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('purchase.addItems')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddItemsSection {...sectionProps} />
            </CardContent>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('purchase.paymentDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentDetailsSection {...sectionProps} />
            </CardContent>
          </Card>

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('purchase.additionalInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdditionalInfoSection {...sectionProps} />
            </CardContent>
          </Card>

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('purchase.review')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewSection {...sectionProps} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={mode === 'create' ? t('purchase.confirmCreate', 'Create Purchase?') : t('purchase.confirmUpdate', 'Update Purchase?')}
        description={mode === 'create' ? t('purchase.confirmCreateDescription', 'Are you sure you want to create this purchase?') : t('purchase.confirmUpdateDescription', 'Are you sure you want to update this purchase?')}
        variant={mode === 'create' ? 'success' : 'info'}
        confirmLabel={mode === 'create' ? t('common.create') : t('common.update')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmedSubmit}
        onCancel={() => setShowConfirmDialog(false)}
        loading={isLoading}
      />
    </div>
  )
}