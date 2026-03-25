// FILE: src/components/purchase/PurchaseForm/PurchaseForm.mobile.tsx

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Save, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
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

const STEPS = [
  { id: 'basic',      label: 'Basic Info'  },
  { id: 'items',      label: 'Add Items'   },
  { id: 'payment',    label: 'Payment'     },
  { id: 'additional', label: 'Additional'  },
  { id: 'review',     label: 'Review'      },
]

export default function PurchaseFormMobile({
  initialData = {},
  shopId,
  purchaseId,
  onSuccess,
  onCancel,
  mode = 'create',
}: PurchaseFormProps) {
  const { t } = useTranslation()
  const { showSuccess, showError } = useNotification()
  const [currentStep, setCurrentStep] = useState(0)
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

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => { const e = { ...prev }; delete e[name]; return e })
    }
  }

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
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

  const renderCurrentStep = () => {
    const sectionProps = {
      data:     formData,
      errors,
      onChange: handleChange,
      onBlur:   handleBlur,
      disabled: isLoading,
    }

    switch (STEPS[currentStep].id) {
      case 'basic':      return <BasicInfoSection      {...sectionProps} />
      case 'items':      return <AddItemsSection       {...sectionProps} />
      case 'payment':    return <PaymentDetailsSection {...sectionProps} />
      case 'additional': return <AdditionalInfoSection {...sectionProps} />
      case 'review':     return <ReviewSection         {...sectionProps} />
      default:           return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border-primary bg-bg-secondary p-4">
        <h1 className="text-xl font-bold text-text-primary">
          {mode === 'create' ? t('purchase.addPurchase') : t('purchase.editPurchase')}
        </h1>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {t('common.step')} {currentStep + 1} {t('common.of')} {STEPS.length}
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
            <Button type="button" variant="outline" onClick={handlePrevious} disabled={isLoading} className="flex-1">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('common.previous')}
            </Button>
          )}

          {currentStep === 0 && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
              <X className="mr-2 h-4 w-4" />
              {t('common.cancel')}
            </Button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <Button type="button" onClick={handleNext} disabled={isLoading} className="flex-1">
              {t('common.next')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('common.saving')}</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />{mode === 'create' ? t('common.save') : t('common.update')}</>
              )}
            </Button>
          )}
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