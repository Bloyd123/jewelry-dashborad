import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Building2, 
  Wallet, 
  Star, 
  Copy, 
  Eye, 
  EyeOff,
  Download,
  QrCode,
  Plus
} from 'lucide-react';
import { Badge } from '@/components/ui/data-display/Badge/Badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/layout/Accordion/Accordion';
import { Separator } from '@/components/ui/layout/Separator/Separator';
import { Label } from '@/components/ui/label';
import type { BankDetail, UpiDetail } from '@/types/shop.types';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface BankDetailsTabProps {
  bankDetails?: BankDetail[];
  upiDetails?: UpiDetail[];
  isAdminView?: boolean;
}

// ============================================================================
// BANK DETAILS TAB COMPONENT
// ============================================================================

export const BankDetailsTab: React.FC<BankDetailsTabProps> = ({
  bankDetails = [],
  upiDetails = [],
  isAdminView = true,
}) => {
  const { t } = useTranslation();
  const [visibleAccounts, setVisibleAccounts] = useState<Record<string, boolean>>({});

  // Toggle account number visibility
  const toggleAccountVisibility = (id: string) => {
    setVisibleAccounts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Mask account number
  const maskAccountNumber = (accountNumber: string, isVisible: boolean) => {
    if (isVisible) return accountNumber;
    return '●●●●●●' + accountNumber.slice(-4);
  };

  // Copy to clipboard
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    console.log(`${type} copied to clipboard`);
  };

  // Download QR code (placeholder)
  const handleDownloadQR = (upiId: string) => {
    console.log(`Download QR for ${upiId}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Bank Accounts Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10">
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
              <Plus className="h-4 w-4 mr-2" />
              {t('bankDetails.addBank')}
            </Button>
          )}
        </div>

        <Accordion type="multiple" variant="separated" size="md">
          {bankDetails.map((bank) => {
            const bankId = bank._id || '';
            return (
              <AccordionItem key={bankId} value={bankId}>
                <AccordionTrigger
                  icon={<Building2 className="h-5 w-5" />}
                  badge={
                    <div className="flex gap-2">
                      {bank.isPrimary && (
                        <Badge variant="accent" size="sm">
                          <Star className="h-3 w-3 mr-1" />
                          {t('bankDetails.primary')}
                        </Badge>
                      )}
                      <Badge 
                        variant={bank.isActive ? 'active' : 'inactive'} 
                        size="sm"
                      >
                        {bank.isActive ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </div>
                  }
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary">
                      {bank.bankName}
                    </span>
                    <span className="text-sm text-text-tertiary">
                      {maskAccountNumber(bank.accountNumber, visibleAccounts[bankId])}
                    </span>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent>
                  <div className="space-y-4">
                    {/* Account Number */}
                    <div>
                      <Label className="text-text-tertiary mb-2">
                        {t('bankDetails.accountNumber')}
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 rounded-md bg-bg-tertiary text-text-primary font-mono">
                          {maskAccountNumber(bank.accountNumber, visibleAccounts[bankId])}
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
                          onClick={() => handleCopy(bank.accountNumber, 'Account number')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* IFSC Code */}
                    <div>
                      <Label className="text-text-tertiary mb-2">
                        {t('bankDetails.ifscCode')}
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 rounded-md bg-bg-tertiary text-text-primary font-mono">
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
                      <Label className="text-text-tertiary mb-2">
                        {t('bankDetails.accountHolder')}
                      </Label>
                      <div className="px-3 py-2 rounded-md bg-bg-tertiary text-text-primary">
                        {bank.accountHolderName}
                      </div>
                    </div>

                    <Separator />

                    {/* Branch & Account Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bank.branchName && (
                        <div>
                          <Label className="text-text-tertiary mb-2">
                            {t('bankDetails.branch')}
                          </Label>
                          <div className="px-3 py-2 rounded-md bg-bg-tertiary text-text-primary">
                            {bank.branchName}
                          </div>
                        </div>
                      )}
                      {bank.accountType && (
                        <div>
                          <Label className="text-text-tertiary mb-2">
                            {t('bankDetails.accountType')}
                          </Label>
                          <div className="px-3 py-2 rounded-md bg-bg-tertiary text-text-primary capitalize">
                            {bank.accountType}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {bankDetails.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border-secondary rounded-lg">
            <Building2 className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-text-secondary mb-2">
              {t('bankDetails.noBankAccounts')}
            </p>
            {isAdminView && (
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t('bankDetails.addFirstBank')}
              </Button>
            )}
          </div>
        )}
      </div>

      <Separator spacing="lg" />

      {/* UPI Details Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10">
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
              <Plus className="h-4 w-4 mr-2" />
              {t('bankDetails.addUPI')}
            </Button>
          )}
        </div>

        <Accordion type="multiple" variant="separated" size="md">
          {upiDetails.map((upi) => {
            const upiId = upi._id || '';
            return (
              <AccordionItem key={upiId} value={upiId}>
                <AccordionTrigger
                  icon={<Wallet className="h-5 w-5" />}
                  badge={
                    <div className="flex gap-2">
                      {upi.isPrimary && (
                        <Badge variant="accent" size="sm">
                          <Star className="h-3 w-3 mr-1" />
                          {t('bankDetails.primary')}
                        </Badge>
                      )}
                      <Badge 
                        variant={upi.isActive ? 'active' : 'inactive'} 
                        size="sm"
                      >
                        {upi.isActive ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </div>
                  }
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary">
                      {upi.name || 'UPI Account'}
                    </span>
                    <span className="text-sm text-text-tertiary font-mono">
                      {upi.upiId}
                    </span>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent>
                  <div className="space-y-4">
                    {/* UPI ID */}
                    <div>
                      <Label className="text-text-tertiary mb-2">
                        {t('bankDetails.upiId')}
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 rounded-md bg-bg-tertiary text-text-primary font-mono">
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
                        <Copy className="h-4 w-4 mr-2" />
                        {t('bankDetails.copyUPI')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadQR(upi.upiId)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {t('bankDetails.downloadQR')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        {t('bankDetails.viewQR')}
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {upiDetails.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border-secondary rounded-lg">
            <Wallet className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-text-secondary mb-2">
              {t('bankDetails.noUPIDetails')}
            </p>
            {isAdminView && (
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t('bankDetails.addFirstUPI')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Admin Only Notice */}
      {!isAdminView && (
        <div className="mt-6 p-4 rounded-lg bg-bg-tertiary border border-border-secondary">
          <p className="text-sm text-text-tertiary text-center">
            {t('bankDetails.adminOnlyNotice')}
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// TRANSLATION KEYS STRUCTURE
// ============================================================================

/*
{
  "bankDetails": {
    "bankAccounts": {
      "title": "Bank Accounts",
      "subtitle": "Manage your bank account details"
    },
    "upiDetails": {
      "title": "UPI Details",
      "subtitle": "Manage your UPI payment methods"
    },
    "primary": "Primary",
    "addBank": "Add Bank",
    "addUPI": "Add UPI",
    "accountNumber": "Account Number",
    "ifscCode": "IFSC Code",
    "accountHolder": "Account Holder Name",
    "branch": "Branch",
    "accountType": "Account Type",
    "upiId": "UPI ID",
    "copyUPI": "Copy UPI ID",
    "downloadQR": "Download QR",
    "viewQR": "View QR Code",
    "noBankAccounts": "No bank accounts added yet",
    "noUPIDetails": "No UPI details added yet",
    "addFirstBank": "Add Your First Bank Account",
    "addFirstUPI": "Add Your First UPI",
    "adminOnlyNotice": "Bank and UPI details are only visible to administrators"
  },
  "common": {
    "active": "Active",
    "inactive": "Inactive"
  }
}
*/

export default BankDetailsTab;