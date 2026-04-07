// FILE: src/components/customer/CustomerForm/sections/ContactInfoSection.tsx

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput'
import { FormPhoneInput } from '@/components/forms/FormPhoneInput'
import { Button } from '@/components/ui/button'
import type { FormSectionProps } from '@/components/customer/CustomerForm/CustomerForm.types'
import { Copy, Check } from 'lucide-react'

export const ContactInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopyPhone = async () => {
    if (!data.phone) return
    await navigator.clipboard.writeText(data.phone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSameAsPhone = () => {
    if (!data.phone) return
    onChange('whatsappNumber', data.phone)
  }
  return (
    <div className="space-y-4">
  <FormPhoneInput
        name="phone"
        label={t('customer.phone')}
        value={data.phone || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.phone}
        placeholder="9876543210"
        required
        disabled={disabled}
        suffix={
          data.phone ? (
            <button
              type="button"
              onClick={handleCopyPhone}
              disabled={disabled}
              className="flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors"
              title={t('common.copy')}
            >
              {copied ? (
                <Check className="h-4 w-4 text-status-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          ) : null
        }
      />
      <FormPhoneInput
        name="alternatePhone"
        label={t('customer.alternatePhone')}
        value={data.alternatePhone || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.alternatePhone}
        placeholder="9876543210"
        disabled={disabled}
      />

   <div className="space-y-1">
        <FormPhoneInput
          name="whatsappNumber"
          label={t('customer.whatsappNumber')}
          value={data.whatsappNumber || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.whatsappNumber}
          placeholder="9876543210"
          disabled={disabled}
        />
        {data.phone && (
          <button
            type="button"
            onClick={handleSameAsPhone}
            disabled={disabled}
            className="text-xs text-accent hover:text-accent/80 hover:underline transition-colors pl-1"
          >
            + {t('customer.sameAsPhone')}
          </button>
        )}
      </div>

      <FormInput
        name="email"
        label={t('customer.email')}
        type="email"
        value={data.email || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.email}
        placeholder="customer@example.com"
        disabled={disabled}
      />
    </div>
  )
}
