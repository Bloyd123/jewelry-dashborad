// FILE: src/components/user/UserForm/sections/PreferencesSection.tsx
// Preferences Section - Language, Theme, Currency, Date Format, Timezone, Notifications

import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Settings } from 'lucide-react'
import type { FormSectionProps } from '../UserForm.types'

export const PreferencesSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const languageOptions = [
    { value: 'en', label: t('user.languages.english') },
    { value: 'hi', label: t('user.languages.hindi') },
    { value: 'mr', label: t('user.languages.marathi') },
    { value: 'gu', label: t('user.languages.gujarati') },
    { value: 'ta', label: t('user.languages.tamil') },
    { value: 'te', label: t('user.languages.telugu') },
  ]

  const themeOptions = [
    { value: 'light', label: t('user.themes.light') },
    { value: 'dark', label: t('user.themes.dark') },
    { value: 'auto', label: t('user.themes.auto') },
  ]

  const currencyOptions = [
    { value: 'INR', label: 'INR (₹)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'AED', label: 'AED (د.إ)' },
  ]

  const dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  ]

  const timezoneOptions = [
    { value: 'Asia/Kolkata', label: 'IST (Asia/Kolkata)' },
    { value: 'America/New_York', label: 'EST (America/New_York)' },
    { value: 'Europe/London', label: 'GMT (Europe/London)' },
    { value: 'Asia/Dubai', label: 'GST (Asia/Dubai)' },
  ]

  const handlePreferenceChange = (field: string, value: any) => {
    onChange('preferences', {
      ...data.preferences,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
        <Settings className="h-4 w-4" />
        <span>{t('user.preferencesDescription')}</span>
      </div>

      {/* Language */}
      <FormSelect
        name="preferences.language"
        label={t('user.language')}
        value={data.preferences?.language || 'en'}
        onChange={(_, value) => handlePreferenceChange('language', value)}
        onBlur={() => onBlur?.('preferences.language')}
        error={errors['preferences.language']}
        placeholder={t('user.selectLanguage')}
        options={languageOptions}
        disabled={disabled}
      />

      {/* Theme */}
      <FormSelect
        name="preferences.theme"
        label={t('user.theme')}
        value={data.preferences?.theme || 'light'}
        onChange={(_, value) => handlePreferenceChange('theme', value)}
        onBlur={() => onBlur?.('preferences.theme')}
        error={errors['preferences.theme']}
        placeholder={t('user.selectTheme')}
        options={themeOptions}
        disabled={disabled}
      />

      {/* Currency */}
      <FormSelect
        name="preferences.currency"
        label={t('user.currency')}
        value={data.preferences?.currency || 'INR'}
        onChange={(_, value) => handlePreferenceChange('currency', value)}
        onBlur={() => onBlur?.('preferences.currency')}
        error={errors['preferences.currency']}
        placeholder={t('user.selectCurrency')}
        options={currencyOptions}
        disabled={disabled}
      />

      {/* Date Format */}
      <FormSelect
        name="preferences.dateFormat"
        label={t('user.dateFormat')}
        value={data.preferences?.dateFormat || 'DD/MM/YYYY'}
        onChange={(_, value) => handlePreferenceChange('dateFormat', value)}
        onBlur={() => onBlur?.('preferences.dateFormat')}
        error={errors['preferences.dateFormat']}
        placeholder={t('user.selectDateFormat')}
        options={dateFormatOptions}
        disabled={disabled}
      />

      {/* Timezone */}
      <FormSelect
        name="preferences.timezone"
        label={t('user.timezone')}
        value={data.preferences?.timezone || 'Asia/Kolkata'}
        onChange={(_, value) => handlePreferenceChange('timezone', value)}
        onBlur={() => onBlur?.('preferences.timezone')}
        error={errors['preferences.timezone']}
        placeholder={t('user.selectTimezone')}
        options={timezoneOptions}
        disabled={disabled}
      />

      {/* Notifications Toggle */}
      <div className="flex items-center justify-between rounded-md border border-border-primary bg-bg-secondary p-4">
        <div className="space-y-0.5">
          <Label
            htmlFor="notifications"
            className="text-sm font-medium text-text-primary"
          >
            {t('user.notifications')}
          </Label>
          <p className="text-sm text-text-tertiary">
            {t('user.notificationsDescription')}
          </p>
        </div>
        <Switch
          id="notifications"
          checked={data.preferences?.notificationsEnabled ?? true}
          onCheckedChange={checked =>
            handlePreferenceChange('notificationsEnabled', checked)
          }
          disabled={disabled}
        />
      </div>
    </div>
  )
}
