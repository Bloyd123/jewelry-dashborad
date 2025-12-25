// ============================================================================
// FILE: src/components/products/ProductForm/sections/PricingSection.tsx
// Step 4: Pricing & Auto-calculation
// ============================================================================

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { Button } from '@/components/ui/button'
import { Calculator, RefreshCw } from 'lucide-react'
import type { FormSectionProps, PriceBreakdown } from '../ProductForm.types'

export const PricingSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()
  const [useCurrentRate, setUseCurrentRate] = useState(true)
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown>({
    metalRate: 0,
    metalValue: 0,
    stoneValue: 0,
    makingCharges: 0,
    otherCharges: 0,
    subtotal: 0,
    gstAmount: 0,
    totalPrice: 0,
    discount: 0,
    sellingPrice: 0,
  })

  const discountTypes = [
    { value: 'none', label: t('product.discountTypes.none') },
    { value: 'percentage', label: t('product.discountTypes.percentage') },
    { value: 'flat', label: t('product.discountTypes.flat') },
  ]

  // Mock metal rates (₹ per gram)
  const MOCK_METAL_RATES: Record<string, any> = {
    gold: {
      '24K': 6800,
      '22K': 6500,
      '18K': 5100,
      '14K': 3950,
    },
    silver: {
      '999': 85,
      '925': 78,
    },
    platinum: {
      '950': 3200,
    },
  }

  const calculatePrice = () => {
    // 1. Get metal rate
    const metalType = data.metal?.type || 'gold'
    const purity = data.metal?.purity || '22K'
    const metalRate = useCurrentRate
      ? MOCK_METAL_RATES[metalType]?.[purity] || 6000
      : parseFloat(data.pricing?.metalRate as any) || 6000

    // 2. Calculate metal value
    const netWeight = parseFloat(data.weight?.netWeight as any) || 0
    const metalValue = netWeight * metalRate

    // 3. Calculate stone value
    const stones = (data.stones || []) as any[]
    const stoneValue = stones.reduce((sum, stone) => {
      return sum + (stone.totalStonePrice || 0)
    }, 0)

    // 4. Calculate making charges
    let makingCharges = 0
    const makingType = data.makingCharges?.type || 'none'
    const makingValue = parseFloat(data.makingCharges?.value as any) || 0

    if (makingType === 'per_gram') {
      makingCharges = netWeight * makingValue
    } else if (makingType === 'percentage') {
      makingCharges = (metalValue * makingValue) / 100
    } else if (makingType === 'flat') {
      makingCharges = makingValue
    }

    // 5. Other charges
    const otherCharges = parseFloat(data.pricing?.otherCharges as any) || 0

    // 6. Subtotal
    const subtotal = metalValue + stoneValue + makingCharges + otherCharges

    // 7. Discount
    let discount = 0
    const discountType = data.pricing?.discount?.type || 'none'
    const discountValue = parseFloat(data.pricing?.discount?.value as any) || 0

    if (discountType === 'percentage') {
      discount = (subtotal * discountValue) / 100
    } else if (discountType === 'flat') {
      discount = discountValue
    }

    const afterDiscount = subtotal - discount

    // 8. GST
    const gstPercentage = parseFloat(data.pricing?.gst?.percentage as any) || 3
    const gstAmount = (afterDiscount * gstPercentage) / 100

    // 9. Total & Selling Price
    const totalPrice = afterDiscount + gstAmount
    const sellingPrice = totalPrice

    const breakdown: PriceBreakdown = {
      metalRate,
      metalValue,
      stoneValue,
      makingCharges,
      otherCharges,
      subtotal,
      gstAmount,
      totalPrice,
      discount,
      sellingPrice,
    }

    setPriceBreakdown(breakdown)

    // Update form data
    onChange('pricing', {
      ...data.pricing,
      metalRate,
      metalValue,
      stoneValue,
      makingCharges,
      otherCharges,
      subtotal,
      gst: {
        percentage: gstPercentage,
        amount: gstAmount,
      },
      totalPrice,
      sellingPrice,
      discount: {
        type: discountType,
        value: discountValue,
        amount: discount,
      },
    })
  }

  // Auto-calculate on mount and when dependencies change
  useEffect(() => {
    calculatePrice()
  }, [
    data.metal?.type,
    data.metal?.purity,
    data.weight?.netWeight,
    data.stones,
    data.makingCharges?.type,
    data.makingCharges?.value,
    data.pricing?.otherCharges,
    data.pricing?.gst?.percentage,
    data.pricing?.discount?.type,
    data.pricing?.discount?.value,
    useCurrentRate,
  ])

  const handlePricingChange = (field: string, value: any) => {
    onChange('pricing', {
      ...data.pricing,
      [field]: value,
    })
  }

  const handleDiscountChange = (field: string, value: any) => {
    onChange('pricing', {
      ...data.pricing,
      discount: {
        ...data.pricing?.discount,
        [field]: value,
      },
    })
  }

  const handleGSTChange = (value: any) => {
    onChange('pricing', {
      ...data.pricing,
      gst: {
        ...data.pricing?.gst,
        percentage: parseFloat(value) || 3,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Metal Rate Configuration */}
      <div className="space-y-4 rounded-md border border-border-primary bg-bg-tertiary p-4">
        <h3 className="font-semibold text-text-primary">
          {t('product.metalRateConfiguration')}
        </h3>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={useCurrentRate}
              onChange={() => setUseCurrentRate(true)}
              disabled={disabled}
              className="accent-accent"
            />
            <span className="text-sm text-text-primary">
              {t('product.useCurrentRate')}
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={!useCurrentRate}
              onChange={() => setUseCurrentRate(false)}
              disabled={disabled}
              className="accent-accent"
            />
            <span className="text-sm text-text-primary">
              {t('product.useCustomRate')}
            </span>
          </label>
        </div>

        {!useCurrentRate && (
          <FormInput
            name="pricing.metalRate"
            label={t('product.customMetalRate')}
            type="number"
            value={data.pricing?.metalRate || ''}
            onChange={(_, value) => handlePricingChange('metalRate', value)}
            placeholder="6000"
            disabled={disabled}
          />
        )}

        <Button
          type="button"
          variant="outline"
          onClick={calculatePrice}
          disabled={disabled}
          className="w-full"
        >
          <Calculator className="mr-2 h-4 w-4" />
          {t('product.calculatePrice')}
        </Button>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-4 rounded-md border border-border-primary bg-bg-secondary p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">
            {t('product.priceBreakdown')}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={calculatePrice}
            className="h-8 w-8"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">
              {t('product.metalRate')}
            </span>
            <span className="font-medium text-text-primary">
              ₹{priceBreakdown.metalRate.toFixed(2)}/g
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">
              {t('product.netWeight')}
            </span>
            <span className="font-medium text-text-primary">
              {(data.weight?.netWeight || 0).toFixed(3)}g
            </span>
          </div>
          <div className="h-px bg-border-secondary" />
          <div className="flex justify-between">
            <span className="text-text-secondary">
              {t('product.metalValue')}
            </span>
            <span className="font-medium text-text-primary">
              ₹{priceBreakdown.metalValue.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">
              {t('product.stoneValue')}
            </span>
            <span className="font-medium text-text-primary">
              ₹{priceBreakdown.stoneValue.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">
              {t('product.makingCharges')}
            </span>
            <span className="font-medium text-text-primary">
              ₹{priceBreakdown.makingCharges.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">
              {t('product.otherCharges')}
            </span>
            <span className="font-medium text-text-primary">
              ₹{priceBreakdown.otherCharges.toFixed(2)}
            </span>
          </div>
          <div className="h-px bg-border-secondary" />
          <div className="flex justify-between font-medium">
            <span className="text-text-primary">{t('product.subtotal')}</span>
            <span className="text-text-primary">
              ₹{priceBreakdown.subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Other Charges */}
      <FormInput
        name="pricing.otherCharges"
        label={t('product.otherCharges')}
        type="number"
        value={data.pricing?.otherCharges || ''}
        onChange={(_, value) => handlePricingChange('otherCharges', value)}
        placeholder="500"
        disabled={disabled}
      />

      {/* GST */}
      <FormInput
        name="pricing.gst.percentage"
        label={t('product.gstPercentage')}
        type="number"
        value={data.pricing?.gst?.percentage || 3}
        onChange={(_, value) => handleGSTChange(value)}
        required={true}
        disabled={disabled}
      />

      {/* Discount */}
      <div className="space-y-4">
        <h3 className="font-semibold text-text-primary">
          {t('product.discount')}
        </h3>

        <FormSelect
          name="pricing.discount.type"
          label={t('product.discountType')}
          value={data.pricing?.discount?.type || 'none'}
          onChange={(_, value) => handleDiscountChange('type', value)}
          disabled={disabled}
          options={discountTypes}
        />

        {data.pricing?.discount?.type !== 'none' && (
          <FormInput
            name="pricing.discount.value"
            label={t('product.discountValue')}
            type="number"
            value={data.pricing?.discount?.value || ''}
            onChange={(_, value) => handleDiscountChange('value', value)}
            placeholder="10"
            disabled={disabled}
          />
        )}
      </div>

      {/* Final Pricing */}
      <div className="bg-accent/5 space-y-4 rounded-md border-2 border-accent p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">
              {t('product.totalWithGST')}
            </span>
            <span className="font-medium text-text-primary">
              ₹{priceBreakdown.totalPrice.toFixed(2)}
            </span>
          </div>
          {priceBreakdown.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-text-secondary">
                {t('product.discount')}
              </span>
              <span className="font-medium text-status-error">
                - ₹{priceBreakdown.discount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="h-px bg-border-secondary" />
          <div className="flex justify-between text-lg font-bold">
            <span className="text-text-primary">
              {t('product.sellingPrice')}
            </span>
            <span className="text-accent">
              ₹{priceBreakdown.sellingPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          name="pricing.costPrice"
          label={t('product.costPrice')}
          type="number"
          value={data.pricing?.costPrice || ''}
          onChange={(_, value) => handlePricingChange('costPrice', value)}
          placeholder="135000"
          disabled={disabled}
        />

        <FormInput
          name="pricing.mrp"
          label={t('product.mrp')}
          type="number"
          value={data.pricing?.mrp || ''}
          onChange={(_, value) => handlePricingChange('mrp', value)}
          placeholder="170000"
          disabled={disabled}
        />
      </div>
    </div>
  )
}
