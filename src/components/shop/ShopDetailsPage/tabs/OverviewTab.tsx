// File src/components/shop/ShopDetailsPages/tabs/overivew

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Building2,
  User,
  Copy,
  Check,
  FileText,
  Verified,
} from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/layout/Accordion/Accordion'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Avatar } from '@/components/ui/data-display/Avatar/Avatar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { dummyShops } from '@/pages/shops/data'
import type { Shop, ShopUser, Organization } from '@/types'

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

// TYPE GUARDS

const isShopUser = (
  value: string | ShopUser | undefined
): value is ShopUser => {
  return typeof value === 'object' && value !== null && '_id' in value
}

const isOrganization = (
  value: string | Organization | undefined
): value is Organization => {
  return typeof value === 'object' && value !== null && '_id' in value
}

// MAIN COMPONENT

const OverviewTab = () => {
  const { t } = useTranslation()
  const shopData = dummyShops[0]

  // Extract manager and organization with type safety
  const manager = isShopUser(shopData.managerId) ? shopData.managerId : null
  const organization = isOrganization(shopData.organizationId)
    ? shopData.organizationId
    : null

  // BASIC INFORMATION SECTION

  const BasicInfoSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Display Name */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Store className="h-3 w-3" />
            {t('shopProfile.displayName')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {shopData.displayName || shopData.name}
          </p>
        </div>

        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('shopProfile.fullName')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {shopData.name}
          </p>
        </div>

        {/* Shop Type */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('shops.shopProfile.shopType')}
          </Label>
          <Badge variant="default" size="sm" className="w-fit">
            {shopData.shopType || 'N/A'}
          </Badge>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('shopProfile.category')}
          </Label>
          <p className="text-sm font-medium capitalize text-text-primary">
            {shopData.category || 'N/A'}
          </p>
        </div>

        {/* Established Year */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Calendar className="h-3 w-3" />
            {t('shopProfile.established')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {shopData.establishedYear || 'N/A'}
          </p>
        </div>

        {/* Opening Date */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('shopProfile.openingDate')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {shopData.openingDate
              ? new Date(shopData.openingDate).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )

  // ADDRESS SECTION

  const AddressSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Street */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label className="text-xs text-text-secondary">
            {t('shopProfile.street')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {shopData.address.street}
          </p>
        </div>

        {/* City */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('shopProfile.city')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {shopData.address.city}
          </p>
        </div>

        {/* State */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('shopProfile.state')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {shopData.address.state}
          </p>
        </div>

        {/* Pincode */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('shopProfile.pincode')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {shopData.address.pincode}
          </p>
        </div>

        {/* Country */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('shopProfile.country')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {shopData.address.country || 'N/A'}
          </p>
        </div>
      </div>

      {/* View on Map Link */}
      <Button variant="outline" size="sm" className="w-full md:w-auto">
        <MapPin className="mr-2 h-4 w-4" />
        {t('shopProfile.viewOnMap')}
      </Button>
    </div>
  )

  // BUSINESS REGISTRATION SECTION

  const BusinessRegistrationSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* GST Number */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('shopProfile.gstNumber')}
          </Label>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm font-medium text-text-primary">
              {shopData.gstNumber || 'N/A'}
            </p>
            {shopData.gstNumber && <CopyButton text={shopData.gstNumber} />}
          </div>
        </div>

        {/* PAN Number */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('shopProfile.panNumber')}
          </Label>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm font-medium text-text-primary">
              {shopData.panNumber || 'N/A'}
            </p>
            {shopData.panNumber && <CopyButton text={shopData.panNumber} />}
          </div>
        </div>

        {/* Verification Status */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label className="text-xs text-text-secondary">
            {t('shopProfile.verificationStatus')}
          </Label>
          <div className="flex items-center gap-2">
            {shopData.isVerified ? (
              <>
                <Badge variant="success" size="sm" dot>
                  <Verified className="mr-1 h-3 w-3" />
                  {t('shopProfile.verified')}
                </Badge>
                <span className="text-xs text-text-tertiary">
                  ({t('shopProfile.verifiedOn')} 15 Jan 2024)
                </span>
              </>
            ) : (
              <Badge variant="warning" size="sm" dot>
                {t('shopProfile.pending')}
              </Badge>
            )}
          </div>
        </div>

        {/* License Number */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label className="text-xs text-text-secondary">
            {t('shopProfile.licenseNumber')}
          </Label>
          <p className="font-mono text-sm font-medium text-text-primary">
            LIC/MH/2024/12345
          </p>
        </div>
      </div>
    </div>
  )

  // MANAGER INFORMATION SECTION

  const ManagerInfoSection = () => {
    if (!manager) {
      return (
        <div className="p-4">
          <p className="text-sm text-text-secondary">
            Manager information not available
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4 p-4">
        {/* Manager Avatar and Basic Info */}
        <div className="flex items-start gap-4 rounded-lg border border-border-secondary bg-bg-tertiary p-3">
          <Avatar
            src={manager.profileImage || ''}
            name={`${manager.firstName || ''} ${manager.lastName || ''}`}
            size="lg"
            status="online"
          />
          <div className="flex-1">
            <h4 className="text-base font-semibold text-text-primary">
              {manager.firstName} {manager.lastName}
            </h4>
            <p className="text-xs text-text-secondary">
              {t('shopProfile.role')}: {t('shopProfile.shopAdmin')}
            </p>
          </div>
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-2 text-xs text-text-secondary">
              <Mail className="h-3 w-3" />
              {t('shopProfile.email')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-text-primary">
                {manager.email || 'N/A'}
              </p>
              {manager.email && <CopyButton text={manager.email} />}
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-2 text-xs text-text-secondary">
              <Phone className="h-3 w-3" />
              {t('shopProfile.phone')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text-primary">
                {manager.phone ? `+91 ${manager.phone}` : 'N/A'}
              </p>
              {manager.phone && <CopyButton text={manager.phone} />}
            </div>
          </div>

          {/* Assigned Since */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label className="text-xs text-text-secondary">
              {t('shopProfile.assignedSince')}
            </Label>
            <p className="text-sm font-medium text-text-primary">Jan 2024</p>
          </div>
        </div>

        {/* View Profile Button */}
        <Button variant="link" size="sm" className="h-auto p-0 text-accent">
          {t('shopProfile.viewFullProfile')}
        </Button>
      </div>
    )
  }

  // CONTACT SECTION (Additional - as shown in image)

  const ContactSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Primary Phone */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Phone className="h-3 w-3" />
            {t('shopProfile.primaryPhone')}
          </Label>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-text-primary">
              {shopData.phone ? `+91 ${shopData.phone}` : 'N/A'}
            </p>
            {shopData.phone && <CopyButton text={shopData.phone} />}
          </div>
        </div>

        {/* Alternate Phone */}
        {shopData.alternatePhone && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('shopProfile.altPhone')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text-primary">
                +91 {shopData.alternatePhone}
              </p>
              <CopyButton text={shopData.alternatePhone} />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Mail className="h-3 w-3" />
            {t('shopProfile.email')}
          </Label>
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-text-primary">
              {shopData.email || 'N/A'}
            </p>
            {shopData.email && <CopyButton text={shopData.email} />}
          </div>
        </div>

        {/* WhatsApp */}
        {shopData.whatsappNumber && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('shopProfile.whatsapp')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text-primary">
                +91 {shopData.whatsappNumber}
              </p>
              <CopyButton text={shopData.whatsappNumber} />
            </div>
          </div>
        )}

        {/* Website */}
        {shopData.website && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label className="flex items-center gap-2 text-xs text-text-secondary">
              <Globe className="h-3 w-3" />
              {t('shopProfile.website')}
            </Label>
            <a
              href={`https://${shopData.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent hover:underline"
            >
              {shopData.website}
            </a>
          </div>
        )}
      </div>
    </div>
  )

  // RENDER MAIN ACCORDION

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
      {/* Accordion Sections */}
      <Accordion
        type="multiple"
        defaultValue={['basic']}
        variant="separated"
        size="md"
      >
        {/* Basic Information */}
        <AccordionItem value="basic">
          <AccordionTrigger icon={<Store className="h-5 w-5" />}>
            {t('shopProfile.basicInformation')}
          </AccordionTrigger>
          <AccordionContent>
            <BasicInfoSection />
          </AccordionContent>
        </AccordionItem>

        {/* Address */}
        <AccordionItem value="address">
          <AccordionTrigger icon={<MapPin className="h-5 w-5" />}>
            {t('shopProfile.address')}
          </AccordionTrigger>
          <AccordionContent>
            <AddressSection />
          </AccordionContent>
        </AccordionItem>

        {/* Business Registration */}
        <AccordionItem value="business">
          <AccordionTrigger icon={<FileText className="h-5 w-5" />}>
            {t('shopProfile.businessRegistration')}
          </AccordionTrigger>
          <AccordionContent>
            <BusinessRegistrationSection />
          </AccordionContent>
        </AccordionItem>

        {/* Manager Information */}
        <AccordionItem value="manager">
          <AccordionTrigger icon={<User className="h-5 w-5" />}>
            {t('shopProfile.managerInformation')}
          </AccordionTrigger>
          <AccordionContent>
            <ManagerInfoSection />
          </AccordionContent>
        </AccordionItem>

        {/* Contact (Additional) */}
        <AccordionItem value="contact">
          <AccordionTrigger icon={<Phone className="h-5 w-5" />}>
            {t('shopProfile.contact')}
          </AccordionTrigger>
          <AccordionContent>
            <ContactSection />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default OverviewTab
