// FILE: src/components/metal-rates/UpdateRatesModal/MarketReferenceForm.tsx
// Market Reference Form - Section 5 (Optional) of Update Metal Rates Modal

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, ChevronDown, ChevronUp } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { MarketReference } from '@/types/metalrate.types'

// TYPES

interface MarketReferenceFormData {
  internationalGoldPrice: string
  internationalSilverPrice: string
  exchangeRate: string
  referenceSource: string
}

interface MarketReferenceFormProps {
  initialData?: Partial<MarketReferenceFormData>
  onChange?: (data: MarketReferenceFormData) => void
  className?: string
}

// COMPONENT

export const MarketReferenceForm: React.FC<MarketReferenceFormProps> = ({
  initialData,
  onChange,
  className,
}) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  // State for market reference
  const [marketRef, setMarketRef] = useState<MarketReferenceFormData>({
    internationalGoldPrice: initialData?.internationalGoldPrice || '2045.50',
    internationalSilverPrice: initialData?.internationalSilverPrice || '24.30',
    exchangeRate: initialData?.exchangeRate || '83.25',
    referenceSource: initialData?.referenceSource || 'Kitco.com',
  })

  // Handle input change
  const handleFieldChange = (
    field: keyof MarketReferenceFormData,
    value: string
  ) => {
    // Only allow numbers and decimal point for numeric fields
    if (field !== 'referenceSource' && value && !/^\d*\.?\d*$/.test(value))
      return

    const updatedRef = {
      ...marketRef,
      [field]: value,
    }

    setMarketRef(updatedRef)
    onChange?.(updatedRef)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Section Header - Collapsible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex w-full items-center justify-between rounded-lg p-3',
          'border border-border-primary bg-bg-secondary',
          'transition-colors hover:bg-bg-tertiary'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Globe className="h-5 w-5 text-accent" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-semibold text-text-primary">
              {t('metalRates.marketReferencetext')}
            </h3>
            <p className="text-sm text-text-secondary">
              {t('metalRates.optionalSection')}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-text-secondary" />
        ) : (
          <ChevronDown className="h-5 w-5 text-text-secondary" />
        )}
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="space-y-4 rounded-lg border border-border-primary bg-bg-secondary p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* International Gold Price */}
            <div className="space-y-2">
              <Label htmlFor="intl-gold-price">
                {t('metalRates.internationalGoldPrice')}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  $
                </span>
                <Input
                  id="intl-gold-price"
                  type="text"
                  inputMode="decimal"
                  value={marketRef.internationalGoldPrice}
                  onChange={e =>
                    handleFieldChange('internationalGoldPrice', e.target.value)
                  }
                  placeholder="2045.50"
                  className="h-10 pl-7"
                />
              </div>
              <p className="text-xs text-text-tertiary">
                {t('metalRates.perOunce')}
              </p>
            </div>

            {/* International Silver Price */}
            <div className="space-y-2">
              <Label htmlFor="intl-silver-price">
                {t('metalRates.internationalSilverPrice')}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  $
                </span>
                <Input
                  id="intl-silver-price"
                  type="text"
                  inputMode="decimal"
                  value={marketRef.internationalSilverPrice}
                  onChange={e =>
                    handleFieldChange(
                      'internationalSilverPrice',
                      e.target.value
                    )
                  }
                  placeholder="24.30"
                  className="h-10 pl-7"
                />
              </div>
              <p className="text-xs text-text-tertiary">
                {t('metalRates.perOunce')}
              </p>
            </div>

            {/* Exchange Rate */}
            <div className="space-y-2">
              <Label htmlFor="exchange-rate">
                {t('metalRates.exchangeRate')}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  ₹
                </span>
                <Input
                  id="exchange-rate"
                  type="text"
                  inputMode="decimal"
                  value={marketRef.exchangeRate}
                  onChange={e =>
                    handleFieldChange('exchangeRate', e.target.value)
                  }
                  placeholder="83.25"
                  className="h-10 pl-7"
                />
              </div>
              <p className="text-xs text-text-tertiary">
                {t('metalRates.usdToInr')}
              </p>
            </div>

            {/* Reference Source */}
            <div className="space-y-2">
              <Label htmlFor="reference-source">
                {t('metalRates.referenceSource')}
              </Label>
              <Input
                id="reference-source"
                type="text"
                value={marketRef.referenceSource}
                onChange={e =>
                  handleFieldChange('referenceSource', e.target.value)
                }
                placeholder="Kitco.com"
                className="h-10"
              />
              <p className="text-xs text-text-tertiary">
                {t('metalRates.sourceWebsite')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

MarketReferenceForm.displayName = 'MarketReferenceForm'
