// FILE: src/components/customer/CustomerPage/tabs/DocumentsTab.tsx

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Eye, Upload, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Label } from '@/components/ui/label'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/overlay/Modal'
import type { Customer } from '@/types/customer.types'
import { useCustomerDocuments } from '@/hooks/customer'
import { useAuth } from '@/hooks/auth'

interface DocumentsTabProps {
  customer: Customer
}

const DOCUMENT_TYPES = [
  'aadhar',
  'pan',
  'passport',
  'driving_license',
  'voter_id',
  'other',
]

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ customer }) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()

  const { documents, isLoading } = useCustomerDocuments(
    currentShopId!,
    customer._id
  )

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    documentType: 'aadhar',
    documentUrl:  '',
    documentNumber: '',
  })
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadSubmit = async () => {
    // TODO: API call here baad mein
    setIsUploading(true)
    console.log('Upload:', uploadForm)
    setTimeout(() => {
      setIsUploading(false)
      setIsUploadModalOpen(false)
      setUploadForm({ documentType: 'aadhar', documentUrl: '', documentNumber: '' })
    }, 1000)
  }

  const handleUploadClose = () => {
    setIsUploadModalOpen(false)
    setUploadForm({ documentType: 'aadhar', documentUrl: '', documentNumber: '' })
  }

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
          <Button
            variant="default"
            className="gap-2"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload className="h-4 w-4" />
            {t('customerDocuments.upload')}
          </Button>
        </div>
      </div>

      {/* KYC Section */}
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

      {/* Uploaded Documents */}
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

      {/* Upload Modal */}
      <Modal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        size="md"
      >
        <ModalHeader
          title="customerDocuments.uploadModal.title"
          description="customerDocuments.uploadModal.description"
        />

        <ModalBody>
          <div className="space-y-4">

            {/* Document Type */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-text-primary">
                {t('customerDocuments.uploadModal.documentType')}
                <span className="ml-1 text-status-error">*</span>
              </Label>
              <select
                value={uploadForm.documentType}
                onChange={e =>
                  setUploadForm(prev => ({ ...prev, documentType: e.target.value }))
                }
                className="w-full rounded-md border border-border-primary bg-bg-secondary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
              >
                {DOCUMENT_TYPES.map(type => (
                  <option key={type} value={type}>
                    {t(`customerDocuments.types.${type}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Document Number */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-text-primary">
                {t('customerDocuments.uploadModal.documentNumber')}
              </Label>
              <input
                type="text"
                value={uploadForm.documentNumber}
                onChange={e =>
                  setUploadForm(prev => ({ ...prev, documentNumber: e.target.value }))
                }
                placeholder={t('customerDocuments.uploadModal.documentNumberPlaceholder')}
                className="w-full rounded-md border border-border-primary bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
              />
            </div>

            {/* Document URL */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-text-primary">
                {t('customerDocuments.uploadModal.documentUrl')}
                <span className="ml-1 text-status-error">*</span>
              </Label>
              <input
                type="url"
                value={uploadForm.documentUrl}
                onChange={e =>
                  setUploadForm(prev => ({ ...prev, documentUrl: e.target.value }))
                }
                placeholder="https://..."
                className="w-full rounded-md border border-border-primary bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
              />
              <p className="text-xs text-text-tertiary">
                {t('customerDocuments.uploadModal.documentUrlHint')}
              </p>
            </div>

          </div>
        </ModalBody>

        <ModalFooter align="right">
          <Button
            variant="outline"
            onClick={handleUploadClose}
            disabled={isUploading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="default"
            onClick={handleUploadSubmit}
            disabled={!uploadForm.documentUrl || isUploading}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {isUploading
              ? t('customerDocuments.uploadModal.uploading')
              : t('customerDocuments.uploadModal.upload')}
          </Button>
        </ModalFooter>
      </Modal>

    </div>
  )
}

export default DocumentsTab