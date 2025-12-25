// ============================================================================
// FILE: src/components/products/ProductForm/ProductForm.desktop.tsx
// Desktop Layout for ProductForm (2-Column Grid)
// ============================================================================

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, Loader2 } from 'lucide-react'
import { BasicInfoSection } from './sections/BasicInfoForm'
import { MetalWeightSection } from './sections/MetalWeightForm'
import { StonesSection } from './sections/StonesForm'
import { PricingSection } from './sections/PricingForm'
import { StockDetailsSection } from './sections/StockDetailsForm'
import type { ProductFormProps, ProductFormData } from './ProductForm.types'

export default function ProductFormDesktop({
  initialData = {},
  shopId,
  productId,
  onSuccess,
  onCancel,
  mode = 'create',
}: ProductFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Partial<ProductFormData>>({
    productCode: `PRD${Math.floor(100000 + Math.random() * 900000)}`,
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
    // Basic validation
    const newErrors: Record<string, string> = {}

    if (!formData.name) newErrors.name = t('validation.required')
    if (!formData.categoryId) newErrors.categoryId = t('validation.required')
    if (!formData.productType) newErrors.productType = t('validation.required')
    if (!formData.metal?.type)
      newErrors['metal.type'] = t('validation.required')
    if (!formData.metal?.purity)
      newErrors['metal.purity'] = t('validation.required')
    if (!formData.weight?.grossWeight)
      newErrors['weight.grossWeight'] = t('validation.required')
    if (!formData.stock?.quantity)
      newErrors['stock.quantity'] = t('validation.required')

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    // Mock API call
    setTimeout(() => {
      console.log('Mock Submit:', { mode, shopId, productId, formData })
      setIsLoading(false)
      onSuccess?.()
    }, 1500)
  }

  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">
          {mode === 'create'
            ? t('product.addProduct')
            : t('product.editProduct')}
        </h1>
        <p className="mt-1 text-text-secondary">
          {mode === 'create'
            ? t('product.addProductDescription')
            : t('product.editProductDescription')}
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
                {t('product.basicInformation')}
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

          {/* Stones */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('product.stonesAndDiamonds')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StonesSection
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
          {/* Metal & Weight */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('product.metalAndWeight')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MetalWeightSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('product.pricingAndCharges')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PricingSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Stock & Other */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('product.stockAndOther')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StockDetailsSection
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
