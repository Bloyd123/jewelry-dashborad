// FILE: src/components/metal-rates/UpdateRatesModal/PlatinumRatesForm.tsx
// Platinum Rates Form - Section 3 of Update Metal Rates Modal

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Gem } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { RatePair } from '@/types/metalrate.types'

// TYPES

interface RatePairInput {
  buying: string
  selling: string
}

interface PlatinumRatesFormProps {
  initialData?: RatePairInput
  onChange?: (data: RatePairInput) => void
  className?: string
}

// COMPONENT

export const PlatinumRatesForm: React.FC<PlatinumRatesFormProps> = ({
  initialData,
  onChange,
  className,
}) => {
  const { t } = useTranslation()

  // State for platinum rates
  const [platinumRates, setPlatinumRates] = useState<RatePairInput>(
    initialData || { buying: '3250', selling: '3275' }
  )

  // Handle input change
  const handleRateChange = (type: 'buying' | 'selling', value: string) => {
    // Only allow numbers and decimal point
    if (value && !/^\d*\.?\d*$/.test(value)) return

    const updatedRates = {
      ...platinumRates,
      [type]: value,
    }

    setPlatinumRates(updatedRates)
    onChange?.(updatedRates)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2">
        <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
          <Gem className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            {t('metalRates.platinumRates')}
          </h3>
          <p className="text-sm text-text-secondary">
            {t('metalRates.perGram')}
          </p>
        </div>
      </div>

      {/* Rates Form */}
      <div className="space-y-4 rounded-lg border border-border-primary bg-bg-secondary p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Previous Buying Rate */}
          <div className="space-y-2">
            <Label className="text-xs text-text-secondary">
              {t('metalRates.previousBuying')}
            </Label>
            <div className="text-lg font-semibold text-text-primary">
              ₹3,250
            </div>
          </div>

          {/* New Buying Rate */}
          <div className="space-y-2">
            <Label htmlFor="platinum-buying">{t('metalRates.newBuying')}</Label>
            <Input
              id="platinum-buying"
              type="text"
              inputMode="decimal"
              value={platinumRates.buying}
              onChange={e => handleRateChange('buying', e.target.value)}
              placeholder="3250"
              className="h-10"
            />
          </div>

          {/* Previous Selling Rate */}
          <div className="space-y-2">
            <Label className="text-xs text-text-secondary">
              {t('metalRates.previousSelling')}
            </Label>
            <div className="text-lg font-semibold text-text-primary">
              ₹3,275
            </div>
          </div>

          {/* New Selling Rate */}
          <div className="space-y-2">
            <Label htmlFor="platinum-selling">
              {t('metalRates.newSelling')}
            </Label>
            <Input
              id="platinum-selling"
              type="text"
              inputMode="decimal"
              value={platinumRates.selling}
              onChange={e => handleRateChange('selling', e.target.value)}
              placeholder="3275"
              className="h-10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

PlatinumRatesForm.displayName = 'PlatinumRatesForm'
