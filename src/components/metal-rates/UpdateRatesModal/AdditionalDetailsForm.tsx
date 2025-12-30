// ============================================================================
// FILE: src/components/features/MetalRates/AdditionalDetailsForm.tsx
// Additional Details Form - Section 4 of Update Metal Rates Modal
// ============================================================================

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { WeightUnit, Currency, RateSource } from '@/types/metalrate.types'

// ============================================================================
// TYPES
// ============================================================================

interface AdditionalDetailsFormData {
  weightUnit: WeightUnit
  currency: Currency
  rateSource: RateSource
  notes: string
  internalNotes: string
}

interface AdditionalDetailsFormProps {
  initialData?: Partial<AdditionalDetailsFormData>
  onChange?: (data: AdditionalDetailsFormData) => void
  className?: string
}

// ============================================================================
// SELECT COMPONENT
// ============================================================================

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  className,
}) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className={cn(
      'flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors',
      'border-border-primary bg-bg-secondary text-text-primary',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
  >
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
)

// ============================================================================
// TEXTAREA COMPONENT
// ============================================================================

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => (
  <textarea
    className={cn(
      'flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm transition-colors',
      'border-border-primary bg-bg-secondary text-text-primary placeholder:text-text-tertiary',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'resize-none',
      className
    )}
    {...props}
  />
)

// ============================================================================
// COMPONENT
// ============================================================================

export const AdditionalDetailsForm: React.FC<AdditionalDetailsFormProps> = ({
  initialData,
  onChange,
  className,
}) => {
  const { t } = useTranslation()

  // State for additional details
  const [details, setDetails] = useState<AdditionalDetailsFormData>({
    weightUnit: initialData?.weightUnit || 'gram',
    currency: initialData?.currency || 'INR',
    rateSource: initialData?.rateSource || 'manual',
    notes:
      initialData?.notes ||
      'Rates updated based on international market prices',
    internalNotes:
      initialData?.internalNotes ||
      'Market volatility high due to festival season',
  })

  // Handle field change
  const handleFieldChange = (
    field: keyof AdditionalDetailsFormData,
    value: string
  ) => {
    const updatedDetails = {
      ...details,
      [field]: value,
    }

    setDetails(updatedDetails)
    onChange?.(updatedDetails)
  }

  // Options
  const weightUnitOptions = [
    { value: 'gram', label: t('metalRates.weightUnits.gram') },
    { value: 'kg', label: t('metalRates.weightUnits.kg') },
    { value: 'tola', label: t('metalRates.weightUnits.tola') },
  ]

  const currencyOptions = [
    { value: 'INR', label: 'INR (₹)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'AED', label: 'AED (د.إ)' },
  ]

  const rateSourceOptions = [
    { value: 'manual', label: t('metalRates.rateSources.manual') },
    { value: 'market', label: t('metalRates.rateSources.market') },
    { value: 'api', label: t('metalRates.rateSources.api') },
    { value: 'association', label: t('metalRates.rateSources.association') },
  ]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2">
        <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
          <FileText className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-text-primary">
            {t('metalRates.additionalInformation')}
          </h3>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4 rounded-lg border border-border-primary bg-bg-secondary p-4">
        {/* Weight Unit, Currency, Rate Source - Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Weight Unit */}
          <div className="space-y-2">
            <Label htmlFor="weight-unit">{t('metalRates.weightUnit')}</Label>
            <Select
              value={details.weightUnit}
              onChange={value =>
                handleFieldChange('weightUnit', value as WeightUnit)
              }
              options={weightUnitOptions}
            />
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label htmlFor="currency">{t('metalRates.currency')}</Label>
            <Select
              value={details.currency}
              onChange={value =>
                handleFieldChange('currency', value as Currency)
              }
              options={currencyOptions}
            />
          </div>

          {/* Rate Source */}
          <div className="space-y-2">
            <Label htmlFor="rate-source">
              {t('metalRates.rateSourcetext')}
            </Label>
            <Select
              value={details.rateSource}
              onChange={value =>
                handleFieldChange('rateSource', value as RateSource)
              }
              options={rateSourceOptions}
            />
          </div>
        </div>

        {/* Public Notes */}
        <div className="space-y-2">
          <Label htmlFor="public-notes">{t('metalRates.publicNotes')}</Label>
          <Textarea
            id="public-notes"
            value={details.notes}
            onChange={e => handleFieldChange('notes', e.target.value)}
            placeholder={t('metalRates.publicNotesPlaceholder')}
            rows={3}
          />
          <p className="text-xs text-text-tertiary">
            {t('metalRates.publicNotesHelp')}
          </p>
        </div>

        {/* Internal Notes */}
        <div className="space-y-2">
          <Label htmlFor="internal-notes">
            {t('metalRates.internalNotes')}
          </Label>
          <Textarea
            id="internal-notes"
            value={details.internalNotes}
            onChange={e => handleFieldChange('internalNotes', e.target.value)}
            placeholder={t('metalRates.internalNotesPlaceholder')}
            rows={3}
          />
          <p className="text-xs text-text-tertiary">
            {t('metalRates.internalNotesHelp')}
          </p>
        </div>
      </div>
    </div>
  )
}

AdditionalDetailsForm.displayName = 'AdditionalDetailsForm'

// ============================================================================
// TRANSLATION KEYS
// ============================================================================

/*
{
  "metalRates": {


  }
}
*/
