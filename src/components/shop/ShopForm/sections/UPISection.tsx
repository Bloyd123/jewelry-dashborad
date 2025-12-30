// ============================================================================
// FILE: src/components/shop/ShopForm/sections/UPISection.tsx
// UPI Details Section
// ============================================================================

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSwitch } from '@/components/forms/FormSwitch/FormSwitch'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Star } from 'lucide-react'
import type { FormSectionProps } from '../shopForm.types'
import type { UpiDetail } from '@/types'

export const UPISection = ({
  data,
  errors,
  onChange,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()
  const [upiDetails, setUpiDetails] = useState<UpiDetail[]>(
    data.upiDetails || []
  )

  const handleAddUPI = () => {
    const newUPI: UpiDetail = {
      upiId: '',
      name: '',
      isPrimary: upiDetails.length === 0,
      isActive: true,
    }
    const updated = [...upiDetails, newUPI]
    setUpiDetails(updated)
    onChange('upiDetails', updated)
  }

  const handleRemoveUPI = (index: number) => {
    const updated = upiDetails.filter((_, i) => i !== index)
    setUpiDetails(updated)
    onChange('upiDetails', updated)
  }

  const handleUPIChange = (index: number, field: string, value: any) => {
    const updated = upiDetails.map((upi, i) => {
      if (i === index) {
        // If setting isPrimary to true, set all others to false
        if (field === 'isPrimary' && value === true) {
          setUpiDetails(
            upiDetails.map((u, idx) => ({
              ...u,
              isPrimary: idx === index,
            }))
          )
          return { ...upi, isPrimary: true }
        }
        return { ...upi, [field]: value }
      }
      return upi
    })
    setUpiDetails(updated)
    onChange('upiDetails', updated)
  }

  return (
    <div className="space-y-4">
      {/* UPI Details List */}
      {upiDetails.map((upi, index) => (
        <div
          key={index}
          className="space-y-4 rounded-lg border border-border-primary bg-bg-tertiary p-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-2 font-medium text-text-primary">
              {t('shops.form.upiAccount')} {index + 1}
              {upi.isPrimary && (
                <Star className="h-4 w-4 fill-accent text-accent" />
              )}
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveUPI(index)}
              disabled={disabled}
              className="text-status-error hover:bg-status-error/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* UPI ID */}
          <FormInput
            name={`upiDetails.${index}.upiId`}
            label={t('shops.form.upiId')}
            value={upi.upiId}
            onChange={(_, value) => handleUPIChange(index, 'upiId', value)}
            error={errors[`upiDetails.${index}.upiId`]}
            placeholder="yourshop@upi"
            required
            disabled={disabled}
          />

          {/* UPI Name */}
          <FormInput
            name={`upiDetails.${index}.name`}
            label={t('shops.form.upiName')}
            value={upi.name || ''}
            onChange={(_, value) => handleUPIChange(index, 'name', value)}
            error={errors[`upiDetails.${index}.name`]}
            placeholder={t('shops.form.upiNamePlaceholder')}
            disabled={disabled}
          />

          {/* Primary Toggle */}
          <FormSwitch
            name={`upiDetails.${index}.isPrimary`}
            label={t('shops.form.primaryUPI')}
            description={t('shops.form.primaryUPIDescription')}
            checked={upi.isPrimary || false}
            onChange={(_, checked) =>
              handleUPIChange(index, 'isPrimary', checked)
            }
            disabled={disabled}
          />
        </div>
      ))}

      {/* Add UPI Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddUPI}
        disabled={disabled}
        className="w-full border-border-primary text-text-primary hover:bg-bg-tertiary"
      >
        <Plus className="mr-2 h-4 w-4" />
        {t('shops.form.addUPIAccount')}
      </Button>
    </div>
  )
}