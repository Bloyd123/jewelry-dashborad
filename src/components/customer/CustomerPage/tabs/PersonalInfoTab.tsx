// FILE: src/components/customer/CustomerPage/tabs/PersonalInfoTab.tsx
// Personal Information Tab with Accordions

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Copy,
  Check,
} from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/layout/Accordion/Accordion'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { Customer } from '@/types/customer.types'

// COPY BUTTON COMPONENT

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-6 w-6 p-0"
    >
      {copied ? (
        <Check className="h-3 w-3 text-status-success" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  )
}

// COMPONENT PROPS

interface PersonalInfoTabProps {
   customer: Customer
}

// PERSONAL INFO TAB COMPONENT

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  customer,
}) => {
  const { t } = useTranslation()


  // BASIC INFORMATION SECTION

  const BasicInfoSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* First Name */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('customerProfile.firstName')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {customer.firstName}
          </p>
        </div>

        {/* Last Name */}
        {customer.lastName && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.lastName')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {customer.lastName}
            </p>
          </div>
        )}

        {/* Gender */}
        {customer.gender && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.gender')}
            </Label>
            <p className="text-sm font-medium capitalize text-text-primary">
              {customer.gender}
            </p>
          </div>
        )}

        {/* Date of Birth */}
        {customer.dateOfBirth && (
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-2 text-xs text-text-secondary">
              <Calendar className="h-3 w-3" />
              {t('customerProfile.dateOfBirth')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {new Date(customer.dateOfBirth).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Anniversary Date */}
        {customer.anniversaryDate && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.anniversaryDate')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {new Date(customer.anniversaryDate).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Customer Type */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('customerProfile.customerType')}
          </Label>
          <Badge variant={customer.customerType as any} size="sm">
            {t(`customers.customerType.${customer.customerType}`)}
          </Badge>
        </div>

        {/* Customer Category */}
        {customer.customerCategory && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.customerCategory')}
            </Label>
            <Badge variant="outline" size="sm">
              {t(`customers.customerCategory.${customer.customerCategory}`)}
            </Badge>
          </div>
        )}

        {/* Source */}
        {customer.source && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.source')}
            </Label>
            <p className="text-sm font-medium capitalize text-text-primary">
              {customer.source.replace('_', ' ')}
            </p>
          </div>
        )}
      </div>
    </div>
  )

  // CONTACT INFORMATION SECTION

  const ContactInfoSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Primary Phone */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Phone className="h-3 w-3" />
            {t('customerProfile.primaryPhone')}
          </Label>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-text-primary">
              +91 {customer.phone}
            </p>
            <CopyButton text={customer.phone} />
          </div>
        </div>

        {/* Alternate Phone */}
        {customer.alternatePhone && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.alternatePhone')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text-primary">
                +91 {customer.alternatePhone}
              </p>
              <CopyButton text={customer.alternatePhone} />
            </div>
          </div>
        )}

        {/* WhatsApp */}
        {customer.whatsappNumber && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.whatsapp')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text-primary">
                +91 {customer.whatsappNumber}
              </p>
              <CopyButton text={customer.whatsappNumber} />
            </div>
          </div>
        )}

        {/* Email */}
        {customer.email && (
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-2 text-xs text-text-secondary">
              <Mail className="h-3 w-3" />
              {t('customerProfile.email')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-text-primary">
                {customer.email}
              </p>
              <CopyButton text={customer.email} />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // ADDRESS SECTION

  const AddressSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Street */}
        {customer.address?.street && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.street')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {customer.address.street}
            </p>
          </div>
        )}

        {/* City */}
        {customer.address?.city && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.city')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {customer.address.city}
            </p>
          </div>
        )}

        {/* State */}
        {customer.address?.state && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.state')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {customer.address.state}
            </p>
          </div>
        )}

        {/* Pincode */}
        {customer.address?.pincode && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.pincode')}
            </Label>
            <p className="text-sm font-medium text-text-primary">
              {customer.address.pincode}
            </p>
          </div>
        )}
      </div>

      <Button variant="outline" size="sm" className="w-full md:w-auto">
        <MapPin className="mr-2 h-4 w-4" />
        {t('customerProfile.viewOnMap')}
      </Button>
    </div>
  )

  // KYC DOCUMENTS SECTION

  const KYCDocumentsSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Aadhar Number */}
        {customer.aadharNumber && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.aadharNumber')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium text-text-primary">
                {customer.aadharNumber}
              </p>
              <CopyButton text={customer.aadharNumber} />
            </div>
          </div>
        )}

        {/* PAN Number */}
        {customer.panNumber && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.panNumber')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium text-text-primary">
                {customer.panNumber}
              </p>
              <CopyButton text={customer.panNumber} />
            </div>
          </div>
        )}

        {/* GST Number */}
        {customer.gstNumber && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.gstNumber')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium text-text-primary">
                {customer.gstNumber}
              </p>
              <CopyButton text={customer.gstNumber} />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // PREFERENCES SECTION

  const PreferencesSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Preferred Metal */}
        {customer.preferences?.preferredMetal && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.preferredMetal')}
            </Label>
            <Badge variant="default" size="sm">
              {customer.preferences.preferredMetal}
            </Badge>
          </div>
        )}

        {/* Communication Preference */}
        {customer.preferences?.communicationPreference && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('customerProfile.communicationPreference')}
            </Label>
            <p className="text-sm font-medium capitalize text-text-primary">
              {customer.preferences.communicationPreference}
            </p>
          </div>
        )}
      </div>
    </div>
  )

  // NOTES SECTION

  const NotesSection = () => (
    <div className="space-y-4 p-4">
      {customer.notes && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('customerProfile.notes')}
          </Label>
          <p className="text-sm text-text-secondary">{customer.notes}</p>
        </div>
      )}

      {customer.tags && customer.tags.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-text-secondary">
            {t('customerProfile.tags')}
          </Label>
          <div className="flex flex-wrap gap-2">
            {customer.tags.map((tag, index) => (
              <Badge key={index} variant="outline" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // RENDER MAIN ACCORDION

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
      <Accordion
        type="multiple"
        defaultValue={['basic', 'contact']}
        variant="separated"
        size="md"
      >
        {/* Basic Information */}
        <AccordionItem value="basic">
          <AccordionTrigger icon={<User className="h-5 w-5" />}>
            {t('customerProfile.basicInformation')}
          </AccordionTrigger>
          <AccordionContent>
            <BasicInfoSection />
          </AccordionContent>
        </AccordionItem>

        {/* Contact Information */}
        <AccordionItem value="contact">
          <AccordionTrigger icon={<Phone className="h-5 w-5" />}>
            {t('customerProfile.contactInformation')}
          </AccordionTrigger>
          <AccordionContent>
            <ContactInfoSection />
          </AccordionContent>
        </AccordionItem>

        {/* Address */}
        <AccordionItem value="address">
          <AccordionTrigger icon={<MapPin className="h-5 w-5" />}>
            {t('customerProfile.address')}
          </AccordionTrigger>
          <AccordionContent>
            <AddressSection />
          </AccordionContent>
        </AccordionItem>

        {/* KYC Documents */}
        <AccordionItem value="kyc">
          <AccordionTrigger icon={<FileText className="h-5 w-5" />}>
            {t('customerProfile.kycDocuments')}
          </AccordionTrigger>
          <AccordionContent>
            <KYCDocumentsSection />
          </AccordionContent>
        </AccordionItem>

        {/* Preferences */}
        <AccordionItem value="preferences">
          <AccordionTrigger icon={<User className="h-5 w-5" />}>
            {t('customerProfile.preferences')}
          </AccordionTrigger>
          <AccordionContent>
            <PreferencesSection />
          </AccordionContent>
        </AccordionItem>

        {/* Notes & Tags */}
        {(customer.notes || (customer.tags && customer.tags.length > 0)) && (
          <AccordionItem value="notes">
            <AccordionTrigger icon={<FileText className="h-5 w-5" />}>
              {t('customerProfile.notesAndTags')}
            </AccordionTrigger>
            <AccordionContent>
              <NotesSection />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}

export default PersonalInfoTab
