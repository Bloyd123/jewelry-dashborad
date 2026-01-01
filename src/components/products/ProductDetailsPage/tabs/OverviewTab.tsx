// ============================================================================
// FILE: src/components/features/Products/tabs/OverviewTab.tsx
// Product Overview Tab - Accordion-based Layout
// ============================================================================

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Package,
  Tag,
  Scale,
  Gem,
  Info,
  MapPin,
  Copy,
  Check,
  Barcode,
  Hash,
  Layers,
  User,
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

interface OverviewTabProps {
  product: Product
  loading?: boolean
}

// ============================================================================
// COPY BUTTON COMPONENT
// ============================================================================

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-6 w-6 p-0"
    >
      {copied ? (
        <Check className="h-3 w-3 text-status-success" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  )
}

// ============================================================================
// OVERVIEW TAB COMPONENT
// ============================================================================

export const OverviewTab: React.FC<OverviewTabProps> = ({
  product,
  loading = false,
}) => {
  const { t } = useTranslation()

  // Helper functions
  const getCategoryName = () => {
    if (typeof product.categoryId === 'object') {
      return product.categoryId.name.default
    }
    return '-'
  }

  const getSubCategoryName = () => {
    if (typeof product.subCategoryId === 'object') {
      return product.subCategoryId.name.default
    }
    return '-'
  }

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
  // BASIC INFORMATION SECTION
  // ========================================================================

  const BasicInfoSection = () => (
    <div className="space-y-4 p-4">
      {/* Product Image Preview */}
      <div className="mb-4 flex items-start gap-4 rounded-lg border border-border-secondary bg-bg-tertiary p-3">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border-primary">
          {product.primaryImage ? (
            <img
              src={product.primaryImage}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-bg-secondary">
              <Package className="h-8 w-8 text-text-tertiary" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-base font-semibold text-text-primary">
            {product.name}
          </h4>
          <p className="mt-1 text-xs text-text-secondary">
            {product.description || t('product.noDescription')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Product Code */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Hash className="h-3 w-3" />
            {t('product.productCode')}
          </Label>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm font-medium text-text-primary">
              {product.productCode}
            </p>
            <CopyButton text={product.productCode} />
          </div>
        </div>

        {/* Barcode */}
        {product.barcode && (
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-2 text-xs text-text-secondary">
              <Barcode className="h-3 w-3" />
              {t('product.barcode')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium text-text-primary">
                {product.barcode}
              </p>
              <CopyButton text={product.barcode} />
            </div>
          </div>
        )}

        {/* SKU */}
        {product.sku && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('product.sku')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium text-text-primary">
                {product.sku}
              </p>
              <CopyButton text={product.sku} />
            </div>
          </div>
        )}

        {/* HUID */}
        {product.huid && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('product.huid')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium text-text-primary">
                {product.huid}
              </p>
              <CopyButton text={product.huid} />
            </div>
          </div>
        )}

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Layers className="h-3 w-3" />
            {t('product.categorytext')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {getCategoryName()}
            {getSubCategoryName() !== '-' && ` > ${getSubCategoryName()}`}
          </p>
        </div>

        {/* Product Type */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('product.productTypestext')}
          </Label>
          <Badge variant="default" size="sm" className="w-fit">
            {t(`product.productTypes.${product.productType}`)}
          </Badge>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <User className="h-3 w-3" />
            {t('product.gendertext')}
          </Label>
          <Badge variant="info" size="sm" className="w-fit">
            {t(`product.gender.${product.gender}`)}
          </Badge>
        </div>

        {/* Occasion */}
        {product.occasion && product.occasion.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('product.occasionText')}
            </Label>
            <div className="flex flex-wrap gap-1">
              {product.occasion.map((occ, index) => (
                <Badge key={index} variant="outline" size="sm">
                  {t(`product.occasion.${occ}`)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div className="border-t border-border-secondary pt-4">
          <Label className="mb-2 text-xs text-text-secondary">
            {t('product.productDetail.overview.description')}
          </Label>
          <p className="text-sm text-text-primary">{product.description}</p>
        </div>
      )}
    </div>
  )

  // ========================================================================
  // METAL DETAILS SECTION
  // ========================================================================

  const MetalDetailsSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Metal Type */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('product.metalType')}
          </Label>
          <p className="text-sm font-medium capitalize text-text-primary">
            {product.metal.type}
          </p>
        </div>

        {/* Purity */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('product.purity')}
          </Label>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">
              {product.metal.purity}
            </Badge>
            {product.metal.purityPercentage && (
              <span className="text-sm text-text-secondary">
                ({product.metal.purityPercentage}%)
              </span>
            )}
          </div>
        </div>

        {/* Color */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('product.color')}
          </Label>
          <p className="text-sm font-medium capitalize text-text-primary">
            {product.metal.color}
          </p>
        </div>
      </div>
    </div>
  )

  // ========================================================================
  // WEIGHT DETAILS SECTION
  // ========================================================================

  const WeightDetailsSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Gross Weight */}
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
          <p className="text-xs text-text-secondary">
            {t('product.grossWeight')}
          </p>
          <p className="mt-1 text-xl font-semibold text-text-primary">
            {product.weight.grossWeight} {product.weight.unit}
          </p>
        </div>

        {/* Stone Weight */}
        {product.weight.stoneWeight > 0 && (
          <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
            <p className="text-xs text-text-secondary">
              {t('product.stoneWeight')}
            </p>
            <p className="mt-1 text-xl font-semibold text-text-primary">
              {product.weight.stoneWeight} {product.weight.unit}
            </p>
          </div>
        )}

        {/* Net Weight */}
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
          <p className="text-xs text-text-secondary">
            {t('product.netWeight')}
          </p>
          <p className="mt-1 text-xl font-semibold text-accent">
            {product.weight.netWeight} {product.weight.unit}
          </p>
        </div>

        {/* Wastage */}
        {product.weight.wastage.percentage > 0 && (
          <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
            <p className="text-xs text-text-secondary">
              {t('product.wastage')}
            </p>
            <p className="mt-1 text-sm font-semibold text-text-primary">
              {product.weight.wastage.percentage}%
            </p>
            <p className="text-xs text-text-secondary">
              ({product.weight.wastage.weight} {product.weight.unit})
            </p>
          </div>
        )}
      </div>
    </div>
  )

  // ========================================================================
  // STOCK INFORMATION SECTION
  // ========================================================================

  const StockInfoSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Current Quantity */}
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
          <p className="text-xs text-text-secondary">{t('product.quantity')}</p>
          <p className="mt-1 text-3xl font-bold text-text-primary">
            {product.stock.quantity}
          </p>
          <p className="text-xs text-text-secondary">{product.stock.unit}</p>
        </div>

        {/* Reorder Level */}
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
          <p className="text-xs text-text-secondary">
            {t('product.reorderLevel')}
          </p>
          <p className="mt-1 text-3xl font-bold text-text-primary">
            {product.stock.reorderLevel}
          </p>
        </div>

        {/* Status */}
        <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
          <p className="text-xs text-text-secondary">
            {t('product.statustext')}
          </p>
          <div className="mt-2">
            <Badge
              variant={
                product.status === 'in_stock'
                  ? 'success'
                  : product.status === 'low_stock'
                    ? 'warning'
                    : 'error'
              }
              size="lg"
            >
              {t(`product.status.${product.status}`)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Storage Location */}
      {product.stock.location && (
        <div className="border-t border-border-secondary pt-4">
          <Label className="mb-3 flex items-center gap-2 text-xs text-text-secondary">
            <MapPin className="h-4 w-4" />
            {t('product.storageLocation')}
          </Label>
          <div className="flex flex-wrap gap-2">
            {product.stock.location.warehouse && (
              <Badge variant="outline" size="sm">
                Warehouse: {product.stock.location.warehouse}
              </Badge>
            )}
            {product.stock.location.rack && (
              <Badge variant="outline" size="sm">
                Rack: {product.stock.location.rack}
              </Badge>
            )}
            {product.stock.location.shelf && (
              <Badge variant="outline" size="sm">
                Shelf: {product.stock.location.shelf}
              </Badge>
            )}
            {product.stock.location.bin && (
              <Badge variant="outline" size="sm">
                Bin: {product.stock.location.bin}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )

  // ========================================================================
  // TAGS SECTION
  // ========================================================================

  const TagsSection = () => {
    if (!product.tags || product.tags.length === 0) {
      return (
        <div className="p-4">
          <p className="text-sm text-text-secondary">{t('product.noTags')}</p>
        </div>
      )
    }

    return (
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag, index) => (
            <Badge key={index} variant="outline" size="md">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    )
  }

  // ========================================================================
  // RENDER MAIN ACCORDION
  // ========================================================================

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
      <Accordion
        type="multiple"
        defaultValue={['basic', 'metal', 'weight', 'stock']}
        variant="separated"
        size="md"
      >
        {/* Basic Information */}
        <AccordionItem value="basic">
          <AccordionTrigger icon={<Package className="h-5 w-5" />}>
            {t('product.productDetail.overview.basicInfo')}
          </AccordionTrigger>
          <AccordionContent>
            <BasicInfoSection />
          </AccordionContent>
        </AccordionItem>

        {/* Metal Details */}
        <AccordionItem value="metal">
          <AccordionTrigger
            icon={<Gem className="h-5 w-5" />}
            badge={
              <Badge variant="info" size="sm">
                {product.metal.purity} {product.metal.type}
              </Badge>
            }
          >
            {t('product.productDetail.overview.metalDetails')}
          </AccordionTrigger>
          <AccordionContent>
            <MetalDetailsSection />
          </AccordionContent>
        </AccordionItem>

        {/* Weight Details */}
        <AccordionItem value="weight">
          <AccordionTrigger icon={<Scale className="h-5 w-5" />}>
            {t('product.productDetail.overview.weightDetails')}
          </AccordionTrigger>
          <AccordionContent>
            <WeightDetailsSection />
          </AccordionContent>
        </AccordionItem>

        {/* Stock Information */}
        <AccordionItem value="stock">
          <AccordionTrigger
            icon={<Tag className="h-5 w-5" />}
            badge={
              <Badge
                variant={
                  product.status === 'in_stock'
                    ? 'success'
                    : product.status === 'low_stock'
                      ? 'warning'
                      : 'error'
                }
                size="sm"
                dot
              >
                {t(`product.status.${product.status}`)}
              </Badge>
            }
          >
            {t('product.productDetail.overview.stockInfo')}
          </AccordionTrigger>
          <AccordionContent>
            <StockInfoSection />
          </AccordionContent>
        </AccordionItem>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <AccordionItem value="tags">
            <AccordionTrigger icon={<Info className="h-5 w-5" />}>
              {t('product.tags')}
            </AccordionTrigger>
            <AccordionContent>
              <TagsSection />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}

export default OverviewTab
