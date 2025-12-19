// ============================================================================
// FILE: src/components/features/MetalRates/GoldRatesForm.tsx
// Gold Rates Form - Section 1 of Update Metal Rates Modal
// ============================================================================

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Coins, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface RatePairInput {
  buying: string;
  selling: string;
}

interface GoldRatesFormData {
  gold24K: RatePairInput;
  gold22K: RatePairInput;
  gold18K: RatePairInput;
  gold14K: RatePairInput;
}

interface GoldRatesFormProps {
  initialData?: Partial<GoldRatesFormData>;
  onChange?: (data: GoldRatesFormData) => void;
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const GoldRatesForm: React.FC<GoldRatesFormProps> = ({
  initialData,
  onChange,
  className,
}) => {
  const { t } = useTranslation();

  // State for gold rates
  const [goldRates, setGoldRates] = useState<GoldRatesFormData>({
    gold24K: initialData?.gold24K || { buying: '6450', selling: '6470' },
    gold22K: initialData?.gold22K || { buying: '5910', selling: '5928' },
    gold18K: initialData?.gold18K || { buying: '4837', selling: '4853' },
    gold14K: initialData?.gold14K || { buying: '3773', selling: '3785' },
  });

  // Handle input change
  const handleRateChange = (
    purity: keyof GoldRatesFormData,
    type: 'buying' | 'selling',
    value: string
  ) => {
    // Only allow numbers and decimal point
    if (value && !/^\d*\.?\d*$/.test(value)) return;

    const updatedRates = {
      ...goldRates,
      [purity]: {
        ...goldRates[purity],
        [type]: value,
      },
    };

    setGoldRates(updatedRates);
    onChange?.(updatedRates);
  };

  // Gold purity rows configuration
  const goldPurities: Array<{
    key: keyof GoldRatesFormData;
    label: string;
    previousBuy: string;
    previousSell: string;
  }> = [
    {
      key: 'gold24K',
      label: '24K',
      previousBuy: '₹6,450',
      previousSell: '₹6,470',
    },
    {
      key: 'gold22K',
      label: '22K',
      previousBuy: '₹5,910',
      previousSell: '₹5,928',
    },
    {
      key: 'gold18K',
      label: '18K',
      previousBuy: '₹4,837',
      previousSell: '₹4,853',
    },
    {
      key: 'gold14K',
      label: '14K',
      previousBuy: '₹3,773',
      previousSell: '₹3,785',
    },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10">
          <Coins className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            {t('metalRates.goldRates')}
          </h3>
          <p className="text-sm text-text-secondary">
            {t('metalRates.perGram')}
          </p>
        </div>
      </div>

      {/* Rates Table */}
      <div className="rounded-lg border border-border-primary overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 bg-bg-tertiary p-3 border-b border-border-primary">
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
          {goldPurities.map((purity, index) => (
            <div
              key={purity.key}
              className={cn(
                'grid grid-cols-5 gap-4 p-3 items-center',
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
                  value={goldRates[purity.key].buying}
                  onChange={(e) =>
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
                  value={goldRates[purity.key].selling}
                  onChange={(e) =>
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

      {/* Info Tip */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-status-info/10 border border-status-info/20">
        <Info className="h-4 w-4 text-status-info flex-shrink-0 mt-0.5" />
        <p className="text-sm text-text-secondary">
          {t('metalRates.sellingRateTip')}
        </p>
      </div>
    </div>
  );
};

GoldRatesForm.displayName = 'GoldRatesForm';