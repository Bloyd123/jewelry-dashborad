//
// FILE: src/components/supplier/SupplierManagementModal/sections/UpdateRatingSection.tsx
// Update Supplier Rating Section
//

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, Save, X, Star } from 'lucide-react'
import type { UpdateRatingSectionProps } from '../SupplierManagementModal.types'
import { cn } from '@/lib/utils'

const StarRating = ({
  label,
  value,
  onChange,
  disabled,
  currentValue,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  disabled: boolean
  currentValue?: number
}) => {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-text-primary">{label}</Label>
        {currentValue !== undefined && (
          <span className="text-xs text-text-tertiary">
            Current: {currentValue.toFixed(1)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map(star => {
          const isActive = star <= (hoverValue || value)

          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => !disabled && setHoverValue(star)}
              onMouseLeave={() => !disabled && setHoverValue(0)}
              disabled={disabled}
              className={cn(
                'transition-all hover:scale-110',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <Star
                className={cn(
                  'h-8 w-8 transition-colors',
                  isActive
                    ? 'fill-accent text-accent'
                    : 'fill-transparent text-border-primary'
                )}
              />
            </button>
          )
        })}

        <span className="ml-2 text-lg font-semibold text-text-primary">
          {value.toFixed(1)}
        </span>
      </div>
    </div>
  )
}

export const UpdateRatingSection = ({
  supplier,
  onSubmit,
  onCancel,
  isLoading = false,
}: UpdateRatingSectionProps) => {
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    qualityRating: supplier.qualityRating || 5,
    deliveryRating: supplier.deliveryRating || 5,
    priceRating: supplier.priceRating || 5,
  })

  // Calculate overall rating
  const overallRating =
    (formData.qualityRating + formData.deliveryRating + formData.priceRating) /
    3

  const handleChange = (field: keyof typeof formData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    await onSubmit(formData)
  }

  return (
    <div className="space-y-6">
      {/* Current Overall Rating */}
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4 text-center">
        <p className="text-sm text-text-tertiary">
          {t('suppliers.rating.currentOverallRating')}
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              className={cn(
                'h-6 w-6',
                star <= Math.round(supplier.rating || 0)
                  ? 'fill-accent text-accent'
                  : 'fill-transparent text-border-primary'
              )}
            />
          ))}
          <span className="ml-2 text-2xl font-bold text-text-primary">
            {(supplier.rating || 0).toFixed(1)}
          </span>
        </div>
      </div>

      {/* Rating Form */}
      <div className="space-y-6">
        {/* Quality Rating */}
        <StarRating
          label={t('suppliers.rating.qualityRating')}
          value={formData.qualityRating}
          onChange={value => handleChange('qualityRating', value)}
          disabled={isLoading}
          currentValue={supplier.qualityRating}
        />

        {/* Delivery Rating */}
        <StarRating
          label={t('suppliers.rating.deliveryRating')}
          value={formData.deliveryRating}
          onChange={value => handleChange('deliveryRating', value)}
          disabled={isLoading}
          currentValue={supplier.deliveryRating}
        />

        {/* Price Rating */}
        <StarRating
          label={t('suppliers.rating.priceRating')}
          value={formData.priceRating}
          onChange={value => handleChange('priceRating', value)}
          disabled={isLoading}
          currentValue={supplier.priceRating}
        />
      </div>

      {/* New Overall Rating Preview */}
      <div className="border-accent/20 bg-accent/5 rounded-lg border-2 p-4 text-center">
        <p className="text-sm text-text-tertiary">
          {t('suppliers.rating.newOverallRating')}
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              className={cn(
                'h-6 w-6',
                star <= Math.round(overallRating)
                  ? 'fill-accent text-accent'
                  : 'fill-transparent text-border-primary'
              )}
            />
          ))}
          <span className="ml-2 text-2xl font-bold text-text-primary">
            {overallRating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          <X className="mr-2 h-4 w-4" />
          {t('common.cancel')}
        </Button>

        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('common.updating')}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t('suppliers.rating.updateRating')}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
