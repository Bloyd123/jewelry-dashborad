// FILE: src/components/products/ProductForm/sections/StockDetailsSection.tsx
// Step 5: Stock, Images, Hallmarking & Other Details

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormTextarea } from '@/components/forms/FormTextarea/FormTextarea'
import { Button } from '@/components/ui/button'
import { Upload, X, Star } from 'lucide-react'
import type { FormSectionProps } from '../ProductForm.types'

export const StockDetailsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()
  const [mockImages, setMockImages] = useState<
    Array<{ url: string; isPrimary: boolean }>
  >([])

  const stockUnits = [
    { value: 'piece', label: t('product.stockUnits.piece') },
    { value: 'pair', label: t('product.stockUnits.pair') },
    { value: 'set', label: t('product.stockUnits.set') },
    { value: 'gram', label: t('product.stockUnits.gram') },
    { value: 'kg', label: t('product.stockUnits.kg') },
  ]

  const handleStockChange = (field: string, value: any) => {
    onChange('stock', {
      ...data.stock,
      [field]: value,
    })
  }

  const handleHallmarkingChange = (field: string, value: any) => {
    onChange('hallmarking', {
      ...data.hallmarking,
      [field]: value,
    })
  }

  const handleMockImageUpload = () => {
    const mockImageUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400`
    const newImage = { url: mockImageUrl, isPrimary: mockImages.length === 0 }
    setMockImages([...mockImages, newImage])

    onChange('images', [...(data.images || []), newImage])
  }

  const handleRemoveImage = (index: number) => {
    const newImages = mockImages.filter((_, i) => i !== index)
    setMockImages(newImages)
    onChange('images', newImages)
  }

  const handleSetPrimary = (index: number) => {
    const newImages = mockImages.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }))
    setMockImages(newImages)
    onChange('images', newImages)
  }

  return (
    <div className="space-y-6">
      {/* Stock Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-text-primary">
          {t('product.stockDetails')}
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            name="stock.quantity"
            label={t('product.initialStock')}
            type="number"
            value={data.stock?.quantity || ''}
            onChange={(_, value) => handleStockChange('quantity', value)}
            onBlur={onBlur}
            error={errors['stock.quantity']}
            placeholder="3"
            required={true}
            disabled={disabled}
          />

          <FormSelect
            name="stock.unit"
            label={t('product.stockUnit')}
            value={data.stock?.unit || 'piece'}
            onChange={(_, value) => handleStockChange('unit', value)}
            disabled={disabled}
            options={stockUnits}
          />
        </div>

        {/* Stock Levels */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput
            name="stock.minStockLevel"
            label={t('product.minStockLevel')}
            type="number"
            value={data.stock?.minStockLevel || ''}
            onChange={(_, value) => handleStockChange('minStockLevel', value)}
            placeholder="1"
            disabled={disabled}
          />

          <FormInput
            name="stock.reorderLevel"
            label={t('product.reorderLevel')}
            type="number"
            value={data.stock?.reorderLevel || ''}
            onChange={(_, value) => handleStockChange('reorderLevel', value)}
            placeholder="2"
            disabled={disabled}
          />

          <FormInput
            name="stock.maxStockLevel"
            label={t('product.maxStockLevel')}
            type="number"
            value={data.stock?.maxStockLevel || ''}
            onChange={(_, value) => handleStockChange('maxStockLevel', value)}
            placeholder="10"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Product Images */}
      <div className="space-y-4">
        <h3 className="font-semibold text-text-primary">
          {t('product.productImages')}
        </h3>

        <Button
          type="button"
          variant="outline"
          onClick={handleMockImageUpload}
          disabled={disabled || mockImages.length >= 10}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          {t('product.uploadImage')} ({mockImages.length}/10)
        </Button>

        {mockImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {mockImages.map((img, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-md border border-border-primary bg-bg-tertiary"
              >
                <div className="aspect-square bg-bg-tertiary">
                  <div className="flex h-full items-center justify-center text-text-tertiary">
                    <Upload className="h-8 w-8" />
                  </div>
                </div>

                {img.isPrimary && (
                  <div className="absolute left-2 top-2 rounded bg-accent px-2 py-1 text-xs font-medium text-white">
                    <Star className="inline h-3 w-3" /> {t('product.primary')}
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  {!img.isPrimary && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSetPrimary(index)}
                      disabled={disabled}
                    >
                      {t('product.setPrimary')}
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveImage(index)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hallmarking Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isHallmarked"
            checked={data.hallmarking?.isHallmarked || false}
            onChange={e =>
              handleHallmarkingChange('isHallmarked', e.target.checked)
            }
            disabled={disabled}
            className="h-4 w-4 accent-accent"
          />
          <label
            htmlFor="isHallmarked"
            className="font-semibold text-text-primary"
          >
            {t('product.isHallmarked')}
          </label>
        </div>

        {data.hallmarking?.isHallmarked && (
          <div className="space-y-4 rounded-md border border-border-primary bg-bg-tertiary p-4">
            <FormInput
              name="hallmarking.huid"
              label={t('product.huid')}
              value={data.hallmarking?.huid || ''}
              onChange={(_, value) => handleHallmarkingChange('huid', value)}
              placeholder="HUID123456789"
              disabled={disabled}
            />

            <FormInput
              name="hallmarking.hallmarkNumber"
              label={t('product.hallmarkNumber')}
              value={data.hallmarking?.hallmarkNumber || ''}
              onChange={(_, value) =>
                handleHallmarkingChange('hallmarkNumber', value)
              }
              placeholder="HM-2024-123456"
              disabled={disabled}
            />

            <FormInput
              name="hallmarking.hallmarkingCenter"
              label={t('product.hallmarkingCenter')}
              value={data.hallmarking?.hallmarkingCenter || ''}
              onChange={(_, value) =>
                handleHallmarkingChange('hallmarkingCenter', value)
              }
              placeholder="BIS Hallmarking Center, Mumbai"
              disabled={disabled}
            />

            <FormInput
              name="hallmarking.bisLicenseNumber"
              label={t('product.bisLicenseNumber')}
              value={data.hallmarking?.bisLicenseNumber || ''}
              onChange={(_, value) =>
                handleHallmarkingChange('bisLicenseNumber', value)
              }
              placeholder="BIS-LIC-12345"
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {/* Product Status Flags */}
      <div className="space-y-4">
        <h3 className="font-semibold text-text-primary">
          {t('product.productStatus')}
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.isActive !== false}
              onChange={e => onChange('isActive', e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 accent-accent"
            />
            <span className="text-sm text-text-primary">
              {t('product.isActive')}
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.isFeatured || false}
              onChange={e => onChange('isFeatured', e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 accent-accent"
            />
            <span className="text-sm text-text-primary">
              {t('product.isFeatured')}
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.isNewArrival || false}
              onChange={e => onChange('isNewArrival', e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 accent-accent"
            />
            <span className="text-sm text-text-primary">
              {t('product.isNewArrival')}
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.isBestseller || false}
              onChange={e => onChange('isBestseller', e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 accent-accent"
            />
            <span className="text-sm text-text-primary">
              {t('product.isBestseller')}
            </span>
          </label>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="font-semibold text-text-primary">
          {t('product.notes')}
        </h3>

        <FormTextarea
          name="notes"
          label={t('product.publicNotes')}
          value={data.notes || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.notes}
          placeholder={t('product.publicNotesPlaceholder')}
          disabled={disabled}
          rows={3}
          maxLength={500}
          showCharCount={true}
        />

        <FormTextarea
          name="internalNotes"
          label={t('product.internalNotes')}
          value={data.internalNotes || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.internalNotes}
          placeholder={t('product.internalNotesPlaceholder')}
          disabled={disabled}
          rows={3}
          maxLength={500}
          showCharCount={true}
        />
      </div>

      {/* Tags */}
      <FormInput
        name="tags"
        label={t('product.tags')}
        value={
          Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || ''
        }
        onChange={(name, value) => {
          const tagsArray =
            typeof value === 'string' ? value.split(',').map(t => t.trim()) : []
          onChange(name, tagsArray)
        }}
        onBlur={onBlur}
        error={errors.tags}
        placeholder="wedding, gold, traditional"
        disabled={disabled}
      />
    </div>
  )
}
