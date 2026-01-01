// ============================================================================
// FILE: src/components/features/Products/tabs/PricingTab.tsx
// Product Pricing Tab - Accordion-based Layout
// ============================================================================

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  DollarSign,
  TrendingUp,
  Calculator,
  Percent,
  Receipt,
  Tag,
  Gem,
  AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/layout/Accordion/Accordion'
import type { Product } from '@/types/product.types'

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface PricingTabProps {
  product: Product
  loading?: boolean
  onRecalculatePrice?: () => void
}

// ============================================================================
// PRICING TAB COMPONENT
// ============================================================================

export const PricingTab: React.FC<PricingTabProps> = ({
  product,
  loading = false,
  onRecalculatePrice,
}) => {
  const { t } = useTranslation()

  // Calculate profit margin
  const profitMargin =
    product.pricing.costPrice > 0
      ? (
          ((product.pricing.sellingPrice - product.pricing.costPrice) /
            product.pricing.costPrice) *
          100
        ).toFixed(2)
      : '0.00'

  const profitAmount = product.pricing.sellingPrice - product.pricing.costPrice

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg bg-bg-tertiary"
          />
        ))}
      </div>
    )
  }

  // ========================================================================
  // PRICE SUMMARY SECTION
  // ========================================================================

  const PriceSummarySection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Selling Price */}
        <div className="border-accent/20 bg-accent/5 rounded-lg border p-4">
          <p className="flex items-center gap-2 text-xs text-text-secondary">
            <DollarSign className="h-3 w-3" />
            {t('product.sellingPrice')}
          </p>
          <p className="mt-2 text-2xl font-bold text-accent">
            ₹{product.pricing.sellingPrice.toLocaleString()}
          </p>
        </div>

        {/* Cost Price */}
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
          <p className="flex items-center gap-2 text-xs text-text-secondary">
            <Receipt className="h-3 w-3" />
            {t('product.costPrice')}
          </p>
          <p className="mt-2 text-2xl font-bold text-text-primary">
            ₹{product.pricing.costPrice.toLocaleString()}
          </p>
        </div>

        {/* Profit Margin */}
        <div className="border-status-success/20 bg-status-success/5 rounded-lg border p-4">
          <p className="flex items-center gap-2 text-xs text-text-secondary">
            <TrendingUp className="h-3 w-3" />
            {t('product.profitMargin')}
          </p>
          <p className="mt-2 text-2xl font-bold text-status-success">
            {profitMargin}%
          </p>
        </div>

        {/* Profit Amount */}
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
          <p className="flex items-center gap-2 text-xs text-text-secondary">
            <Percent className="h-3 w-3" />
            {t('product.profitAmount')}
          </p>
          <p className="mt-2 text-2xl font-bold text-status-success">
            ₹{profitAmount.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )

  // ========================================================================
  // METAL PRICING SECTION
  // ========================================================================

  const MetalPricingSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Current Metal Rate */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('product.metalRate')}
          </Label>
          <p className="text-xl font-semibold text-text-primary">
            ₹{product.pricing.metalRate.toLocaleString()}/{product.weight.unit}
          </p>
        </div>

        {/* Net Weight */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('product.netWeight')}
          </Label>
          <p className="text-xl font-semibold text-text-primary">
            {product.weight.netWeight} {product.weight.unit}
          </p>
        </div>
      </div>

      {/* Metal Value Calculation */}
      <div className="border-accent/20 bg-accent/5 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs text-text-secondary">
              {t('product.metalValue')}
            </Label>
            <p className="mt-1 text-sm text-text-secondary">
              {product.weight.netWeight} {product.weight.unit} × ₹
              {product.pricing.metalRate.toLocaleString()}
            </p>
          </div>
          <p className="text-2xl font-bold text-accent">
            ₹{product.pricing.metalValue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )

  // ========================================================================
  // MAKING CHARGES SECTION
  // ========================================================================

  const MakingChargesSection = () => (
    <div className="space-y-4 p-4">
      {/* Making Charge Type */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-text-secondary">
          {t('product.makingChargeTypestext')}
        </Label>
        <Badge variant="default" size="sm" className="w-fit capitalize">
          {t(`product.makingChargeTypes.${product.makingCharges.type}`)}
        </Badge>
      </div>

      {product.makingCharges.type !== 'none' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Making Charge Rate */}
          <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
            <p className="text-xs text-text-secondary">
              {t('product.makingChargeRate')}
            </p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              {product.makingCharges.type === 'per_gram' &&
                `₹${product.makingCharges.value}/${product.weight.unit}`}
              {product.makingCharges.type === 'percentage' &&
                `${product.makingCharges.value}%`}
              {product.makingCharges.type === 'flat' &&
                `₹${product.makingCharges.value}`}
            </p>
          </div>

          {/* Making Charges Amount */}
          <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
            <p className="text-xs text-text-secondary">
              {t('product.makingChargesAmount')}
            </p>
            <p className="mt-1 text-lg font-semibold text-accent">
              ₹{product.makingCharges.amount.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )

  // ========================================================================
  // STONE VALUE SECTION
  // ========================================================================

  const StoneValueSection = () => {
    if (product.pricing.stoneValue === 0) {
      return (
        <div className="p-4">
          <p className="text-sm text-text-secondary">
            {t('product.noStoneValue')}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4 p-4">
        <div className="border-accent/20 bg-accent/5 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-text-secondary">
              {t('product.totalStoneValue')}
            </Label>
            <p className="text-2xl font-bold text-accent">
              ₹{product.pricing.stoneValue.toLocaleString()}
            </p>
          </div>
        </div>

        {product.stones && product.stones.length > 0 && (
          <div>
            <Label className="mb-2 text-xs text-text-secondary">
              {t('product.stonesBreakdown')}
            </Label>
            <div className="text-sm text-text-primary">
              {product.stones.length}{' '}
              {product.stones.length === 1 ? 'stone' : 'stones'} included
            </div>
          </div>
        )}
      </div>
    )
  }

  // ========================================================================
  // PRICE BREAKDOWN SECTION
  // ========================================================================

  const PriceBreakdownSection = () => (
    <div className="space-y-3 p-4">
      {/* Component Prices */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-border-secondary pb-2">
          <span className="text-sm text-text-secondary">
            {t('product.metalValue')}
          </span>
          <span className="font-medium text-text-primary">
            ₹{product.pricing.metalValue.toLocaleString()}
          </span>
        </div>

        {product.pricing.stoneValue > 0 && (
          <div className="flex items-center justify-between border-b border-border-secondary pb-2">
            <span className="text-sm text-text-secondary">
              {t('product.stoneValue')}
            </span>
            <span className="font-medium text-text-primary">
              ₹{product.pricing.stoneValue.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-border-secondary pb-2">
          <span className="text-sm text-text-secondary">
            {t('product.makingCharges')}
          </span>
          <span className="font-medium text-text-primary">
            ₹{product.pricing.makingCharges.toLocaleString()}
          </span>
        </div>

        {product.pricing.otherCharges > 0 && (
          <div className="flex items-center justify-between border-b border-border-secondary pb-2">
            <span className="text-sm text-text-secondary">
              {t('product.otherCharges')}
            </span>
            <span className="font-medium text-text-primary">
              ₹{product.pricing.otherCharges.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-border-secondary pb-2">
          <span className="font-medium text-text-primary">
            {t('product.subtotal')}
          </span>
          <span className="font-semibold text-text-primary">
            ₹{product.pricing.subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-border-secondary pb-2">
          <span className="text-sm text-text-secondary">
            {t('product.gst')} ({product.pricing.gst.percentage}%)
          </span>
          <span className="font-medium text-text-primary">
            ₹{product.pricing.gst.amount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-border-secondary pb-2">
          <span className="font-medium text-text-primary">
            {t('product.totalPrice')}
          </span>
          <span className="text-lg font-bold text-accent">
            ₹{product.pricing.totalPrice.toLocaleString()}
          </span>
        </div>

        {product.pricing.discount.type !== 'none' && (
          <div className="bg-status-success/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-status-success">
                {t('product.discount')} (
                {product.pricing.discount.type === 'percentage'
                  ? `${product.pricing.discount.value}%`
                  : 'Flat'}
                )
              </span>
              <span className="font-medium text-status-success">
                -₹{product.pricing.discount.amount.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Final Selling Price */}
        <div className="border-accent/20 bg-accent/5 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-text-primary">
              {t('product.finalSellingPrice')}
            </span>
            <span className="text-2xl font-bold text-accent">
              ₹{product.pricing.sellingPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Recalculate Button */}
      {onRecalculatePrice && (
        <Button
          variant="outline"
          onClick={onRecalculatePrice}
          className="w-full gap-2"
        >
          <Calculator className="h-4 w-4" />
          {t('product.recalculate')}
        </Button>
      )}
    </div>
  )

  // ========================================================================
  // ADDITIONAL INFO SECTION
  // ========================================================================

  const AdditionalInfoSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* MRP */}
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
          <p className="text-xs text-text-secondary">{t('product.mrp')}</p>
          <p className="mt-2 text-xl font-semibold text-text-primary">
            ₹{product.pricing.mrp.toLocaleString()}
          </p>
        </div>

        {/* Profit Amount */}
        <div className="border-status-success/20 bg-status-success/5 rounded-lg border p-4">
          <p className="text-xs text-text-secondary">
            {t('product.profitAmount')}
          </p>
          <p className="mt-2 text-xl font-semibold text-status-success">
            ₹{profitAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Profit Margin Info */}
      <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 text-text-secondary" />
          <div>
            <p className="text-xs font-medium text-text-primary">
              {t('product.profitMarginInfo')}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Calculated as: (Selling Price - Cost Price) / Cost Price × 100
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  // ========================================================================
  // RENDER MAIN ACCORDION
  // ========================================================================

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
      <Accordion
        type="multiple"
        defaultValue={['summary', 'metal', 'breakdown']}
        variant="separated"
        size="md"
      >
        {/* Price Summary */}
        <AccordionItem value="summary">
          <AccordionTrigger
            icon={<DollarSign className="h-5 w-5" />}
            badge={
              <Badge variant="accent" size="sm">
                ₹{product.pricing.sellingPrice.toLocaleString()}
              </Badge>
            }
          >
            {t('product.productDetail.pricing.summary')}
          </AccordionTrigger>
          <AccordionContent>
            <PriceSummarySection />
          </AccordionContent>
        </AccordionItem>

        {/* Metal Pricing */}
        <AccordionItem value="metal">
          <AccordionTrigger
            icon={<Gem className="h-5 w-5" />}
            badge={
              <Badge variant="info" size="sm">
                {product.metal.purity} {product.metal.type}
              </Badge>
            }
          >
            {t('product.productDetail.pricing.metalPricing')}
          </AccordionTrigger>
          <AccordionContent>
            <MetalPricingSection />
          </AccordionContent>
        </AccordionItem>

        {/* Making Charges */}
        <AccordionItem value="making">
          <AccordionTrigger icon={<Calculator className="h-5 w-5" />}>
            {t('product.productDetail.pricing.makingCharges')}
          </AccordionTrigger>
          <AccordionContent>
            <MakingChargesSection />
          </AccordionContent>
        </AccordionItem>

        {/* Stone Value */}
        {product.pricing.stoneValue > 0 && (
          <AccordionItem value="stone">
            <AccordionTrigger
              icon={<Tag className="h-5 w-5" />}
              badge={
                product.stones && (
                  <Badge variant="info" size="sm">
                    {product.stones.length}{' '}
                    {product.stones.length === 1 ? 'Stone' : 'Stones'}
                  </Badge>
                )
              }
            >
              {t('product.productDetail.pricing.stoneValue')}
            </AccordionTrigger>
            <AccordionContent>
              <StoneValueSection />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Price Breakdown */}
        <AccordionItem value="breakdown">
          <AccordionTrigger icon={<Receipt className="h-5 w-5" />}>
            {t('product.productDetail.pricing.breakdown')}
          </AccordionTrigger>
          <AccordionContent>
            <PriceBreakdownSection />
          </AccordionContent>
        </AccordionItem>

        {/* Additional Info */}
        <AccordionItem value="additional">
          <AccordionTrigger icon={<TrendingUp className="h-5 w-5" />}>
            {t('product.productDetail.pricing.additional')}
          </AccordionTrigger>
          <AccordionContent>
            <AdditionalInfoSection />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default PricingTab
