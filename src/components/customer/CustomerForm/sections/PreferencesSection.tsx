// FILE: src/components/customer/CustomerForm/sections/PreferencesSection.tsx
// Preferences Section

import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect'
import { FormInput } from '@/components/forms/FormInput'
import type { FormSectionProps } from '@/components/customer/CustomerForm/CustomerForm.types'

export const PreferencesSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const metalOptions = [
    { value: 'gold', label: t('customer.metal.gold') },
    { value: 'silver', label: t('customer.metal.silver') },
    { value: 'platinum', label: t('customer.metal.platinum') },
    { value: 'diamond', label: t('customer.metal.diamond') },
  ]

  const communicationOptions = [
    { value: 'email', label: t('customer.communication.email') },
    { value: 'sms', label: t('customer.communication.sms') },
    { value: 'whatsapp', label: t('customer.communication.whatsapp') },
    { value: 'call', label: t('customer.communication.call') },
    { value: 'none', label: t('customer.communication.none') },
  ]

  const sourceOptions = [
    { value: 'walk_in', label: t('customer.source.walkIn') },
    { value: 'referral', label: t('customer.source.referral') },
    { value: 'online', label: t('customer.source.online') },
    { value: 'phone', label: t('customer.source.phone') },
    { value: 'social_media', label: t('customer.source.socialMedia') },
    { value: 'advertisement', label: t('customer.source.advertisement') },
    { value: 'other', label: t('customer.source.other') },
  ]

  const handlePreferenceChange = (field: string, value: string) => {
    onChange('preferences', {
      ...data.preferences,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      <FormSelect
        name="preferences.preferredMetal"
        label={t('customer.preferredMetal')}
        value={data.preferences?.preferredMetal || ''}
        onChange={(_, value) => handlePreferenceChange('preferredMetal', value)}
        onBlur={() => onBlur?.('preferences.preferredMetal')}
        error={errors['preferences.preferredMetal']}
        placeholder={t('customer.selectMetal')}
        options={metalOptions}
        disabled={disabled}
      />

      <FormSelect
        name="preferences.communicationPreference"
        label={t('customer.communicationPreference')}
        value={data.preferences?.communicationPreference || ''}
        onChange={(_, value) =>
          handlePreferenceChange('communicationPreference', value)
        }
        onBlur={() => onBlur?.('preferences.communicationPreference')}
        error={errors['preferences.communicationPreference']}
        placeholder={t('customer.selectCommunication')}
        options={communicationOptions}
        disabled={disabled}
      />

      <FormSelect
        name="source"
        label={t('customer.customersource')}
        value={data.source || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.source}
        placeholder={t('customer.selectSource')}
        options={sourceOptions}
        disabled={disabled}
      />

      {data.source === 'referral' && (
        <FormInput
          name="referredBy"
          label={t('customer.referredBy')}
          value={data.referredBy || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.referredBy}
          placeholder={t('customer.referredByPlaceholder')}
          disabled={disabled}
        />
      )}
    </div>
  )
}
