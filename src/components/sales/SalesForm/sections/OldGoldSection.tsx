//
// FILE: src/components/sales/SaleForm/sections/OldGoldSection.tsx
// Old Gold Exchange Section
//

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormTextarea } from '@/components/forms/FormTextarea/FormTextarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Coins } from 'lucide-react'
import type { FormSectionProps } from '../SaleForm.types'
import { defaultOldGoldItem } from '../SaleForm.types'

export const OldGoldSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const hasExchange = data.oldGoldExchange?.hasExchange || false
  const items = data.oldGoldExchange?.items || []

  const handleToggleExchange = (checked: boolean) => {
    onChange('oldGoldExchange', {
      hasExchange: checked,
      items: checked ? [{ ...defaultOldGoldItem }] : [],
    })
  }

  const handleAddItem = () => {
    onChange('oldGoldExchange', {
      ...data.oldGoldExchange,
      items: [...items, { ...defaultOldGoldItem }],
    })
  }

  const handleRemoveItem = (index: number) => {
    onChange('oldGoldExchange', {
      ...data.oldGoldExchange,
      items: items.filter((_, i) => i !== index),
    })
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    }
    onChange('oldGoldExchange', {
      ...data.oldGoldExchange,
      items: updatedItems,
    })
  }

  const calculateItemValue = (item: any) => {
    const netWeight = item.grossWeight - item.stoneWeight
    return netWeight * item.ratePerGram
  }

  const totalExchangeValue = items.reduce(
    (sum, item) => sum + calculateItemValue(item),
    0
  )

  return (
    <div className="space-y-4">
      {/* Toggle Exchange */}
      <div className="flex items-center justify-between rounded-lg border border-border-primary bg-bg-secondary p-4">
        <div className="flex items-center gap-3">
          <Coins className="h-5 w-5 text-accent" />
          <div>
            <Label
              htmlFor="hasExchange"
              className="text-base font-medium text-text-primary"
            >
              {t('sales.oldGoldExchange')}
            </Label>
            <p className="text-sm text-text-tertiary">
              {t('sales.oldGoldExchangeDescription')}
            </p>
          </div>
        </div>

        <Switch
          id="hasExchange"
          checked={hasExchange}
          onCheckedChange={handleToggleExchange}
          disabled={disabled}
        />
      </div>

      {/* Exchange Items */}
      {hasExchange && (
        <>
          {/* Add Button */}
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleAddItem}
              disabled={disabled}
              size="sm"
              variant="outline"
              className="border-border-primary bg-bg-secondary text-text-primary hover:bg-bg-tertiary"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('sales.addOldGoldItem')}
            </Button>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-border-primary bg-bg-secondary p-4"
              >
                {/* Item Header */}
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-medium text-text-primary">
                    {t('sales.oldGoldItem')} #{index + 1}
                  </h4>
                  <Button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={disabled || items.length === 1}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-status-error/10 text-status-error hover:text-status-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Item Fields */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Metal Type */}
                  <FormSelect
                    name={`oldGoldExchange.items[${index}].metalType`}
                    label={t('sales.metalType')}
                    value={item.metalType}
                    onChange={(_, val) =>
                      handleItemChange(index, 'metalType', val)
                    }
                    disabled={disabled}
                    options={[
                      { value: 'gold', label: t('sales.gold') },
                      { value: 'silver', label: t('sales.silver') },
                      { value: 'platinum', label: t('sales.platinum') },
                    ]}
                  />

                  {/* Purity */}
                  <FormSelect
                    name={`oldGoldExchange.items[${index}].purity`}
                    label={t('sales.purity')}
                    value={item.purity}
                    onChange={(_, val) =>
                      handleItemChange(index, 'purity', val)
                    }
                    disabled={disabled}
                    options={[
                      { value: '24K', label: '24K (99.9%)' },
                      { value: '22K', label: '22K (91.6%)' },
                      { value: '18K', label: '18K (75%)' },
                      { value: '14K', label: '14K (58.5%)' },
                    ]}
                  />

                  {/* Gross Weight */}
                  <FormInput
                    name={`oldGoldExchange.items[${index}].grossWeight`}
                    label={t('sales.grossWeight')}
                    type="number"
                    value={item.grossWeight}
                    onChange={(_, val) =>
                      handleItemChange(
                        index,
                        'grossWeight',
                        parseFloat(val as string) || 0
                      )
                    }
                    placeholder="0.00"
                    disabled={disabled}
                  />

                  {/* Stone Weight */}
                  <FormInput
                    name={`oldGoldExchange.items[${index}].stoneWeight`}
                    label={t('sales.stoneWeight')}
                    type="number"
                    value={item.stoneWeight}
                    onChange={(_, val) =>
                      handleItemChange(
                        index,
                        'stoneWeight',
                        parseFloat(val as string) || 0
                      )
                    }
                    placeholder="0.00"
                    disabled={disabled}
                  />

                  {/* Net Weight (Calculated) */}
                  <FormInput
                    name={`oldGoldExchange.items[${index}].netWeight`}
                    label={t('sales.netWeight')}
                    type="number"
                    value={item.grossWeight - item.stoneWeight}
                    onChange={() => {}}
                    disabled
                    className="bg-bg-tertiary"
                  />

                  {/* Rate Per Gram */}
                  <FormInput
                    name={`oldGoldExchange.items[${index}].ratePerGram`}
                    label={t('sales.ratePerGram')}
                    type="number"
                    value={item.ratePerGram}
                    onChange={(_, val) =>
                      handleItemChange(
                        index,
                        'ratePerGram',
                        parseFloat(val as string) || 0
                      )
                    }
                    placeholder="0"
                    disabled={disabled}
                  />

                  {/* Item Value (Calculated) */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <FormInput
                      name={`oldGoldExchange.items[${index}].value`}
                      label={t('sales.oldGoldValue')}
                      type="number"
                      value={calculateItemValue(item).toFixed(2)}
                      onChange={() => {}}
                      disabled
                      className="bg-bg-tertiary font-semibold text-accent"
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <FormTextarea
                      name={`oldGoldExchange.items[${index}].description`}
                      label={t('sales.description')}
                      value={item.description || ''}
                      onChange={(_, val) =>
                        handleItemChange(index, 'description', val)
                      }
                      placeholder={t('sales.describeOldGoldItem')}
                      disabled={disabled}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Exchange Value */}
          <div className="bg-accent/5 rounded-lg border border-accent p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-text-primary">
                {t('sales.totalExchangeValue')}
              </span>
              <span className="text-2xl font-bold text-accent">
                ₹{totalExchangeValue.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-sm text-text-tertiary">
              {t('sales.thisWillBeDeductedFromTotal')}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
