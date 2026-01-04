// FILE: src/components/products/ProductForm/sections/MetalWeightSection.tsx
// Step 2: Metal Details, Weight, and Making Charges

import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import type { FormSectionProps } from '../ProductForm.types'

export const MetalWeightSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const metalTypes = [
    { value: 'gold', label: t('product.metalTypes.gold') },
    { value: 'silver', label: t('product.metalTypes.silver') },
    { value: 'platinum', label: t('product.metalTypes.platinum') },
    { value: 'diamond', label: t('product.metalTypes.diamond') },
    { value: 'gemstone', label: t('product.metalTypes.gemstone') },
    { value: 'mixed', label: t('product.metalTypes.mixed') },
  ]

  const purityOptions = [
    { value: '24K', label: '24K' },
    { value: '22K', label: '22K' },
    { value: '18K', label: '18K' },
    { value: '14K', label: '14K' },
    { value: '916', label: '916' },
    { value: '999', label: '999' },
    { value: '925', label: '925' },
    { value: '850', label: '850' },
  ]

  const metalColors = [
    { value: 'yellow', label: t('product.metalColors.yellow') },
    { value: 'white', label: t('product.metalColors.white') },
    { value: 'rose', label: t('product.metalColors.rose') },
    { value: 'mixed', label: t('product.metalColors.mixed') },
  ]

  const weightUnits = [
    { value: 'gram', label: t('product.weightUnits.gram') },
    { value: 'kg', label: t('product.weightUnits.kg') },
    { value: 'tola', label: t('product.weightUnits.tola') },
    { value: 'ounce', label: t('product.weightUnits.ounce') },
    { value: 'carat', label: t('product.weightUnits.carat') },
  ]

  const makingChargeTypes = [
    { value: 'per_gram', label: t('product.makingChargeTypes.perGram') },
    { value: 'percentage', label: t('product.makingChargeTypes.percentage') },
    { value: 'flat', label: t('product.makingChargeTypes.flat') },
    { value: 'none', label: t('product.makingChargeTypes.none') },
  ]

  // Auto-calculate net weight
  useEffect(() => {
    const grossWeight = parseFloat(data.weight?.grossWeight as any) || 0
    const stoneWeight = parseFloat(data.weight?.stoneWeight as any) || 0
    const calculatedNetWeight = grossWeight - stoneWeight
    const currentNetWeight = parseFloat(data.weight?.netWeight as any) || 0

    if (
      calculatedNetWeight >= 0 &&
      Math.abs(calculatedNetWeight - currentNetWeight) > 0.001
    ) {
      onChange('weight', {
        grossWeight: data.weight?.grossWeight || 0,
        stoneWeight: data.weight?.stoneWeight || 0,
        netWeight: calculatedNetWeight,
        wastage: data.weight?.wastage || { percentage: 0, weight: 0 },
        unit: data.weight?.unit || 'gram',
      })
    }
  }, [data.weight?.grossWeight, data.weight?.stoneWeight])

  // Auto-calculate wastage weight
  useEffect(() => {
    const netWeight = parseFloat(data.weight?.netWeight as any) || 0
    const wastagePercentage =
      parseFloat(data.weight?.wastage?.percentage as any) || 0
    const calculatedWastageWeight = (netWeight * wastagePercentage) / 100
    const currentWastageWeight =
      parseFloat(data.weight?.wastage?.weight as any) || 0

    if (Math.abs(calculatedWastageWeight - currentWastageWeight) > 0.001) {
      onChange('weight', {
        grossWeight: data.weight?.grossWeight || 0,
        stoneWeight: data.weight?.stoneWeight || 0,
        netWeight: data.weight?.netWeight || 0,
        wastage: {
          percentage: wastagePercentage,
          weight: calculatedWastageWeight,
        },
        unit: data.weight?.unit || 'gram',
      })
    }
  }, [data.weight?.netWeight, data.weight?.wastage?.percentage])

  const handleMetalChange = (field: string, value: any) => {
    onChange('metal', {
      type: data.metal?.type || 'gold',
      purity: data.metal?.purity || '22K',
      color: data.metal?.color || 'yellow',
      ...data.metal,
      [field]: value,
    })
  }

  const handleWeightChange = (field: string, value: any) => {
    onChange('weight', {
      grossWeight: data.weight?.grossWeight || 0,
      stoneWeight: data.weight?.stoneWeight || 0,
      netWeight: data.weight?.netWeight || 0,
      wastage: data.weight?.wastage || { percentage: 0, weight: 0 },
      unit: data.weight?.unit || 'gram',
      ...data.weight,
      [field]: value,
    })
  }

  const handleWastageChange = (value: any) => {
    onChange('weight', {
      grossWeight: data.weight?.grossWeight || 0,
      stoneWeight: data.weight?.stoneWeight || 0,
      netWeight: data.weight?.netWeight || 0,
      unit: data.weight?.unit || 'gram',
      wastage: {
        percentage: parseFloat(value) || 0,
        weight: data.weight?.wastage?.weight || 0,
      },
    })
  }

  const handleMakingChargeChange = (field: string, value: any) => {
    onChange('makingCharges', {
      type: data.makingCharges?.type || 'per_gram',
      value: data.makingCharges?.value || 0,
      amount: data.makingCharges?.amount || 0,
      ...data.makingCharges,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      {/* Metal Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-text-primary">
          {t('product.metalDetails')}
        </h3>

        <FormSelect
          name="metal.type"
          label={t('product.metalType')}
          value={data.metal?.type || ''}
          onChange={(_, value) => handleMetalChange('type', value)}
          onBlur={onBlur}
          error={errors['metal.type']}
          placeholder={t('product.selectMetalType')}
          required={true}
          disabled={disabled}
          options={metalTypes}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSelect
            name="metal.purity"
            label={t('product.purity')}
            value={data.metal?.purity || ''}
            onChange={(_, value) => handleMetalChange('purity', value)}
            onBlur={onBlur}
            error={errors['metal.purity']}
            placeholder={t('product.selectPurity')}
            required={true}
            disabled={disabled}
            options={purityOptions}
          />

          <FormSelect
            name="metal.color"
            label={t('product.metalColor')}
            value={data.metal?.color || ''}
            onChange={(_, value) => handleMetalChange('color', value)}
            onBlur={onBlur}
            error={errors['metal.color']}
            placeholder={t('product.selectColor')}
            disabled={disabled}
            options={metalColors}
          />
        </div>
      </div>

      {/* Weight Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-text-primary">
          {t('product.weightDetails')}
        </h3>

        <FormSelect
          name="weight.unit"
          label={t('product.weightUnit')}
          value={data.weight?.unit || 'gram'}
          onChange={(_, value) => handleWeightChange('unit', value)}
          onBlur={onBlur}
          error={errors['weight.unit']}
          disabled={disabled}
          options={weightUnits}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            name="weight.grossWeight"
            label={t('product.grossWeight')}
            type="number"
            value={data.weight?.grossWeight || ''}
            onChange={(_, value) => handleWeightChange('grossWeight', value)}
            onBlur={onBlur}
            error={errors['weight.grossWeight']}
            placeholder="25.5"
            required={true}
            disabled={disabled}
          />

          <FormInput
            name="weight.stoneWeight"
            label={t('product.stoneWeight')}
            type="number"
            value={data.weight?.stoneWeight || ''}
            onChange={(_, value) => handleWeightChange('stoneWeight', value)}
            onBlur={onBlur}
            error={errors['weight.stoneWeight']}
            placeholder="0.5"
            disabled={disabled}
          />
        </div>

        {/* Net Weight (Read-only) */}
        <FormInput
          name="weight.netWeight"
          label={t('product.netWeight')}
          type="number"
          value={data.weight?.netWeight || 0}
          onChange={() => {}}
          disabled={true}
          className="bg-bg-tertiary"
        />

        {/* Wastage */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            name="weight.wastage.percentage"
            label={t('product.wastagePercentage')}
            type="number"
            value={data.weight?.wastage?.percentage || ''}
            onChange={(_, value) => handleWastageChange(value)}
            onBlur={onBlur}
            error={errors['weight.wastage.percentage']}
            placeholder="5.0"
            disabled={disabled}
          />

          <FormInput
            name="weight.wastage.weight"
            label={t('product.wastageWeight')}
            type="number"
            value={data.weight?.wastage?.weight || 0}
            onChange={() => {}}
            disabled={true}
            className="bg-bg-tertiary"
          />
        </div>
      </div>

      {/* Making Charges */}
      <div className="space-y-4">
        <h3 className="font-semibold text-text-primary">
          {t('product.makingCharges')}
        </h3>

        <FormSelect
          name="makingCharges.type"
          label={t('product.makingChargeType')}
          value={data.makingCharges?.type || 'per_gram'}
          onChange={(_, value) => handleMakingChargeChange('type', value)}
          onBlur={onBlur}
          error={errors['makingCharges.type']}
          disabled={disabled}
          options={makingChargeTypes}
        />

        <FormInput
          name="makingCharges.value"
          label={t('product.makingChargeValue')}
          type="number"
          value={data.makingCharges?.value || ''}
          onChange={(_, value) => handleMakingChargeChange('value', value)}
          onBlur={onBlur}
          error={errors['makingCharges.value']}
          placeholder="250"
          disabled={disabled}
        />
      </div>
    </div>
  )
}
