// FILE: src/components/customer/CustomerPage/tabs/DocumentsTab.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Eye, Upload, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Label } from '@/components/ui/label'
import type { Customer } from '@/types/customer.types'
import { useCustomerDocuments } from '@/hooks/customer'
import { useAuth } from '@/hooks/auth'

interface DocumentsTabProps {
  customer: Customer
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ customer }) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()

  const { documents, isLoading } = useCustomerDocuments(
    currentShopId!,
    customer._id
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-text-tertiary">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4">

      {/* Upload Section */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {t('customerDocuments.uploadDocuments')}
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              {t('customerDocuments.uploadDescription')}
            </p>
          </div>
          <Button variant="default" className="gap-2">
            <Upload className="h-4 w-4" />
            {t('customerDocuments.upload')}
          </Button>
        </div>
      </div>

      {/* KYC Section - Customer model se aata hai */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          {t('customerDocuments.kycDocuments')}
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {customer.aadharNumber && (
            <div className="flex flex-col gap-1.5 rounded-lg border border-border-secondary bg-bg-primary p-4">
              <Label className="text-xs text-text-secondary">
                {t('customerProfile.aadharNumber')}
              </Label>
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm font-medium text-text-primary">
                  {customer.aadharNumber}
                </p>
                <Badge variant="success" size="sm">
                  {t('customerDocuments.verified')}
                </Badge>
              </div>
            </div>
          )}

          {customer.panNumber && (
            <div className="flex flex-col gap-1.5 rounded-lg border border-border-secondary bg-bg-primary p-4">
              <Label className="text-xs text-text-secondary">
                {t('customerProfile.panNumber')}
              </Label>
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm font-medium text-text-primary">
                  {customer.panNumber}
                </p>
                <Badge variant="success" size="sm">
                  {t('customerDocuments.verified')}
                </Badge>
              </div>
            </div>
          )}

          {customer.gstNumber && (
            <div className="flex flex-col gap-1.5 rounded-lg border border-border-secondary bg-bg-primary p-4 md:col-span-2">
              <Label className="text-xs text-text-secondary">
                {t('customerProfile.gstNumber')}
              </Label>
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm font-medium text-text-primary">
                  {customer.gstNumber}
                </p>
                <Badge variant="success" size="sm">
                  {t('customerDocuments.verified')}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Documents - REAL DATA */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          {t('customerDocuments.uploadedDocuments')}
        </h3>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="mb-3 h-10 w-10 text-text-tertiary" />
            <p className="text-sm text-text-tertiary">
              {t('customerDocuments.noDocuments')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc: any) => (
              <div
                key={doc._id}
                className="flex items-center justify-between rounded-lg border border-border-secondary bg-bg-primary p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    {doc.documentType === 'photo' ? (
                      <ImageIcon className="h-5 w-5 text-accent" />
                    ) : (
                      <FileText className="h-5 w-5 text-accent" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-text-primary">
                        {doc.documentType}
                      </p>
                      {doc.documentNumber && (
                        <Badge variant="default" size="sm">
                          {doc.documentNumber}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-text-tertiary">
                      {t('customerDocuments.uploaded')}:{' '}
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {doc.documentUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(doc.documentUrl, '_blank')}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {t('customerDocuments.view')}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentsTab