// 
// FILE: src/components/supplier/SupplierManagementModal/sections/PreferredSupplierSection.tsx
// Preferred Supplier Section
// 

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Loader2, Star, X, Check } from 'lucide-react'
import type { PreferredSupplierSectionProps } from '../SupplierManagementModal.types'
import { cn } from '@/lib/utils'

export const PreferredSupplierSection = ({
  supplier,
  onMarkPreferred,
  onRemovePreferred,
  onCancel,
}: PreferredSupplierSectionProps) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const isPreferred = supplier.isPreferred

  const handleMarkPreferred = async () => {
    setIsLoading(true)
    try {
      await onMarkPreferred()
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemovePreferred = async () => {
    setIsLoading(true)
    try {
      await onRemovePreferred()
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    {
      icon: Check,
      text: t('suppliers.preferred.benefit1'),
    },
    {
      icon: Check,
      text: t('suppliers.preferred.benefit2'),
    },
    {
      icon: Check,
      text: t('suppliers.preferred.benefit3'),
    },
    {
      icon: Check,
      text: t('suppliers.preferred.benefit4'),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div
        className={cn(
          'rounded-lg border-2 p-4 text-center',
          isPreferred
            ? 'bg-accent/10 border-accent'
            : 'border-border-primary bg-bg-tertiary'
        )}
      >
        <div className="flex items-center justify-center gap-2">
          <Star
            className={cn(
              'h-6 w-6',
              isPreferred
                ? 'fill-accent text-accent'
                : 'fill-transparent text-border-primary'
            )}
          />
          <p className="text-lg font-semibold text-text-primary">
            {isPreferred
              ? t('suppliers.preferred.currentlyPreferred')
              : t('suppliers.preferred.notPreferred')}
          </p>
        </div>

        {isPreferred && (
          <p className="mt-2 text-sm text-text-secondary">
            {t('suppliers.preferred.preferredSince')}:{' '}
            {new Date(supplier.verifiedAt || '').toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Benefits Section */}
      {!isPreferred && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
            <p className="mb-4 text-center font-medium text-text-primary">
              {t('suppliers.preferred.benefitsTitle')}
            </p>

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <benefit.icon className="h-5 w-5 text-status-success" />
                  </div>
                  <p className="text-sm text-text-secondary">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Supplier Info */}
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-text-tertiary">
              {t('suppliers.preferred.totalOrders')}
            </p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              {supplier.statistics.totalOrders}
            </p>
          </div>

          <div>
            <p className="text-text-tertiary">
              {t('suppliers.preferred.rating')}
            </p>
            <div className="mt-1 flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <p className="text-lg font-semibold text-text-primary">
                {(supplier.rating || 0).toFixed(1)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-text-tertiary">
              {t('suppliers.preferred.totalPurchased')}
            </p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              ₹{supplier.totalPurchases.toLocaleString('en-IN')}
            </p>
          </div>

          <div>
            <p className="text-text-tertiary">
              {t('suppliers.preferred.onTimeDelivery')}
            </p>
            <p className="mt-1 text-lg font-semibold text-status-success">
              {supplier.statistics.onTimeDeliveryPercentage}%
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        {isPreferred ? (
          <>
            <Button
              variant="destructive"
              onClick={handleRemovePreferred}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.processing')}
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  {t('suppliers.preferred.removeFromPreferred')}
                </>
              )}
            </Button>

            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              {t('common.cancel')}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleMarkPreferred}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.processing')}
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  {t('suppliers.preferred.markAsPreferred')}
                </>
              )}
            </Button>

            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              {t('common.cancel')}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
