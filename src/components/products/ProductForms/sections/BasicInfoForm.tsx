// FILE: src/components/products/ProductForm/sections/BasicInfoSection.tsx
// Step 1: Basic Product Information

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormTextarea } from '@/components/forms/FormTextarea/FormTextarea'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { dummyCategories } from '@/pages/product/mock.data'
import type { FormSectionProps } from '../ProductForm.types'

export const BasicInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  // Get parent categories (no parentId)
  const parentCategories = dummyCategories
    .filter(cat => !cat.parentId)
    .map(cat => ({ value: cat._id, label: cat.name.default }))

  // Get subcategories based on selected category
  const subCategories = data.categoryId
    ? dummyCategories
        .filter(cat => cat.parentId === data.categoryId)
        .map(cat => ({ value: cat._id, label: cat.name.default }))
    : []

  const productTypes = [
    { value: 'ready_made', label: t('product.productTypes.readyMade') },
    { value: 'custom_made', label: t('product.productTypes.customMade') },
    { value: 'on_order', label: t('product.productTypes.onOrder') },
    { value: 'repair', label: t('product.productTypes.repair') },
    { value: 'exchange', label: t('product.productTypes.exchange') },
  ]

  const genderOptions = [
    { value: 'unisex', label: t('product.gender.unisex') },
    { value: 'male', label: t('product.gender.male') },
    { value: 'female', label: t('product.gender.female') },
    { value: 'kids', label: t('product.gender.kids') },
  ]

  const handleRegenerateCode = () => {
    const newCode = `PRD${Math.floor(100000 + Math.random() * 900000)}`
    onChange('productCode', newCode)
  }

  return (
    <div className="space-y-6">
      {/* Product Code */}
      <div className="flex gap-2">
        <FormInput
          name="productCode"
          label={t('product.productCode')}
          value={data.productCode || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.productCode}
          placeholder="PRD000123"
          disabled={true}
          className="flex-1"
        />
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRegenerateCode}
            disabled={disabled}
            className="h-10 w-10"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product Name */}
      <FormInput
        name="name"
        label={t('product.productName')}
        value={data.name || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.name}
        placeholder={t('product.productNamePlaceholder')}
        required={true}
        disabled={disabled}
        maxLength={200}
      />

      {/* Barcode & SKU */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          name="barcode"
          label={t('product.barcode')}
          value={data.barcode || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.barcode}
          placeholder="1234567890123"
          disabled={disabled}
        />

        <FormInput
          name="sku"
          label={t('product.sku')}
          value={data.sku || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.sku}
          placeholder="SKU-001"
          disabled={disabled}
        />
      </div>

      {/* HUID */}
      <FormInput
        name="huid"
        label={t('product.huid')}
        value={data.huid || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.huid}
        placeholder="HUID123456789"
        disabled={disabled}
      />

      {/* Category & SubCategory */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormSelect
          name="categoryId"
          label={t('product.categorytext')}
          value={data.categoryId || ''}
          onChange={(name, value) => {
            onChange(name, value)
            // Clear subcategory when category changes
            onChange('subCategoryId', '')
          }}
          onBlur={onBlur}
          error={errors.categoryId}
          placeholder={t('product.selectCategory')}
          required={true}
          disabled={disabled}
          options={parentCategories}
        />

        <FormSelect
          name="subCategoryId"
          label={t('product.subCategory')}
          value={data.subCategoryId || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.subCategoryId}
          placeholder={t('product.selectSubCategory')}
          disabled={disabled || !data.categoryId}
          options={subCategories}
        />
      </div>

      {/* Product Type */}
      <FormSelect
        name="productType"
        label={t('product.productTypes')}
        value={data.productType || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.productType}
        placeholder={t('product.selectProductTypes')}
        required={true}
        disabled={disabled}
        options={productTypes}
      />

      {/* Gender */}
      <FormSelect
        name="gender"
        label={t('product.gender.label')}
        value={data.gender || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.gender}
        placeholder={t('product.selectGender')}
        required={true}
        disabled={disabled}
        options={genderOptions}
      />

      {/* Description */}
      <FormTextarea
        name="description"
        label={t('product.description')}
        value={data.description || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.description}
        placeholder={t('product.descriptionPlaceholder')}
        disabled={disabled}
        rows={4}
        maxLength={2000}
        showCharCount={true}
      />
    </div>
  )
}
