import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SupplierManagementModal } from '@/components/supplier/SupplierManagementModal'
import type { ManagementAction } from '@/components/supplier/SupplierManagementModal/SupplierManagementModal.types'
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
  CreditCard,
  Star,
  TrendingUp,
  Package,
  AlertCircle,
  DollarSign,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Ban,
  Target,
  TrendingDown,
  Activity,
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
import { dummySupplier } from '@/pages/suppliers/data'
import type { Supplier } from '@/types/supplier.types'

// 
// COPY BUTTON COMPONENT
// 

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

// 
// RATING STARS COMPONENT
// 

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? 'fill-accent text-accent' : 'text-border-secondary'
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-text-primary">
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

// 
// MAIN COMPONENT
// 

const SupplierOverviewTab = () => {
  const { t } = useTranslation()
  const supplierData: Supplier = dummySupplier
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false)
  const [managementAction, setManagementAction] =
    useState<ManagementAction | null>(null)
  const handleManagementSuccess = () => {
    console.log('Action completed:', managementAction)
    setIsManagementModalOpen(false)
    setManagementAction(null)
  }

  // ========================================================================
  // BASIC INFORMATION SECTION
  // ========================================================================

  const BasicInfoSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Business Name */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Store className="h-3 w-3" />
            {t('suppliers.businessName')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {supplierData.businessName}
          </p>
        </div>

        {/* Display Name */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('suppliers.displayName')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {supplierData.displayName || 'N/A'}
          </p>
        </div>

        {/* Supplier Code */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('suppliers.supplierCode')}
          </Label>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm font-medium text-text-primary">
              {supplierData.supplierCode}
            </p>
            <CopyButton text={supplierData.supplierCode} />
          </div>
        </div>

        {/* Supplier Type */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('suppliers.supplierType')}
          </Label>
          <Badge variant="default" size="sm" className="w-fit capitalize">
            {supplierData.supplierType}
          </Badge>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('suppliers.categorytext')}
          </Label>
          <Badge variant="info" size="sm" className="w-fit capitalize">
            {supplierData.supplierCategory}
          </Badge>
        </div>

        {/* Products Supplied */}
        {supplierData.productsSupplied &&
          supplierData.productsSupplied.length > 0 && (
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label className="text-xs text-text-secondary">
                {t('suppliers.productsSupplied')}
              </Label>
              <div className="flex flex-wrap gap-2">
                {supplierData.productsSupplied.map((product, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {product}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        {/* Specialization */}
        {supplierData.specialization &&
          supplierData.specialization.length > 0 && (
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label className="text-xs text-text-secondary">
                {t('suppliers.specialization')}
              </Label>
              <div className="flex flex-wrap gap-2">
                {supplierData.specialization.map((spec, index) => (
                  <Badge key={index} variant="success" size="sm">
                    <Award className="mr-1 h-3 w-3" />
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        {/* Tags */}
        {supplierData.tags && supplierData.tags.length > 0 && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label className="text-xs text-text-secondary">
              {t('suppliers.tags')}
            </Label>
            <div className="flex flex-wrap gap-2">
              {supplierData.tags.map((tag, index) => (
                <Badge key={index} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )


  // CONTACT PERSON SECTION


  const ContactPersonSection = () => (
    <div className="space-y-4 p-4">
      {/* Contact Person Header */}
      <div className="flex items-start gap-4 rounded-lg border border-border-secondary bg-bg-tertiary p-3">
        <Avatar
          name={`${supplierData.contactPerson.firstName} ${supplierData.contactPerson.lastName || ''}`}
          size="lg"
          status="online"
        />
        <div className="flex-1">
          <h4 className="text-base font-semibold text-text-primary">
            {supplierData.contactPerson.firstName}{' '}
            {supplierData.contactPerson.lastName || ''}
          </h4>
          {supplierData.contactPerson.designation && (
            <p className="text-xs text-text-secondary">
              {supplierData.contactPerson.designation}
            </p>
          )}
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Email */}
        {supplierData.contactPerson.email && (
          <div className="flex flex-col gap-1.5">
            <Label className="flex items-center gap-2 text-xs text-text-secondary">
              <Mail className="h-3 w-3" />
              {t('suppliers.email')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-text-primary">
                {supplierData.contactPerson.email}
              </p>
              <CopyButton text={supplierData.contactPerson.email} />
            </div>
          </div>
        )}

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Phone className="h-3 w-3" />
            {t('suppliers.phone')}
          </Label>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-text-primary">
              +91 {supplierData.contactPerson.phone}
            </p>
            <CopyButton text={supplierData.contactPerson.phone} />
          </div>
        </div>

        {/* Alternate Phone */}
        {supplierData.contactPerson.alternatePhone && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('suppliers.alternatePhone')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text-primary">
                +91 {supplierData.contactPerson.alternatePhone}
              </p>
              <CopyButton text={supplierData.contactPerson.alternatePhone} />
            </div>
          </div>
        )}

        {/* WhatsApp */}
        {supplierData.contactPerson.whatsappNumber && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('suppliers.whatsapp')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text-primary">
                +91 {supplierData.contactPerson.whatsappNumber}
              </p>
              <CopyButton text={supplierData.contactPerson.whatsappNumber} />
            </div>
          </div>
        )}

        {/* Business Email */}
        {supplierData.businessEmail && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('suppliers.businessEmail')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-text-primary">
                {supplierData.businessEmail}
              </p>
              <CopyButton text={supplierData.businessEmail} />
            </div>
          </div>
        )}

        {/* Business Phone */}
        {supplierData.businessPhone && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('suppliers.businessPhone')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text-primary">
                {supplierData.businessPhone}
              </p>
              <CopyButton text={supplierData.businessPhone} />
            </div>
          </div>
        )}

        {/* Website */}
        {supplierData.website && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label className="flex items-center gap-2 text-xs text-text-secondary">
              <Globe className="h-3 w-3" />
              {t('suppliers.website')}
            </Label>
            <a
              href={supplierData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent hover:underline"
            >
              {supplierData.website}
            </a>
          </div>
        )}
      </div>
    </div>
  )

  // ========================================================================
  // ADDRESS SECTION
  // ========================================================================

  const AddressSection = () => {
    if (!supplierData.address) {
      return (
        <div className="p-4">
          <p className="text-sm text-text-secondary">
            {t('suppliers.noAddress')}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Street */}
          {supplierData.address.street && (
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label className="text-xs text-text-secondary">
                {t('suppliers.street')}
              </Label>
              <p className="text-sm font-medium text-text-primary">
                {supplierData.address.street}
              </p>
            </div>
          )}

          {/* Landmark */}
          {supplierData.address.landmark && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-text-secondary">
                {t('suppliers.landmark')}
              </Label>
              <p className="text-sm font-medium text-text-primary">
                {supplierData.address.landmark}
              </p>
            </div>
          )}

          {/* Area */}
          {supplierData.address.area && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-text-secondary">
                {t('suppliers.area')}
              </Label>
              <p className="text-sm font-medium text-text-primary">
                {supplierData.address.area}
              </p>
            </div>
          )}

          {/* City */}
          {supplierData.address.city && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-text-secondary">
                {t('suppliers.city')}
              </Label>
              <p className="text-sm font-medium text-text-primary">
                {supplierData.address.city}
              </p>
            </div>
          )}

          {/* State */}
          {supplierData.address.state && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-text-secondary">
                {t('suppliers.state')}
              </Label>
              <p className="text-sm font-medium text-text-primary">
                {supplierData.address.state}
              </p>
            </div>
          )}

          {/* Pincode */}
          {supplierData.address.pincode && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-text-secondary">
                {t('suppliers.pincode')}
              </Label>
              <p className="text-sm font-medium text-text-primary">
                {supplierData.address.pincode}
              </p>
            </div>
          )}

          {/* Country */}
          {supplierData.address.country && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-text-secondary">
                {t('suppliers.country')}
              </Label>
              <p className="text-sm font-medium text-text-primary">
                {supplierData.address.country}
              </p>
            </div>
          )}
        </div>

        {/* View on Map Button */}
        <Button variant="outline" size="sm" className="w-full md:w-auto">
          <MapPin className="mr-2 h-4 w-4" />
          {t('suppliers.viewOnMap')}
        </Button>
      </div>
    )
  }

  // ========================================================================
  // BUSINESS REGISTRATION SECTION
  // ========================================================================

  const BusinessRegistrationSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* GST Number */}
        {supplierData.gstNumber && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('suppliers.gstNumber')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium text-text-primary">
                {supplierData.gstNumber}
              </p>
              <CopyButton text={supplierData.gstNumber} />
            </div>
          </div>
        )}

        {/* PAN Number */}
        {supplierData.panNumber && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('suppliers.panNumber')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium text-text-primary">
                {supplierData.panNumber}
              </p>
              <CopyButton text={supplierData.panNumber} />
            </div>
          </div>
        )}

        {/* TAN Number */}
        {supplierData.tanNumber && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('suppliers.tanNumber')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium text-text-primary">
                {supplierData.tanNumber}
              </p>
              <CopyButton text={supplierData.tanNumber} />
            </div>
          </div>
        )}

        {/* Registration Number */}
        {supplierData.registrationNumber && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-text-secondary">
              {t('suppliers.registrationNumber')}
            </Label>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-medium text-text-primary">
                {supplierData.registrationNumber}
              </p>
              <CopyButton text={supplierData.registrationNumber} />
            </div>
          </div>
        )}

        {/* Verification Status */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label className="text-xs text-text-secondary">
            {t('suppliers.verificationStatus')}
          </Label>
          <div className="flex items-center gap-2">
            {supplierData.isVerified ? (
              <>
                <Badge variant="success" size="sm" dot>
                  <Verified className="mr-1 h-3 w-3" />
                  {t('suppliers.verified')}
                </Badge>
                {supplierData.verifiedAt && (
                  <span className="text-xs text-text-tertiary">
                    ({t('suppliers.verifiedOn')}{' '}
                    {new Date(supplierData.verifiedAt).toLocaleDateString()})
                  </span>
                )}
              </>
            ) : (
              <Badge variant="warning" size="sm" dot>
                {t('suppliers.pending')}
              </Badge>
            )}
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 md:col-span-2">
          {supplierData.isActive ? (
            <Badge variant="success" size="sm">
              <CheckCircle className="mr-1 h-3 w-3" />
              {t('suppliers.active')}
            </Badge>
          ) : (
            <Badge variant="error" size="sm">
              <XCircle className="mr-1 h-3 w-3" />
              {t('suppliers.inactive')}
            </Badge>
          )}

          {supplierData.isPreferred && (
            <Badge variant="info" size="sm">
              <Star className="mr-1 h-3 w-3 fill-current" />
              {t('suppliers.preferredtext')}
            </Badge>
          )}

          {supplierData.isBlacklisted && (
            <Badge variant="error" size="sm">
              <Ban className="mr-1 h-3 w-3" />
              {t('suppliers.blacklisted')}
            </Badge>
          )}
        </div>

        {/* Blacklist Reason */}
        {supplierData.isBlacklisted && supplierData.blacklistReason && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label className="flex items-center gap-2 text-xs text-status-error">
              <AlertCircle className="h-3 w-3" />
              {t('suppliers.blacklistReason')}
            </Label>
            <p className="text-sm text-text-primary">
              {supplierData.blacklistReason}
            </p>
            {supplierData.blacklistedAt && (
              <span className="text-xs text-text-tertiary">
                {t('suppliers.blacklistedOn')}{' '}
                {new Date(supplierData.blacklistedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Certifications */}
      {supplierData.certifications &&
        supplierData.certifications.length > 0 && (
          <div className="border-t border-border-secondary pt-4">
            <Label className="mb-3 flex items-center gap-2 text-xs text-text-secondary">
              <ShieldCheck className="h-4 w-4" />
              {t('suppliers.certifications')}
            </Label>
            <div className="space-y-2">
              {supplierData.certifications.map(cert => (
                <div
                  key={cert._id}
                  className="rounded-lg border border-border-secondary bg-bg-tertiary p-3"
                >
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div>
                      <p className="text-xs text-text-secondary">
                        {t('suppliers.certificationType')}
                      </p>
                      <Badge
                        variant="success"
                        size="sm"
                        className="mt-1 capitalize"
                      >
                        {cert.certificationType}
                      </Badge>
                    </div>
                    {cert.certificateNumber && (
                      <div>
                        <p className="text-xs text-text-secondary">
                          {t('suppliers.certificateNumber')}
                        </p>
                        <p className="mt-1 font-mono text-sm text-text-primary">
                          {cert.certificateNumber}
                        </p>
                      </div>
                    )}
                    {cert.issuedBy && (
                      <div>
                        <p className="text-xs text-text-secondary">
                          {t('suppliers.issuedBy')}
                        </p>
                        <p className="mt-1 text-sm text-text-primary">
                          {cert.issuedBy}
                        </p>
                      </div>
                    )}
                    {cert.issueDate && (
                      <div>
                        <p className="text-xs text-text-secondary">
                          {t('suppliers.validity')}
                        </p>
                        <p className="mt-1 text-sm text-text-primary">
                          {new Date(cert.issueDate).toLocaleDateString()}
                          {cert.expiryDate &&
                            ` - ${new Date(cert.expiryDate).toLocaleDateString()}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  )

  // ========================================================================
  // PAYMENT TERMS SECTION
  // ========================================================================

  const PaymentTermsSection = () => (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Payment Terms */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('suppliers.paymentTermstext')}
          </Label>
          <Badge variant="default" size="sm" className="w-fit capitalize">
            {supplierData.paymentTerms.replace('_', ' ')}
          </Badge>
        </div>

        {/* Credit Period */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Clock className="h-3 w-3" />
            {t('suppliers.creditPeriod')}
          </Label>
          <p className="text-sm font-medium text-text-primary">
            {supplierData.creditPeriod} {t('supplier.days')}
          </p>
        </div>

        {/* Credit Limit */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <DollarSign className="h-3 w-3" />
            {t('suppliers.creditLimit')}
          </Label>
          <p className="text-lg font-semibold text-text-primary">
            ₹{supplierData.creditLimit.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Current Balance */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('suppliers.currentBalance')}
          </Label>
          <p
            className={`text-lg font-semibold ${
              supplierData.currentBalance < 0
                ? 'text-status-error'
                : supplierData.currentBalance > 0
                  ? 'text-status-success'
                  : 'text-text-primary'
            }`}
          >
            ₹{Math.abs(supplierData.currentBalance).toLocaleString('en-IN')}
            {supplierData.currentBalance < 0 && (
              <span className="ml-1 text-sm text-status-error">
                ({t('suppliers.due')})
              </span>
            )}
          </p>
        </div>

        {/* Total Purchases */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('suppliers.totalPurchases')}
          </Label>
          <p className="text-lg font-semibold text-text-primary">
            ₹{supplierData.totalPurchases.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Total Paid */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('suppliers.totalPaid')}
          </Label>
          <p className="text-lg font-semibold text-status-success">
            ₹{supplierData.totalPaid.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Total Due */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('suppliers.totalDue')}
          </Label>
          <p className="text-lg font-semibold text-status-error">
            ₹{supplierData.totalDue.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Advance Payment */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('suppliers.advancePayment')}
          </Label>
          <p className="text-lg font-semibold text-status-info">
            ₹{supplierData.advancePayment.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  )

  // ========================================================================
  // BANK DETAILS SECTION
  // ========================================================================

  const BankDetailsSection = () => {
    if (!supplierData.bankDetails) {
      return (
        <div className="p-4">
          <p className="text-sm text-text-secondary">
            {t('suppliers.noBankDetails')}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Bank Name */}
          {supplierData.bankDetails.bankName && (
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center gap-2 text-xs text-text-secondary">
                <Building2 className="h-3 w-3" />
                {t('suppliers.bankName')}
              </Label>
              <p className="text-sm font-medium text-text-primary">
                {supplierData.bankDetails.bankName}
              </p>
            </div>
          )}

          {/* Branch Name */}
          {supplierData.bankDetails.branchName && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-text-secondary">
                {t('suppliers.branchName')}
              </Label>
              <p className="text-sm font-medium text-text-primary">
                {supplierData.bankDetails.branchName}
              </p>
            </div>
          )}

          {/* Account Holder Name */}
          {supplierData.bankDetails.accountHolderName && (
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label className="text-xs text-text-secondary">
                {t('suppliers.accountHolderName')}
              </Label>
              <p className="text-sm font-medium text-text-primary">
                {supplierData.bankDetails.accountHolderName}
              </p>
            </div>
          )}

          {/* Account Number */}
          {supplierData.bankDetails.accountNumber && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-text-secondary">
                {t('suppliers.accountNumber')}
              </Label>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm font-medium text-text-primary">
                  {supplierData.bankDetails.accountNumber}
                </p>
                <CopyButton text={supplierData.bankDetails.accountNumber} />
              </div>
            </div>
          )}

          {/* IFSC Code */}
          {supplierData.bankDetails.ifscCode && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-text-secondary">
                {t('suppliers.ifscCode')}
              </Label>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm font-medium text-text-primary">
                  {supplierData.bankDetails.ifscCode}
                </p>
                <CopyButton text={supplierData.bankDetails.ifscCode} />
              </div>
            </div>
          )}

          {/* Account Type */}
          {supplierData.bankDetails.accountType && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-text-secondary">
                {t('suppliers.accountType')}
              </Label>
              <Badge variant="outline" size="sm" className="w-fit capitalize">
                {supplierData.bankDetails.accountType}
              </Badge>
            </div>
          )}

          {/* UPI ID */}
          {supplierData.upiId && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-text-secondary">
                {t('suppliers.upiId')}
              </Label>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm font-medium text-text-primary">
                  {supplierData.upiId}
                </p>
                <CopyButton text={supplierData.upiId} />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ========================================================================
  // RATINGS & PERFORMANCE SECTION
  // ========================================================================

  const RatingsPerformanceSection = () => (
    <div className="space-y-4 p-4">
      {/* Overall Rating */}
      <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs text-text-secondary">
              {t('suppliers.overallRating')}
            </Label>
            <div className="mt-2">
              <RatingStars rating={supplierData.rating || 0} />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setManagementAction('update-rating')
              setIsManagementModalOpen(true)
            }}
          >
            {t('suppliers.updateRating')}
          </Button>
        </div>
      </div>

      {/* Individual Ratings */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Quality Rating */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Award className="h-3 w-3" />
            {t('suppliers.qualityRating')}
          </Label>
          <RatingStars rating={supplierData.qualityRating || 0} />
        </div>

        {/* Delivery Rating */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <Package className="h-3 w-3" />
            {t('suppliers.deliveryRating')}
          </Label>
          <RatingStars rating={supplierData.deliveryRating || 0} />
        </div>

        {/* Price Rating */}
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <DollarSign className="h-3 w-3" />
            {t('suppliers.priceRating')}
          </Label>
          <RatingStars rating={supplierData.priceRating || 0} />
        </div>
      </div>

      {/* Performance Statistics */}
      <div className="border-t border-border-secondary pt-4">
        <Label className="mb-3 flex items-center gap-2 text-xs text-text-secondary">
          <Activity className="h-4 w-4" />
          {t('suppliers.performanceStatistics')}
        </Label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Orders */}
          <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
            <p className="text-xs text-text-secondary">
              {t('suppliers.totalOrders')}
            </p>
            <p className="mt-1 text-2xl font-bold text-text-primary">
              {supplierData.statistics.totalOrders}
            </p>
          </div>

          {/* Completed Orders */}
          <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
            <p className="text-xs text-text-secondary">
              {t('suppliers.completedOrders')}
            </p>
            <p className="mt-1 text-2xl font-bold text-status-success">
              {supplierData.statistics.completedOrders}
            </p>
          </div>

          {/* Pending Orders */}
          <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
            <p className="text-xs text-text-secondary">
              {t('suppliers.pendingOrders')}
            </p>
            <p className="mt-1 text-2xl font-bold text-status-warning">
              {supplierData.statistics.pendingOrders}
            </p>
          </div>

          {/* Cancelled Orders */}
          <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
            <p className="text-xs text-text-secondary">
              {t('suppliers.cancelledOrders')}
            </p>
            <p className="mt-1 text-2xl font-bold text-status-error">
              {supplierData.statistics.cancelledOrders}
            </p>
          </div>

          {/* Average Order Value */}
          <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
            <p className="text-xs text-text-secondary">
              {t('suppliers.avgOrderValue')}
            </p>
            <p className="mt-1 text-xl font-bold text-text-primary">
              ₹
              {supplierData.statistics.averageOrderValue.toLocaleString(
                'en-IN'
              )}
            </p>
          </div>

          {/* Average Delivery Time */}
          <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
            <p className="text-xs text-text-secondary">
              {t('suppliers.avgDeliveryTime')}
            </p>
            <p className="mt-1 text-xl font-bold text-text-primary">
              {supplierData.statistics.averageDeliveryTime} {t('supplier.days')}
            </p>
          </div>

          {/* On-Time Delivery */}
          <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
            <p className="text-xs text-text-secondary">
              {t('suppliers.onTimeDelivery')}
            </p>
            <p className="mt-1 text-xl font-bold text-status-success">
              {supplierData.statistics.onTimeDeliveryPercentage}%
            </p>
          </div>

          {/* Last Order Date */}
          {supplierData.statistics.lastOrderDate && (
            <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
              <p className="text-xs text-text-secondary">
                {t('suppliers.lastOrderDate')}
              </p>
              <p className="mt-1 text-sm font-medium text-text-primary">
                {new Date(
                  supplierData.statistics.lastOrderDate
                ).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // ========================================================================
  // NOTES & DOCUMENTS SECTION
  // ========================================================================

  const NotesDocumentsSection = () => (
    <div className="space-y-4 p-4">
      {/* Public Notes */}
      {supplierData.notes && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-text-secondary">
            {t('suppliers.notes')}
          </Label>
          <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
            <p className="text-sm text-text-primary">{supplierData.notes}</p>
          </div>
        </div>
      )}

      {/* Internal Notes */}
      {supplierData.internalNotes && (
        <div className="flex flex-col gap-1.5">
          <Label className="flex items-center gap-2 text-xs text-text-secondary">
            <AlertCircle className="h-3 w-3" />
            {t('suppliers.internalNotes')}
          </Label>
          <div className="rounded-lg border border-status-warning bg-bg-tertiary p-3">
            <p className="text-sm text-text-primary">
              {supplierData.internalNotes}
            </p>
          </div>
        </div>
      )}

      {/* Documents */}
      {supplierData.documents && supplierData.documents.length > 0 && (
        <div className="border-t border-border-secondary pt-4">
          <Label className="mb-3 flex items-center gap-2 text-xs text-text-secondary">
            <FileText className="h-4 w-4" />
            {t('suppliers.documentsText')}
          </Label>
          <div className="space-y-2">
            {supplierData.documents.map(doc => (
              <div
                key={doc._id}
                className="flex items-center justify-between rounded-lg border border-border-secondary bg-bg-tertiary p-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-text-secondary" />
                  <div>
                    <p className="text-sm font-medium capitalize text-text-primary">
                      {doc.documentType.replace('_', ' ')}
                    </p>
                    {doc.documentNumber && (
                      <p className="text-xs text-text-tertiary">
                        {doc.documentNumber}
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  {t('suppliers.view')}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="border-t border-border-secondary pt-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs text-text-secondary">
              {t('suppliers.createdAt')}
            </p>
            <p className="mt-1 text-sm text-text-primary">
              {new Date(supplierData.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">
              {t('suppliers.updatedAt')}
            </p>
            <p className="mt-1 text-sm text-text-primary">
              {new Date(supplierData.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  // ========================================================================
  // RENDER MAIN ACCORDION
  // ========================================================================

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
      {/* Accordion Sections */}
      <Accordion
        type="multiple"
        defaultValue={['basic', 'contact']}
        variant="separated"
        size="md"
      >
        {/* Basic Information */}
        <AccordionItem value="basic">
          <AccordionTrigger icon={<Store className="h-5 w-5" />}>
            {t('suppliers.basicInformation')}
          </AccordionTrigger>
          <AccordionContent>
            <BasicInfoSection />
          </AccordionContent>
        </AccordionItem>

        {/* Contact Person */}
        <AccordionItem value="contact">
          <AccordionTrigger icon={<User className="h-5 w-5" />}>
            {t('suppliers.contactPerson')}
          </AccordionTrigger>
          <AccordionContent>
            <ContactPersonSection />
          </AccordionContent>
        </AccordionItem>

        {/* Address */}
        <AccordionItem value="address">
          <AccordionTrigger icon={<MapPin className="h-5 w-5" />}>
            {t('suppliers.address')}
          </AccordionTrigger>
          <AccordionContent>
            <AddressSection />
          </AccordionContent>
        </AccordionItem>

        {/* Business Registration */}
        <AccordionItem value="business">
          <AccordionTrigger icon={<FileText className="h-5 w-5" />}>
            {t('suppliers.businessRegistration')}
          </AccordionTrigger>
          <AccordionContent>
            <BusinessRegistrationSection />
          </AccordionContent>
        </AccordionItem>

        {/* Payment Terms */}
        <AccordionItem value="payment">
          <AccordionTrigger icon={<CreditCard className="h-5 w-5" />}>
            {t('suppliers.paymentTermstext')}
          </AccordionTrigger>
          <AccordionContent>
            <PaymentTermsSection />
          </AccordionContent>
        </AccordionItem>

        {/* Bank Details */}
        <AccordionItem value="bank">
          <AccordionTrigger icon={<Building2 className="h-5 w-5" />}>
            {t('suppliers.bankDetails')}
          </AccordionTrigger>
          <AccordionContent>
            <BankDetailsSection />
          </AccordionContent>
        </AccordionItem>

        {/* Ratings & Performance */}
        <AccordionItem value="ratings">
          <AccordionTrigger icon={<Star className="h-5 w-5" />}>
            {t('suppliers.ratingsPerformance')}
          </AccordionTrigger>
          <AccordionContent>
            <RatingsPerformanceSection />
          </AccordionContent>
        </AccordionItem>

        {/* Notes & Documents */}
        <AccordionItem value="notes">
          <AccordionTrigger icon={<FileText className="h-5 w-5" />}>
            {t('suppliers.notesDocuments')}
          </AccordionTrigger>
          <AccordionContent>
            <NotesDocumentsSection />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* Management Modal */}
      <SupplierManagementModal
        open={isManagementModalOpen}
        onOpenChange={setIsManagementModalOpen}
        supplier={supplierData}
        action={managementAction}
        onSuccess={handleManagementSuccess}
      />
    </div>
  )
}

export default SupplierOverviewTab
