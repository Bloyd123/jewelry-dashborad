// ============================================================================
// FILE: src/components/sales/SaleForm/SaleForm.desktop.tsx
// Desktop Layout for SaleForm
// ============================================================================

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, Loader2 } from 'lucide-react'
import type { SaleFormProps } from './SaleForm.types'
import { defaultSaleFormData } from './SaleForm.types'
import { CustomerSection } from './sections/CustomerSection'
import { ItemsSection } from './sections/ItemsSection'
import { OldGoldSection } from './sections/OldGoldSection'
import { PaymentSection } from './sections/PaymentSection'
import { DeliverySection } from './sections/DeliverySection'
import { NotesSection } from './sections/NotesSection'

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
  const [isLoading, setIsLoading] = useState(false)

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
    // Validation logic
    const newErrors: Record<string, string> = {}

    if (!formData.customerId) {
      newErrors.customerId = t('validation.customerRequired')
    }

    if (!formData.items || formData.items.length === 0) {
      newErrors.items = t('validation.itemsRequired')
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Mock submit
    setIsLoading(true)
    setTimeout(() => {
      console.log('Mock Submit:', { mode, shopId, saleId, formData })
      setIsLoading(false)
      onSuccess?.()
    }, 1500)
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
    </div>
  )
}
