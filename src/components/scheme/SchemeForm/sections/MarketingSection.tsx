// FILE: src/components/scheme/SchemeForm/sections/MarketingSection.tsx

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput'
import { Button }    from '@/components/ui/button'
import { Input }     from '@/components/ui/input'
import { X, Plus }   from 'lucide-react'
import type { FormSectionProps } from '../SchemeForm.types'

export const MarketingSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t }              = useTranslation()
  const [highlight, setHighlight] = useState('')

  const handleMarketingChange = (field: string, value: any) => {
    onChange('marketing', {
      ...data.marketing,
      [field]: value,
    })
  }

  const handleAddHighlight = () => {
    if (!highlight.trim()) return
    const current = data.marketing?.highlights || []
    if (current.includes(highlight.trim())) {
      setHighlight('')
      return
    }
    handleMarketingChange('highlights', [...current, highlight.trim()])
    setHighlight('')
  }

  const handleRemoveHighlight = (item: string) => {
    const current = data.marketing?.highlights || []
    handleMarketingChange('highlights', current.filter(h => h !== item))
  }

  const isFeatured      = data.marketing?.isFeatured || false
  const displayOrder    = data.marketing?.displayOrder ?? 0

  return (
    <div className="space-y-4">
      {/* Featured Toggle */}
      <div className="flex items-center gap-3">
<Button
  type="button"
  variant="ghost"
  size="icon"
  onClick={() => handleMarketingChange('isFeatured', !isFeatured)}
  disabled={disabled}
  className={`
    relative h-6 w-11 rounded-full transition-colors p-0
    ${isFeatured ? 'bg-accent hover:bg-accent/90' : 'bg-bg-tertiary border border-border-primary hover:bg-bg-tertiary'}
  `}
>
  <span
    className={`
      absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform
      ${isFeatured ? 'translate-x-5' : 'translate-x-0.5'}
    `}
  />
</Button>
        <div>
          <label className="text-sm font-medium text-text-primary">
            {t('scheme.marketing.isFeatured')}
          </label>
          <p className="text-xs text-text-tertiary">
            {t('scheme.marketing.isFeaturedDesc')}
          </p>
        </div>
      </div>

      {/* Display Order */}
      <FormInput
        name="marketing.displayOrder"
        label={t('scheme.marketing.displayOrder')}
        type="number"
        value={displayOrder}
        onChange={(_, value) =>
          handleMarketingChange('displayOrder', Number(value))
        }
        onBlur={() => onBlur?.('marketing.displayOrder')}
        error={errors['marketing.displayOrder']}
        placeholder="0"
        disabled={disabled}
        min={0}
      />

      {/* Image URL */}
      <FormInput
        name="marketing.imageUrl"
        label={t('scheme.marketing.imageUrl')}
        value={data.marketing?.imageUrl || ''}
        onChange={(_, value) => handleMarketingChange('imageUrl', value)}
        onBlur={() => onBlur?.('marketing.imageUrl')}
        error={errors['marketing.imageUrl']}
        placeholder="https://..."
        disabled={disabled}
      />

      {/* Highlights */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          {t('scheme.marketing.highlights')}
        </label>
        <div className="mb-3 flex gap-2">
          <Input
            value={highlight}
            onChange={e => setHighlight(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
            placeholder={t('scheme.marketing.highlightPlaceholder')}
            disabled={disabled}
            className="flex-1 border-border-primary bg-bg-secondary text-text-primary"
          />
          <Button
            type="button"
            onClick={handleAddHighlight}
            disabled={!highlight.trim() || disabled}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {(data.marketing?.highlights || []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(data.marketing?.highlights || []).map((item, index) => (
              <span
                key={index}
                className="bg-accent/10 border-accent/20 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm text-accent"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(item)}
                  disabled={disabled}
                  className="hover:bg-accent/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}