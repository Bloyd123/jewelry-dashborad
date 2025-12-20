// ============================================================================
// FILE: src/components/features/MetalRates/SilverRatesForm.tsx
// Silver Rates Form - Section 2 of Update Metal Rates Modal
// ============================================================================

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { RatePair } from '@/types/metalrate.types'

// ============================================================================
// TYPES
// ============================================================================

interface RatePairInput {
  buying: string
  selling: string
}

interface SilverRatesFormData {
  pure: RatePairInput
  sterling925: RatePairInput
}

interface SilverRatesFormProps {
  initialData?: Partial<SilverRatesFormData>
  onChange?: (data: SilverRatesFormData) => void
  className?: string
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SilverRatesForm: React.FC<SilverRatesFormProps> = ({
  initialData,
  onChange,
  className,
}) => {
  const { t } = useTranslation()

  // State for silver rates
  const [silverRates, setSilverRates] = useState<SilverRatesFormData>({
    pure: initialData?.pure || { buying: '82.50', selling: '83.00' },
    sterling925: initialData?.sterling925 || {
      buying: '76.30',
      selling: '76.75',
    },
  })

  // Handle input change
  const handleRateChange = (
    purity: keyof SilverRatesFormData,
    type: 'buying' | 'selling',
    value: string
  ) => {
    // Only allow numbers and decimal point
    if (value && !/^\d*\.?\d*$/.test(value)) return

    const updatedRates = {
      ...silverRates,
      [purity]: {
        ...silverRates[purity],
        [type]: value,
      },
    }

    setSilverRates(updatedRates)
    onChange?.(updatedRates)
  }

  // Silver purity rows configuration
  const silverPurities: Array<{
    key: keyof SilverRatesFormData
    label: string
    previousBuy: string
    previousSell: string
  }> = [
    {
      key: 'pure',
      label: '999',
      previousBuy: '₹82.50',
      previousSell: '₹83.00',
    },
    {
      key: 'sterling925',
      label: '925',
      previousBuy: '₹76.30',
      previousSell: '₹76.75',
    },
  ]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2">
        <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
          <Sparkles className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            {t('metalRates.silverRates')}
          </h3>
          <p className="text-sm text-text-secondary">
            {t('metalRates.perGram')}
          </p>
        </div>
      </div>

      {/* Rates Table */}
      <div className="overflow-hidden rounded-lg border border-border-primary">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 border-b border-border-primary bg-bg-tertiary p-3">
          <div className="text-sm font-semibold text-text-primary">
            {t('metalRates.puritytext')}
          </div>
          <div className="text-sm font-semibold text-text-primary">
            {t('metalRates.previousBuy')}
          </div>
          <div className="text-sm font-semibold text-text-primary">
            {t('metalRates.newBuyRate')}
          </div>
          <div className="text-sm font-semibold text-text-primary">
            {t('metalRates.previousSell')}
          </div>
          <div className="text-sm font-semibold text-text-primary">
            {t('metalRates.newSellRate')}
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border-primary bg-bg-secondary">
          {silverPurities.map((purity, index) => (
            <div
              key={purity.key}
              className={cn(
                'grid grid-cols-5 items-center gap-4 p-3',
                index % 2 === 1 && 'bg-bg-tertiary/30'
              )}
            >
              {/* Purity Label */}
              <div className="font-medium text-text-primary">
                {purity.label}
              </div>

              {/* Previous Buy */}
              <div className="text-sm text-text-secondary">
                {purity.previousBuy}
              </div>

              {/* New Buy Rate Input */}
              <div>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={silverRates[purity.key].buying}
                  onChange={e =>
                    handleRateChange(purity.key, 'buying', e.target.value)
                  }
                  placeholder="0.00"
                  className="h-9"
                />
              </div>

              {/* Previous Sell */}
              <div className="text-sm text-text-secondary">
                {purity.previousSell}
              </div>

              {/* New Sell Rate Input */}
              <div>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={silverRates[purity.key].selling}
                  onChange={e =>
                    handleRateChange(purity.key, 'selling', e.target.value)
                  }
                  placeholder="0.00"
                  className="h-9"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

SilverRatesForm.displayName = 'SilverRatesForm'

// ============================================================================
// TRANSLATION KEYS
// ============================================================================

/*
{
  "metalRates": {

  }
}
*/
