// FILE: ssrc/components/customer/CustomerPage/tabs/DocumentsTab.tsx
// Documents Tab

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  FileText,
  Download,
  Eye,
  Upload,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Label } from '@/components/ui/label'
import { MOCK_CUSTOMERS } from '@/pages/customer/AddCustomer/mockdata'
import type { Customer } from '@/types/customer.types'

// MOCK DOCUMENTS DATA

interface Document {
  id: string
  type: string
  name: string
  uploadedDate: string
  size: string
  verified: boolean
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    type: 'aadhar',
    name: 'Aadhar_Card.pdf',
    uploadedDate: '2024-01-15',
    size: '2.4 MB',
    verified: true,
  },
  {
    id: '2',
    type: 'pan',
    name: 'PAN_Card.pdf',
    uploadedDate: '2024-01-15',
    size: '1.8 MB',
    verified: true,
  },
  {
    id: '3',
    type: 'photo',
    name: 'Profile_Photo.jpg',
    uploadedDate: '2024-01-15',
    size: '856 KB',
    verified: false,
  },
]

// COMPONENT PROPS

interface DocumentsTabProps {
  customerId?: string
}

// DOCUMENTS TAB COMPONENT

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ customerId }) => {
  const { t } = useTranslation()

  // Get customer data from mock
  const customer: Customer = customerId
    ? MOCK_CUSTOMERS.find(c => c._id === customerId) || MOCK_CUSTOMERS[0]
    : MOCK_CUSTOMERS[0]

  const handleDownload = (doc: Document) => {
    console.log('Download:', doc.name)
  }

  const handleView = (doc: Document) => {
    console.log('View:', doc.name)
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

      {/* KYC Documents Summary */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          {t('customerDocuments.kycDocuments')}
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Aadhar Number */}
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

          {/* PAN Number */}
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

          {/* GST Number */}
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

      {/* Uploaded Documents */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          {t('customerDocuments.uploadedDocuments')}
        </h3>

        <div className="space-y-3">
          {MOCK_DOCUMENTS.map(doc => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border border-border-secondary bg-bg-primary p-4"
            >
              <div className="flex items-center gap-3">
                <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  {doc.type === 'photo' ? (
                    <ImageIcon className="h-5 w-5 text-accent" />
                  ) : (
                    <FileText className="h-5 w-5 text-accent" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary">
                      {doc.name}
                    </p>
                    {doc.verified && (
                      <Badge variant="success" size="sm">
                        {t('customerDocuments.verified')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-tertiary">
                    {t('customerDocuments.uploaded')}:{' '}
                    {new Date(doc.uploadedDate).toLocaleDateString()} •{' '}
                    {doc.size}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleView(doc)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {t('customerDocuments.view')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(doc)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t('customerDocuments.download')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DocumentsTab
