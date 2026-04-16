// FILE: src/components/openingBalance/sections/StockBalanceSection.tsx

import { useTranslation } from 'react-i18next'
import { Package } from 'lucide-react'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import type { StockBalance } from '@/types/openingBalance.types'

interface StockBalanceSectionProps {
  data: Partial<StockBalance>
  errors: Record<string, string>
  onChange: (data: Partial<StockBalance>) => void
  disabled?: boolean
}

export const StockBalanceSection = ({
  data,
  errors,
  onChange,
  disabled = false,
}: StockBalanceSectionProps) => {
  const { t } = useTranslation()

  const metals = ['gold', 'silver', 'platinum'] as const

  const handleTotalChange = (_: string, value: string | number) => {
    onChange({ ...data, totalStockValue: Number(value) || 0 })
  }

  const handleMetalChange = (
    metal: typeof metals[number],
    field: 'weight' | 'value' | 'purity',
    value: string | number
  ) => {
    onChange({
      ...data,
      metalStock: {
        gold:     { weight: 0, value: 0, purity: '22K',  ...(data.metalStock?.gold)     },
        silver:   { weight: 0, value: 0, purity: '925',  ...(data.metalStock?.silver)   },
        platinum: { weight: 0, value: 0, purity: '950',  ...(data.metalStock?.platinum) },
        [metal]: {
          ...(data.metalStock?.[metal] || {}),
          [field]: field === 'purity' ? value : Number(value) || 0,
        },
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Total Stock Value */}
      <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
        <div className="mb-3 flex items-center gap-2">
          <Package className="h-4 w-4 text-accent" />
          <h4 className="font-medium text-text-primary">
            {t('openingBalance.stock.totalValue')}
          </h4>
        </div>
        <FormInput
          name="stockBalance.totalStockValue"
          label={t('openingBalance.stock.totalStockValue')}
          type="number"
          value={data.totalStockValue || ''}
          onChange={handleTotalChange}
          error={errors['stockBalance.totalStockValue']}
          placeholder="0"
          disabled={disabled}
          min={0}
          helpText={t('openingBalance.stock.totalValueHint')}
        />
      </div>

      {/* Metal-wise Stock */}
      <div className="space-y-3">
        <h4 className="font-medium text-text-primary">
          {t('openingBalance.stock.metalWise')}
        </h4>
        <p className="text-xs text-text-tertiary">
          {t('openingBalance.stock.metalWiseHint')}
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {metals.map(metal => {
            const metalData = data.metalStock?.[metal]
            return (
              <div
                key={metal}
                className="rounded-lg border border-border-secondary bg-bg-secondary p-4"
              >
                <h5 className="mb-3 text-sm font-semibold capitalize text-text-primary">
                  {t(`openingBalance.metal.${metal}`)}
                </h5>
                <div className="space-y-3">
                  <FormInput
                    name={`metalStock.${metal}.weight`}
                    label={t('openingBalance.metal.weight')}
                    type="number"
                    value={metalData?.weight || ''}
                    onChange={(_, val) => handleMetalChange(metal, 'weight', val)}
                    placeholder="0"
                    disabled={disabled}
                    min={0}
                  />
                  <FormInput
                    name={`metalStock.${metal}.value`}
                    label={t('openingBalance.stock.value')}
                    type="number"
                    value={metalData?.value || ''}
                    onChange={(_, val) => handleMetalChange(metal, 'value', val)}
                    placeholder="0"
                    disabled={disabled}
                    min={0}
                  />
                  <FormInput
                    name={`metalStock.${metal}.purity`}
                    label={t('openingBalance.metal.purity')}
                    value={metalData?.purity || (metal === 'gold' ? '22K' : metal === 'silver' ? '925' : '950')}
                    onChange={(_, val) => handleMetalChange(metal, 'purity', val)}
                    placeholder={metal === 'gold' ? '22K' : metal === 'silver' ? '925' : '950'}
                    disabled={disabled}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}