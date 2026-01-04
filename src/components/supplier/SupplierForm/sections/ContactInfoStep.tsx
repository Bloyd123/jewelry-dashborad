//
// FILE: src/components/supplier/SupplierForm/sections/ContactInfoSection.tsx
// Contact Information Section
//

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormPhoneInput } from '@/components/forms/FormPhoneInput/FormPhoneInput'
import type { SectionProps } from '../SupplierForm.types'

export const ContactInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: SectionProps) => {
  const { t } = useTranslation()

  const handleNestedChange = (field: string, value: any) => {
    onChange('contactPerson', {
      ...data.contactPerson,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      {/* Contact Person Heading */}
      <div className="border-b border-border-secondary pb-2">
        <h4 className="text-sm font-semibold text-text-primary">
          {t('suppliers.contactPersonDetails')}
        </h4>
      </div>

      {/* First Name */}
      <FormInput
        name="contactPerson.firstName"
        label={t('suppliers.firstName')}
        value={data.contactPerson?.firstName || ''}
        onChange={(_, val) => handleNestedChange('firstName', val)}
        onBlur={onBlur}
        error={errors['contactPerson.firstName']}
        placeholder={t('suppliers.firstNamePlaceholder')}
        required
        disabled={disabled}
        maxLength={100}
      />

      {/* Last Name */}
      <FormInput
        name="contactPerson.lastName"
        label={t('suppliers.lastName')}
        value={data.contactPerson?.lastName || ''}
        onChange={(_, val) => handleNestedChange('lastName', val)}
        onBlur={onBlur}
        error={errors['contactPerson.lastName']}
        placeholder={t('suppliers.lastNamePlaceholder')}
        disabled={disabled}
        maxLength={100}
      />

      {/* Designation */}
      <FormInput
        name="contactPerson.designation"
        label={t('suppliers.designation')}
        value={data.contactPerson?.designation || ''}
        onChange={(_, val) => handleNestedChange('designation', val)}
        onBlur={onBlur}
        error={errors['contactPerson.designation']}
        placeholder={t('suppliers.designationPlaceholder')}
        disabled={disabled}
        maxLength={100}
      />

      {/* Phone */}
      <FormPhoneInput
        name="contactPerson.phone"
        label={t('suppliers.phone')}
        value={data.contactPerson?.phone || ''}
        onChange={(_, val) => handleNestedChange('phone', val)}
        onBlur={onBlur}
        error={errors['contactPerson.phone']}
        placeholder="9876543210"
        required
        disabled={disabled}
      />

      {/* Alternate Phone */}
      <FormPhoneInput
        name="contactPerson.alternatePhone"
        label={t('suppliers.alternatePhone')}
        value={data.contactPerson?.alternatePhone || ''}
        onChange={(_, val) => handleNestedChange('alternatePhone', val)}
        onBlur={onBlur}
        error={errors['contactPerson.alternatePhone']}
        placeholder="9876543210"
        disabled={disabled}
      />

      {/* WhatsApp Number */}
      <FormPhoneInput
        name="contactPerson.whatsappNumber"
        label={t('suppliers.whatsappNumber')}
        value={data.contactPerson?.whatsappNumber || ''}
        onChange={(_, val) => handleNestedChange('whatsappNumber', val)}
        onBlur={onBlur}
        error={errors['contactPerson.whatsappNumber']}
        placeholder="9876543210"
        disabled={disabled}
      />

      {/* Email */}
      <FormInput
        name="contactPerson.email"
        label={t('suppliers.email')}
        type="email"
        value={data.contactPerson?.email || ''}
        onChange={(_, val) => handleNestedChange('email', val)}
        onBlur={onBlur}
        error={errors['contactPerson.email']}
        placeholder={t('suppliers.emailPlaceholder')}
        disabled={disabled}
      />

      {/* Business Contact Heading */}
      <div className="mt-6 border-b border-border-secondary pb-2">
        <h4 className="text-sm font-semibold text-text-primary">
          {t('suppliers.businessContactDetails')}
        </h4>
      </div>

      {/* Business Email */}
      <FormInput
        name="businessEmail"
        label={t('suppliers.businessEmail')}
        type="email"
        value={data.businessEmail || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.businessEmail}
        placeholder={t('suppliers.businessEmailPlaceholder')}
        disabled={disabled}
      />

      {/* Business Phone */}
      <FormPhoneInput
        name="businessPhone"
        label={t('suppliers.businessPhone')}
        value={data.businessPhone || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.businessPhone}
        placeholder="02212345678"
        disabled={disabled}
      />

      {/* Website */}
      <FormInput
        name="website"
        label={t('suppliers.website')}
        type="url"
        value={data.website || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.website}
        placeholder="https://www.example.com"
        disabled={disabled}
      />
    </div>
  )
}
