//
// FILE: src/components/sales/SaleForm/SaleForm.desktop.tsx
// Desktop Layout for SaleForm
//

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, Loader2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { useNotification } from '@/hooks/useNotification'
import { useSaleActions } from '@/hooks/sales/useSaleActions'
import { createSaleSchema } from '@/validators/saleValidator'
import type { CreateSaleInput } from '@/validators/saleValidator'
import type { SaleFormProps } from './SaleForm.types'
import { defaultSaleFormData } from './SaleForm.types'
import { CustomerSection } from './sections/CustomerSection'
import { ItemsSection } from './sections/ItemsSection'
import { OldGoldSection } from './sections/OldGoldSection'
import { PaymentSection } from './sections/PaymentSection'
import { DeliverySection } from './sections/DeliverySection'
import { NotesSection } from './sections/NotesSection'
import type { CreateSaleRequest } from '@/types/sale.types'
export type SaleFormData = CreateSaleRequest & {
  saleDate?: string  // only frontend field
}

export type SaleFormItem    = CreateSaleRequest['items'][number]
export type OldGoldFormItem = NonNullable<CreateSaleRequest['oldGoldExchange']>['items'][number]
export default function SaleFormDesktop({
  initialData = {},
  shopId,
  saleId,
  onSuccess,
  onCancel,
  mode = 'create',
}: SaleFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    ...defaultSaleFormData,
    ...initialData,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
const [showConfirmDialog, setShowConfirmDialog] = useState(false)
const { showSuccess, showError } = useNotification()
const { createSale, updateSale, isCreating, isUpdating } = useSaleActions(shopId)
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
  }

const handleSubmit = async () => {
  try {
    createSaleSchema.parse(formData)
  } catch (error: any) {
    const validationErrors: Record<string, string> = {}
    error.issues?.forEach((err: any) => {
      if (err.path?.[0]) {
        validationErrors[err.path[0]] = err.message
      }
    })
    setErrors(validationErrors)
    const errorMessages = Object.entries(validationErrors)
      .map(([_, message]) => `• ${message}`)
      .join('\n')
    showError(
      errorMessages || t('sales.errors.pleaseFillRequired'),
      t('sales.errors.validationFailed')
    )
    return
  }
  setShowConfirmDialog(true)
}

const handleConfirmedSubmit = async () => {
  const setFormErrors = (apiErrors: Record<string, string>) => {
    setErrors(apiErrors)
  }

  try {
    const { saleDate, ...payload } = formData
const result =
  mode === 'edit' && saleId
    ? await updateSale(saleId, payload, setFormErrors)  // ← no 'as any'
    : await createSale(payload, setFormErrors)    

    if (result.success) {
      showSuccess(
        mode === 'create' ? t('sales.success.created') : t('sales.success.updated'),
        mode === 'create' ? t('sales.success.createdTitle') : t('sales.success.updatedTitle')
      )
      setShowConfirmDialog(false)
      onSuccess?.()
    } else {
  const errorMsg = (result as any).error
  if (errorMsg) {
    showError(errorMsg, t('sales.errors.errorTitle'))
  }
}
  } catch (error: any) {
    showError(
      error?.message || t('sales.errors.unexpectedError'),
      t('sales.errors.errorTitle')
    )
  }
}

  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">
          {mode === 'create' ? t('sales.createSale') : t('sales.editSale')}
        </h1>
        <p className="mt-1 text-text-secondary">
          {mode === 'create'
            ? t('sales.createSaleDescription')
            : t('sales.editSaleDescription')}
        </p>
      </div>

      {/* Form Grid - 2 Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="space-y-6 lg:col-span-2">
          {/* Customer */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('sales.customerInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Items */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('sales.saleItems')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ItemsSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Old Gold */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('sales.oldGoldExchange')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OldGoldSection
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
                {t('sales.notesAndTags')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NotesSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width (Sticky) */}
        <div className="space-y-6 lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Payment */}
            <Card className="border-border-primary bg-bg-secondary">
              <CardHeader>
                <CardTitle className="text-text-primary">
                  {t('sales.paymenttext')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentSection
                  data={formData}
                  errors={errors}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>

            {/* Delivery */}
            <Card className="border-border-primary bg-bg-secondary">
              <CardHeader>
                <CardTitle className="text-text-primary">
                  {t('sales.delivery')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DeliverySection
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
            className="hover:bg-accent/90 min-w-[120px] bg-accent text-white"
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
      <ConfirmDialog
  open={showConfirmDialog}
  onOpenChange={setShowConfirmDialog}
  title={mode === 'create' ? t('sales.confirmCreate') : t('sales.confirmUpdate')}
  description={
    mode === 'create'
      ? t('sales.confirmCreateDescription')
      : t('sales.confirmUpdateDescription')
  }
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
