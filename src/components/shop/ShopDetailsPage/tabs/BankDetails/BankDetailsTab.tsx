import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Building2,
  Wallet,
  Star,
  Copy,
  Eye,
  EyeOff,
  Download,
  QrCode,
  Plus,
} from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/layout/Accordion/Accordion'
import { Separator } from '@/components/ui/layout/Separator/Separator'
import { Label } from '@/components/ui/label'
import type { BankDetail, UpiDetail } from '@/types/shop.types'

//
// COMPONENT PROPS
//

interface BankDetailsTabProps {
  bankDetails?: BankDetail[]
  upiDetails?: UpiDetail[]
  isAdminView?: boolean
}

//
// BANK DETAILS TAB COMPONENT
//

export const BankDetailsTab: React.FC<BankDetailsTabProps> = ({
  bankDetails = [],
  upiDetails = [],
  isAdminView = true,
}) => {
  const { t } = useTranslation()
  const [visibleAccounts, setVisibleAccounts] = useState<
    Record<string, boolean>
  >({})

  // Toggle account number visibility
  const toggleAccountVisibility = (id: string) => {
    setVisibleAccounts(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Mask account number
  const maskAccountNumber = (accountNumber: string, isVisible: boolean) => {
    if (isVisible) return accountNumber
    return '●●●●●●' + accountNumber.slice(-4)
  }

  // Copy to clipboard
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    console.log(`${type} copied to clipboard`)
  }

  // Download QR code (placeholder)
  const handleDownloadQR = (upiId: string) => {
    console.log(`Download QR for ${upiId}`)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Bank Accounts Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Building2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {t('bankDetails.bankAccounts.title')}
              </h3>
              <p className="text-sm text-text-tertiary">
                {t('bankDetails.bankAccounts.subtitle')}
              </p>
            </div>
          </div>
          {isAdminView && (
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {t('bankDetails.addBank')}
            </Button>
          )}
        </div>

        <Accordion type="multiple" variant="separated" size="md">
          {bankDetails.map(bank => {
            const bankId = bank._id || ''
            return (
              <AccordionItem key={bankId} value={bankId}>
                <AccordionTrigger
                  icon={<Building2 className="h-5 w-5" />}
                  badge={
                    <div className="flex gap-2">
                      {bank.isPrimary && (
                        <Badge variant="accent" size="sm">
                          <Star className="mr-1 h-3 w-3" />
                          {t('bankDetails.primary')}
                        </Badge>
                      )}
                      <Badge
                        variant={bank.isActive ? 'active' : 'inactive'}
                        size="sm"
                      >
                        {bank.isActive
                          ? t('common.active')
                          : t('common.inactive')}
                      </Badge>
                    </div>
                  }
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary">
                      {bank.bankName}
                    </span>
                    <span className="text-sm text-text-tertiary">
                      {maskAccountNumber(
                        bank.accountNumber,
                        visibleAccounts[bankId]
                      )}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="space-y-4">
                    {/* Account Number */}
                    <div>
                      <Label className="mb-2 text-text-tertiary">
                        {t('bankDetails.accountNumber')}
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-md bg-bg-tertiary px-3 py-2 font-mono text-text-primary">
                          {maskAccountNumber(
                            bank.accountNumber,
                            visibleAccounts[bankId]
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleAccountVisibility(bankId)}
                        >
                          {visibleAccounts[bankId] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleCopy(bank.accountNumber, 'Account number')
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* IFSC Code */}
                    <div>
                      <Label className="mb-2 text-text-tertiary">
                        {t('bankDetails.ifscCode')}
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-md bg-bg-tertiary px-3 py-2 font-mono text-text-primary">
                          {bank.ifscCode}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(bank.ifscCode, 'IFSC code')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Account Holder */}
                    <div>
                      <Label className="mb-2 text-text-tertiary">
                        {t('bankDetails.accountHolder')}
                      </Label>
                      <div className="rounded-md bg-bg-tertiary px-3 py-2 text-text-primary">
                        {bank.accountHolderName}
                      </div>
                    </div>

                    <Separator />

                    {/* Branch & Account Type */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {bank.branchName && (
                        <div>
                          <Label className="mb-2 text-text-tertiary">
                            {t('bankDetails.branch')}
                          </Label>
                          <div className="rounded-md bg-bg-tertiary px-3 py-2 text-text-primary">
                            {bank.branchName}
                          </div>
                        </div>
                      )}
                      {bank.accountType && (
                        <div>
                          <Label className="mb-2 text-text-tertiary">
                            {t('bankDetails.accountType')}
                          </Label>
                          <div className="rounded-md bg-bg-tertiary px-3 py-2 capitalize text-text-primary">
                            {bank.accountType}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        {bankDetails.length === 0 && (
          <div className="rounded-lg border border-dashed border-border-secondary py-12 text-center">
            <Building2 className="mx-auto mb-3 h-12 w-12 text-text-tertiary" />
            <p className="mb-2 text-text-secondary">
              {t('bankDetails.noBankAccounts')}
            </p>
            {isAdminView && (
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t('bankDetails.addFirstBank')}
              </Button>
            )}
          </div>
        )}
      </div>

      <Separator spacing="lg" />

      {/* UPI Details Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Wallet className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {t('bankDetails.upiDetails.title')}
              </h3>
              <p className="text-sm text-text-tertiary">
                {t('bankDetails.upiDetails.subtitle')}
              </p>
            </div>
          </div>
          {isAdminView && (
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {t('bankDetails.addUPI')}
            </Button>
          )}
        </div>

        <Accordion type="multiple" variant="separated" size="md">
          {upiDetails.map(upi => {
            const upiId = upi._id || ''
            return (
              <AccordionItem key={upiId} value={upiId}>
                <AccordionTrigger
                  icon={<Wallet className="h-5 w-5" />}
                  badge={
                    <div className="flex gap-2">
                      {upi.isPrimary && (
                        <Badge variant="accent" size="sm">
                          <Star className="mr-1 h-3 w-3" />
                          {t('bankDetails.primary')}
                        </Badge>
                      )}
                      <Badge
                        variant={upi.isActive ? 'active' : 'inactive'}
                        size="sm"
                      >
                        {upi.isActive
                          ? t('common.active')
                          : t('common.inactive')}
                      </Badge>
                    </div>
                  }
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary">
                      {upi.name || 'UPI Account'}
                    </span>
                    <span className="font-mono text-sm text-text-tertiary">
                      {upi.upiId}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="space-y-4">
                    {/* UPI ID */}
                    <div>
                      <Label className="mb-2 text-text-tertiary">
                        {t('bankDetails.upiId')}
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-md bg-bg-tertiary px-3 py-2 font-mono text-text-primary">
                          {upi.upiId}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(upi.upiId, 'UPI ID')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(upi.upiId, 'UPI ID')}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        {t('bankDetails.copyUPI')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadQR(upi.upiId)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {t('bankDetails.downloadQR')}
                      </Button>
                      <Button variant="outline" size="sm">
                        <QrCode className="mr-2 h-4 w-4" />
                        {t('bankDetails.viewQR')}
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        {upiDetails.length === 0 && (
          <div className="rounded-lg border border-dashed border-border-secondary py-12 text-center">
            <Wallet className="mx-auto mb-3 h-12 w-12 text-text-tertiary" />
            <p className="mb-2 text-text-secondary">
              {t('bankDetails.noUPIDetails')}
            </p>
            {isAdminView && (
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t('bankDetails.addFirstUPI')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Admin Only Notice */}
      {!isAdminView && (
        <div className="mt-6 rounded-lg border border-border-secondary bg-bg-tertiary p-4">
          <p className="text-center text-sm text-text-tertiary">
            {t('bankDetails.adminOnlyNotice')}
          </p>
        </div>
      )}
    </div>
  )
}

export default BankDetailsTab
