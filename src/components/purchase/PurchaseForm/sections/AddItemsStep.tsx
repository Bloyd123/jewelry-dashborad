// ============================================================================
// FILE: src/components/purchase/PurchaseForm/sections/AddItemsSection.tsx
// Add Items Section
// ============================================================================

import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { Plus, Trash2 } from 'lucide-react'
import type { FormSectionProps } from '../PurchaseForm.types'
import type { IPurchaseItem, MetalType } from '@/types/purchase.types'
import { FormTextarea } from '@/components/forms/FormTextarea'
import { Label } from '@/components/ui/label'

export const AddItemsSection = ({
  data,
  errors,
  onChange,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()
  const [currentItem, setCurrentItem] = useState<Partial<IPurchaseItem>>({
    productName: '',
    metalType: 'gold',
    purity: '',
    grossWeight: 0,
    stoneWeight: 0,
    netWeight: 0,
    quantity: 1,
    ratePerGram: 0,
    makingCharges: 0,
    stoneCharges: 0,
    otherCharges: 0,
    itemTotal: 0,
    isHallmarked: false,
  })

  const metalTypeOptions = [
    { value: 'gold', label: t('purchase.metals.gold') },
    { value: 'silver', label: t('purchase.metals.silver') },
    { value: 'platinum', label: t('purchase.metals.platinum') },
    { value: 'diamond', label: t('purchase.metals.diamond') },
    { value: 'mixed', label: t('purchase.metals.mixed') },
  ]

  const calculateItemTotal = (item: Partial<IPurchaseItem>) => {
    const base = (item.netWeight || 0) * (item.ratePerGram || 0)
    const total =
      base +
      (item.makingCharges || 0) +
      (item.stoneCharges || 0) +
      (item.otherCharges || 0)
    return total
  }

  const handleItemChange = (field: string, value: any) => {
    const updated = { ...currentItem, [field]: value }

    if (field === 'grossWeight' || field === 'stoneWeight') {
      updated.netWeight =
        (updated.grossWeight || 0) - (updated.stoneWeight || 0)
    }

    updated.itemTotal = calculateItemTotal(updated)
    setCurrentItem(updated)
  }

  const addItem = () => {
    const items = [...(data.items || []), currentItem as IPurchaseItem]
    onChange('items', items)
    setCurrentItem({
      productName: '',
      metalType: 'gold',
      purity: '',
      grossWeight: 0,
      stoneWeight: 0,
      netWeight: 0,
      quantity: 1,
      ratePerGram: 0,
      makingCharges: 0,
      stoneCharges: 0,
      otherCharges: 0,
      itemTotal: 0,
      isHallmarked: false,
    })
  }

  const removeItem = (index: number) => {
    const items = (data.items || []).filter((_, i) => i !== index)
    onChange('items', items)
  }

  return (
    <div className="space-y-4">
      {/* Current Item Form */}
      <div className="space-y-3 rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <h3 className="text-sm font-medium text-text-primary">
          {t('purchase.addNewItem')}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            name="productName"
            label={t('purchase.productName')}
            value={currentItem.productName || ''}
            onChange={handleItemChange}
            required
            disabled={disabled}
          />

          <FormSelect
            name="metalType"
            label={t('purchase.metalType')}
            value={currentItem.metalType || 'gold'}
            onChange={handleItemChange}
            options={metalTypeOptions}
            required
            disabled={disabled}
          />

          <FormInput
            name="purity"
            label={t('purchase.purity')}
            value={currentItem.purity || ''}
            onChange={handleItemChange}
            required
            disabled={disabled}
          />

          <FormInput
            name="grossWeight"
            label={t('purchase.grossWeight')}
            type="number"
            value={currentItem.grossWeight || 0}
            onChange={handleItemChange}
            required
            disabled={disabled}
          />

          <FormInput
            name="stoneWeight"
            label={t('purchase.stoneWeight')}
            type="number"
            value={currentItem.stoneWeight || 0}
            onChange={handleItemChange}
            disabled={disabled}
          />

          <FormInput
            name="netWeight"
            label={t('purchase.netWeight')}
            type="number"
            value={currentItem.netWeight || 0}
            disabled
              onChange={() => {}} 
          />

          <FormInput
            name="ratePerGram"
            label={t('purchase.ratePerGram')}
            type="number"
            value={currentItem.ratePerGram || 0}
            onChange={handleItemChange}
            required
            disabled={disabled}
          />

          <FormInput
            name="makingCharges"
            label={t('purchase.makingCharges')}
            type="number"
            value={currentItem.makingCharges || 0}
            onChange={handleItemChange}
            disabled={disabled}
          />

          <FormInput
            name="stoneCharges"
            label={t('purchase.stoneCharges')}
            type="number"
            value={currentItem.stoneCharges || 0}
            onChange={handleItemChange}
            disabled={disabled}
          />

      <FormInput
            name="otherCharges"
            label={t('purchase.otherCharges')}
            type="number"
            value={currentItem.otherCharges || 0}
            onChange={handleItemChange}
            disabled={disabled}
          />

          <FormInput
            name="huid"
            label={t('purchase.huid')}
            value={currentItem.huid || ''}
            onChange={handleItemChange}
            placeholder="HUID123456"
            disabled={disabled}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isHallmarked"
              checked={currentItem.isHallmarked || false}
              onChange={e => handleItemChange('isHallmarked', e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border-border-primary bg-bg-secondary text-accent focus:ring-accent"
            />
            <Label htmlFor="isHallmarked" className="text-text-primary">
              {t('purchase.isHallmarked')}
            </Label>
          </div>
        </div>

        <FormTextarea
          name="description"
          label={t('purchase.description')}
          value={currentItem.description || ''}
          onChange={handleItemChange}
          rows={2}
          placeholder={t('purchase.descriptionPlaceholder')}
          disabled={disabled}
        />


        <div className="flex items-center justify-between rounded border border-accent/20 bg-accent/10 p-3">
          <span className="text-sm font-medium text-text-primary">
            {t('purchase.itemTotal')}:
          </span>
          <span className="text-lg font-bold text-accent">
            ₹{currentItem.itemTotal?.toFixed(2) || '0.00'}
          </span>
        </div>

        <Button
          type="button"
          onClick={addItem}
          disabled={!currentItem.productName || disabled}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('purchase.addItem')}
        </Button>
      </div>

      {/* Items List */}
      {data.items && data.items.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-text-primary">
            {t('purchase.addedItems')} ({data.items.length})
          </h3>

          {data.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-border-primary bg-bg-secondary p-3"
            >
              <div className="flex-1">
                <p className="font-medium text-text-primary">
                  {item.productName}
                </p>
                <p className="text-sm text-text-secondary">
                  {item.metalType} • {item.purity} • {item.netWeight}g
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-accent">
                  ₹{item.itemTotal.toFixed(2)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={disabled}
                >
                  <Trash2 className="h-4 w-4 text-status-error" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {errors.items && (
        <p className="text-sm text-status-error">{errors.items}</p>
      )}
    </div>
  )
}

