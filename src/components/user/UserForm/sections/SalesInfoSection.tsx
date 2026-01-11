// FILE: src/components/user/UserForm/sections/SalesInfoSection.tsx
// Sales Information Section - Sales Target, Commission Rate

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput'
import { TrendingUp, Percent } from 'lucide-react'
import type { FormSectionProps } from '../UserForm.types'

export const SalesInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  // Show sales fields only for sales-related roles
  const showSalesFields =
    data.role &&
    ['shop_admin', 'manager', 'staff'].includes(data.role) &&
    data.department === 'sales'

  if (!showSalesFields) {
    return (
      <div className="flex items-center justify-center rounded-md border border-border-primary bg-bg-tertiary p-8">
        <p className="text-center text-sm text-text-secondary">
          {t('user.salesInfoNotApplicable')}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
        <TrendingUp className="h-4 w-4" />
        <span>{t('user.salesInfoDescription')}</span>
      </div>

      {/* Sales Target */}
      <FormInput
        name="salesTarget"
        label={t('user.salesTarget')}
        type="number"
        value={data.salesTarget || 0}
        onChange={(name, value) => onChange(name, Number(value))}
        onBlur={onBlur}
        error={errors.salesTarget}
        placeholder="0"
        disabled={disabled}
        min={0}
        helpText={t('user.salesTargetHelpText')}
      />

      {/* Commission Rate */}
      <div className="relative">
        <FormInput
          name="commissionRate"
          label={t('user.commissionRate')}
          type="number"
          value={data.commissionRate || 0}
          onChange={(name, value) => onChange(name, Number(value))}
          onBlur={onBlur}
          error={errors.commissionRate}
          placeholder="0"
          disabled={disabled}
          min={0}
          max={100}
          step={0.1}
          helpText={t('user.commissionRateHelpText')}
        />
        <Percent className="absolute right-3 top-9 h-4 w-4 text-text-tertiary" />
      </div>

      {/* Info Box */}
      <div className="rounded-md border border-border-secondary bg-bg-secondary p-4">
        <h4 className="mb-2 text-sm font-medium text-text-primary">
          {t('user.salesPerformanceTracking')}
        </h4>
        <p className="text-sm text-text-secondary">
          {t('user.salesPerformanceDescription')}
        </p>
      </div>
    </div>
  )
}
