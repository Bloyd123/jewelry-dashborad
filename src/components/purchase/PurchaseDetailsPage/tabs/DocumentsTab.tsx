// FILE: src/components/purchase/PurchaseDetailPage/tabs/DocumentsTab.tsx

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Upload, Eye, Download, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Label } from '@/components/ui/label'
import { usePurchaseDocuments } from '@/hooks/purchase/usePurchaseDocuments'
import type { IPurchase, DocumentType } from '@/types/purchase.types'

interface DocumentsTabProps {
  purchase:   IPurchase
  shopId:     string
  purchaseId: string
}

const docTypeIcon: Record<DocumentType, string> = {
  invoice:       '📄',
  receipt:       '🧾',
  delivery_note: '📋',
  certificate:   '🏆',
  other:         '📁',
}

const docTypeVariant: Record<DocumentType, string> = {
  invoice:       'info',
  receipt:       'success',
  delivery_note: 'default',
  certificate:   'warning',
  other:         'default',
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  purchase,
  shopId,
  purchaseId,
}) => {
  const { t } = useTranslation()
  const [showForm,  setShowForm]  = useState(false)
  const [formData,  setFormData]  = useState({
    documentType:   'invoice' as DocumentType,
    documentUrl:    '',
    documentNumber: '',
  })

  const { documents, isLoading, isUploading, canUploadMore, uploadDocument } =
    usePurchaseDocuments(shopId, purchaseId)

  const handleUpload = async () => {
    if (!formData.documentUrl) return
    const result = await uploadDocument(
      formData.documentType,
      formData.documentUrl,
      formData.documentNumber
    )
    if (result.success) {
      setShowForm(false)
      setFormData({ documentType: 'invoice', documentUrl: '', documentNumber: '' })
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">

      {/* ── Header ── */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Purchase Documents</h3>
            <p className="text-xs text-text-secondary mt-1">
              Max 10 documents allowed • {documents.length}/10 uploaded
            </p>
          </div>
          {canUploadMore && (
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={() => setShowForm(prev => !prev)}
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          )}
        </div>
      </div>

      {/* ── Upload Form ── */}
      {showForm && (
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Upload New Document</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="text-xs text-text-secondary">Document Type *</Label>
              <select
                value={formData.documentType}
                onChange={e => setFormData(prev => ({ ...prev, documentType: e.target.value as DocumentType }))}
                className="mt-1 w-full rounded-md border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {(['invoice', 'receipt', 'delivery_note', 'certificate', 'other'] as DocumentType[]).map(type => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs text-text-secondary">Document Number</Label>
              <input
                type="text"
                value={formData.documentNumber}
                onChange={e => setFormData(prev => ({ ...prev, documentNumber: e.target.value }))}
                placeholder="INV/2024/1234"
                className="mt-1 w-full rounded-md border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="md:col-span-2">
              <Label className="text-xs text-text-secondary">Document URL *</Label>
              <input
                type="url"
                value={formData.documentUrl}
                onChange={e => setFormData(prev => ({ ...prev, documentUrl: e.target.value }))}
                placeholder="https://storage.example.com/doc.pdf"
                className="mt-1 w-full rounded-md border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <p className="text-xs text-text-tertiary mt-1">
                Upload file to storage first, then paste URL here
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button
              size="sm"
              onClick={handleUpload}
              disabled={isUploading || !formData.documentUrl}
            >
              {isUploading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</>
                : 'Upload Document'
              }
            </Button>
          </div>
        </div>
      )}

      {/* ── Documents List ── */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">
          Documents ({isLoading ? '...' : documents.length})
        </h3>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <FileText className="h-10 w-10 text-text-tertiary" />
            <p className="text-sm text-text-tertiary">No documents uploaded yet</p>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowForm(true)}>
              <Upload className="h-4 w-4" />
              Upload your first document
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-secondary text-left">
                  {['Type', 'Number', 'Uploaded', 'Actions'].map(h => (
                    <th key={h} className="pb-2 pr-4 text-xs font-medium text-text-secondary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-secondary">
                {documents.map((doc: any, idx: number) => (
                  <tr key={doc._id ?? idx} className="hover:bg-bg-tertiary transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{docTypeIcon[doc.documentType as DocumentType] ?? '📁'}</span>
                        <Badge
                          variant={docTypeVariant[doc.documentType as DocumentType] as any ?? 'default'}
                          size="sm"
                        >
                          {doc.documentType}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-text-secondary">
                      {doc.documentNumber ?? '-'}
                    </td>
                    <td className="py-3 pr-4 text-text-secondary">
                      {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(doc.documentUrl, '_blank')}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(doc.documentUrl, '_blank')}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentsTab