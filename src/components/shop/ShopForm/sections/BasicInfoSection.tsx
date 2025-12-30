// ============================================================================
// FILE: src/components/shop/ShopForm/sections/BasicInfoSection.tsx
// Basic Information Section
// ============================================================================

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import type { FormSectionProps } from '../shopForm.types'
import { ShopType, ShopCategory } from '@/types'

export const BasicInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const shopTypeOptions = [
    { value: ShopType.RETAIL, label: t('shops.types.retail') },
    { value: ShopType.WHOLESALE, label: t('shops.types.wholesale') },
    { value: ShopType.MANUFACTURING, label: t('shops.types.manufacturing') },
    { value: ShopType.SHOWROOM, label: t('shops.types.showroom') },
    { value: ShopType.WORKSHOP, label: t('shops.types.workshop') },
    { value: ShopType.WAREHOUSE, label: t('shops.types.warehouse') },
    { value: ShopType.ONLINE, label: t('shops.types.online') },
  ]

  const categoryOptions = [
    { value: ShopCategory.JEWELRY, label: t('shops.categories.jewelry') },
    { value: ShopCategory.GOLD, label: t('shops.categories.gold') },
    { value: ShopCategory.SILVER, label: t('shops.categories.silver') },
    { value: ShopCategory.DIAMOND, label: t('shops.categories.diamond') },
    { value: ShopCategory.GEMSTONE, label: t('shops.categories.gemstone') },
    { value: ShopCategory.PEARLS, label: t('shops.categories.pearls') },
    { value: ShopCategory.PLATINUM, label: t('shops.categories.platinum') },
    { value: ShopCategory.MIXED, label: t('shops.categories.mixed') },
  ]

  return (
    <div className="space-y-4">
      {/* Shop Name */}
      <FormInput
        name="name"
        label={t('shops.form.name')}
        value={data.name || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.name}
        placeholder={t('shops.form.namePlaceholder')}
        required
        disabled={disabled}
        maxLength={100}
      />

      {/* Display Name */}
      <FormInput
        name="displayName"
        label={t('shops.form.displayName')}
        value={data.displayName || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.displayName}
        placeholder={t('shops.form.displayNamePlaceholder')}
        disabled={disabled}
        maxLength={100}
      />

      {/* Shop Type & Category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormSelect
          name="shopType"
          label={t('shops.form.shopType')}
          value={data.shopType || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.shopType}
          placeholder={t('shops.form.shopTypePlaceholder')}
          options={shopTypeOptions}
          disabled={disabled}
        />

        <FormSelect
          name="category"
          label={t('shops.form.category')}
          value={data.category || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.category}
          placeholder={t('shops.form.categoryPlaceholder')}
          options={categoryOptions}
          disabled={disabled}
        />
      </div>

      {/* Established Year */}
      <FormInput
        name="establishedYear"
        label={t('shops.form.establishedYear')}
        type="number"
        value={data.establishedYear || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.establishedYear}
        placeholder="1990"
        disabled={disabled}
      />
    </div>
  )
}
