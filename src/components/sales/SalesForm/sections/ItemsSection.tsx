// 
// FILE: src/components/sales/SaleForm/sections/ItemsSection.tsx
// Sale Items Section
// 

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Package } from 'lucide-react'
import type { FormSectionProps } from '../SaleForm.types'
import { defaultSaleItem } from '../SaleForm.types'

export const ItemsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const items = data.items || []

  const handleAddItem = () => {
    onChange('items', [...items, { ...defaultSaleItem }])
  }

  const handleRemoveItem = (index: number) => {
    onChange(
      'items',
      items.filter((_, i) => i !== index)
    )
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    }
    onChange('items', updatedItems)
  }

  const calculateItemTotal = (item: any) => {
    const netWeight = item.grossWeight - item.stoneWeight
    const metalValue = netWeight * item.ratePerGram
    const makingValue =
      item.makingChargesType === 'per_gram'
        ? item.makingCharges * netWeight
        : item.makingCharges

    const subtotal =
      metalValue + item.stoneValue + makingValue + item.otherCharges

    const discountAmount =
      item.discount.type === 'percentage'
        ? (subtotal * item.discount.value) / 100
        : item.discount.value

    const taxable = subtotal - discountAmount
    const gst = (taxable * item.gstPercentage) / 100

    return taxable + gst
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold text-text-primary">
            {t('sales.itemstext')}
          </h3>
          {items.length > 0 && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-white">
              {items.length}
            </span>
          )}
        </div>

        <Button
          type="button"
          onClick={handleAddItem}
          disabled={disabled}
          size="sm"
          className="hover:bg-accent/90 bg-accent text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('sales.addItem')}
        </Button>
      </div>

      {/* Error */}
      {errors.items && (
        <div className="bg-status-error/10 border-status-error/20 rounded-md border p-3 text-sm text-status-error">
          {errors.items}
        </div>
      )}

      {/* Items List */}
      {items.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-border-primary bg-bg-tertiary p-8 text-center">
          <Package className="mx-auto mb-2 h-12 w-12 text-text-tertiary" />
          <p className="text-text-tertiary">{t('sales.noItemsAdded')}</p>
          <Button
            type="button"
            onClick={handleAddItem}
            disabled={disabled}
            size="sm"
            className="hover:bg-accent/90 mt-4 bg-accent text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('sales.addFirstItem')}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-border-primary bg-bg-secondary p-4"
            >
              {/* Item Header */}
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-medium text-text-primary">
                  {t('sales.item')} #{index + 1}
                </h4>
                <Button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  disabled={disabled}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-status-error/10 text-status-error hover:text-status-error"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Item Fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Product Name */}
                <FormInput
                  name={`items[${index}].productName`}
                  label={t('sales.productName')}
                  value={item.productName}
                  onChange={(_, val) =>
                    handleItemChange(index, 'productName', val)
                  }
                  placeholder={t('sales.enterProductName')}
                  required
                  disabled={disabled}
                />

                {/* Metal Type */}
                <FormSelect
                  name={`items[${index}].metalType`}
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
                    { value: 'diamond', label: t('sales.diamond') },
                  ]}
                />

                {/* Purity */}
                <FormSelect
                  name={`items[${index}].purity`}
                  label={t('sales.purity')}
                  value={item.purity}
                  onChange={(_, val) => handleItemChange(index, 'purity', val)}
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
                  name={`items[${index}].grossWeight`}
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
                  name={`items[${index}].stoneWeight`}
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
                  name={`items[${index}].netWeight`}
                  label={t('sales.netWeight')}
                  type="number"
                  value={item.grossWeight - item.stoneWeight}
                  onChange={() => {}}
                  disabled
                  className="bg-bg-tertiary"
                />

                {/* Rate Per Gram */}
                <FormInput
                  name={`items[${index}].ratePerGram`}
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

                {/* Stone Value */}
                <FormInput
                  name={`items[${index}].stoneValue`}
                  label={t('sales.stoneValue')}
                  type="number"
                  value={item.stoneValue}
                  onChange={(_, val) =>
                    handleItemChange(
                      index,
                      'stoneValue',
                      parseFloat(val as string) || 0
                    )
                  }
                  placeholder="0"
                  disabled={disabled}
                />

                {/* Making Charges */}
                <FormInput
                  name={`items[${index}].makingCharges`}
                  label={t('sales.makingCharges')}
                  type="number"
                  value={item.makingCharges}
                  onChange={(_, val) =>
                    handleItemChange(
                      index,
                      'makingCharges',
                      parseFloat(val as string) || 0
                    )
                  }
                  placeholder="0"
                  disabled={disabled}
                />

                {/* Quantity */}
                <FormInput
                  name={`items[${index}].quantity`}
                  label={t('sales.quantity')}
                  type="number"
                  value={item.quantity}
                  onChange={(_, val) =>
                    handleItemChange(
                      index,
                      'quantity',
                      parseInt(val as string) || 1
                    )
                  }
                  placeholder="1"
                  disabled={disabled}
                />

                {/* GST % */}
                <FormSelect
                  name={`items[${index}].gstPercentage`}
                  label={t('sales.gstPercentage')}
                  value={item.gstPercentage.toString()}
                  onChange={(_, val) =>
                    handleItemChange(index, 'gstPercentage', parseFloat(val))
                  }
                  disabled={disabled}
                  options={[
                    { value: '0', label: '0%' },
                    { value: '3', label: '3%' },
                    { value: '5', label: '5%' },
                    { value: '12', label: '12%' },
                    { value: '18', label: '18%' },
                  ]}
                />

                {/* Item Total (Calculated) */}
                <FormInput
                  name={`items[${index}].itemTotal`}
                  label={t('sales.itemTotal')}
                  type="number"
                  value={calculateItemTotal(item).toFixed(2)}
                  onChange={() => {}}
                  disabled
                  className="bg-bg-tertiary font-semibold"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {items.length > 0 && (
        <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">{t('sales.totalItems')}</span>
            <span className="text-lg font-semibold text-text-primary">
              {items.length}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-text-secondary">{t('sales.subtotal')}</span>
            <span className="text-xl font-bold text-accent">
              ₹
              {items
                .reduce((sum, item) => sum + calculateItemTotal(item), 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
