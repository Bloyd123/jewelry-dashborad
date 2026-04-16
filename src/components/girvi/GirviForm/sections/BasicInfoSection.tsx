// FILE: src/components/girvi/GirviForm/sections/BasicInfoSection.tsx
// Basic Info: Girvi Date, Due Date, Grace Period, Slip Number, Witness

import { useTranslation } from 'react-i18next'
import { FormDatePicker } from '@/components/forms/FormDatePicker/FormDatePicker'
import { FormInput }      from '@/components/forms/FormInput/FormInput'
import { Calendar, Hash, User } from 'lucide-react'
import type { GirviFormSectionProps } from '../GirviForm.types'

export const BasicInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: GirviFormSectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {/* Girvi Date + Due Date side by side */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormDatePicker
          name="girviDate"
          label={t('girvi.girviDate')}
          value={data.girviDate || new Date().toISOString()}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.girviDate}
          required
          disabled={disabled}
          maxDate={new Date()}
        />

        <FormDatePicker
          name="dueDate"
          label={t('girvi.dueDate')}
          value={data.dueDate || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.dueDate}
          disabled={disabled}
          minDate={data.girviDate ? new Date(data.girviDate) : new Date()}
        />
      </div>

      {/* Grace Period */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          {t('girvi.gracePeriodDays')}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Calendar className="h-4 w-4 text-text-tertiary" />
          </div>
          <input
            type="number"
            name="gracePeriodDays"
            value={data.gracePeriodDays ?? 0}
            min={0}
            onChange={e => onChange('gracePeriodDays', parseInt(e.target.value) || 0)}
            onBlur={() => onBlur?.('gracePeriodDays')}
            disabled={disabled}
            className={`h-10 w-full rounded-lg border bg-bg-secondary pl-10 pr-4 text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary disabled:text-text-tertiary ${
              errors.gracePeriodDays ? 'border-status-error' : 'border-border-primary'
            }`}
          />
        </div>
        {errors.gracePeriodDays && (
          <p className="text-sm text-status-error">⚠️ {errors.gracePeriodDays}</p>
        )}
        <p className="text-xs text-text-tertiary">
          {t('girvi.gracePeriodHint')}
        </p>
      </div>

      {/* Girvi Slip Number + Witness Name */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            {t('girvi.girviSlipNumber')}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Hash className="h-4 w-4 text-text-tertiary" />
            </div>
            <input
              type="text"
              name="girviSlipNumber"
              value={data.girviSlipNumber || ''}
              onChange={e => onChange('girviSlipNumber', e.target.value)}
              onBlur={() => onBlur?.('girviSlipNumber')}
              disabled={disabled}
              placeholder={t('girvi.girviSlipNumberPlaceholder')}
              maxLength={100}
              className="h-10 w-full rounded-lg border border-border-primary bg-bg-secondary pl-10 pr-4 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            {t('girvi.witnessName')}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-4 w-4 text-text-tertiary" />
            </div>
            <input
              type="text"
              name="witnessName"
              value={data.witnessName || ''}
              onChange={e => onChange('witnessName', e.target.value)}
              onBlur={() => onBlur?.('witnessName')}
              disabled={disabled}
              placeholder={t('girvi.witnessNamePlaceholder')}
              maxLength={100}
              className="h-10 w-full rounded-lg border border-border-primary bg-bg-secondary pl-10 pr-4 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary"
            />
          </div>
        </div>
      </div>
    </div>
  )
}