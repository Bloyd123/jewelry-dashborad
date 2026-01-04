//
// FILE: src/components/sales/SalesDetailPage/tabs/DocumentsTab.tsx
// Sales Documents Tab Component with Upload & Preview
//

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Upload,
  File,
  Image,
  FileCheck,
  Shield,
  Plus,
  Calendar,
  ExternalLink,
  Printer,
  Send,
} from 'lucide-react'
import { DataTable } from '@/components/ui/data-display/DataTable/DataTable'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/overlay/Sheet/Sheet'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable/DataTable.types'

//
// COMPONENT PROPS
//

interface DocumentsTabProps {
  documents: Document[]
  saleId: string
  onUploadDocument?: (documentData: DocumentUploadData) => Promise<void>
  onDeleteDocument?: (documentId: string) => Promise<void>
}

interface Document {
  _id?: string
  documentType:
    | 'invoice'
    | 'receipt'
    | 'estimate'
    | 'certificate'
    | 'warranty'
    | 'other'
  documentUrl: string
  documentNumber?: string
  uploadedAt: string
}

interface DocumentUploadData {
  documentType: string
  documentUrl: string
  documentNumber?: string
  file?: File
}

//
// UPLOAD DOCUMENT FORM COMPONENT
//

const UploadDocumentForm: React.FC<{
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: DocumentUploadData) => Promise<void>
}> = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<DocumentUploadData>({
    documentType: 'other',
    documentUrl: '',
    documentNumber: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // In real app, upload to cloud storage and get URL
      const fakeUrl = URL.createObjectURL(file)
      setFormData({ ...formData, documentUrl: fakeUrl, file })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
      setFormData({
        documentType: 'other',
        documentUrl: '',
        documentNumber: '',
      })
      setSelectedFile(null)
    } catch (error) {
      console.error('Document upload error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent size="md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-accent" />
            {t('sales.documents.uploadDocument')}
          </SheetTitle>
          <SheetDescription>
            {t('sales.documents.uploadDescription')}
          </SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Document Type */}
            <div className="space-y-2">
              <Label htmlFor="documentType" className="text-sm font-medium">
                {t('sales.documents.documentType')}{' '}
                <span className="text-status-error">*</span>
              </Label>
              <Select
                value={formData.documentType}
                onValueChange={value =>
                  setFormData({ ...formData, documentType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoice">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t('sales.documentType.invoice')}
                    </div>
                  </SelectItem>
                  <SelectItem value="receipt">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      {t('sales.documentType.receipt')}
                    </div>
                  </SelectItem>
                  <SelectItem value="estimate">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t('sales.documentType.estimate')}
                    </div>
                  </SelectItem>
                  <SelectItem value="certificate">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {t('sales.documentType.certificate')}
                    </div>
                  </SelectItem>
                  <SelectItem value="warranty">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      {t('sales.documentType.warranty')}
                    </div>
                  </SelectItem>
                  <SelectItem value="other">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      {t('sales.documentType.other')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Document Number */}
            <div className="space-y-2">
              <Label htmlFor="documentNumber" className="text-sm font-medium">
                {t('sales.documents.documentNumber')}
              </Label>
              <Input
                id="documentNumber"
                type="text"
                placeholder={t('sales.documents.enterDocumentNumber')}
                value={formData.documentNumber}
                onChange={e =>
                  setFormData({ ...formData, documentNumber: e.target.value })
                }
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file" className="text-sm font-medium">
                {t('sales.documents.uploadFile')}{' '}
                <span className="text-status-error">*</span>
              </Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  required
                />
                {selectedFile && (
                  <div className="flex items-center gap-2 rounded-md border border-border-secondary bg-bg-tertiary p-2 text-sm">
                    <File className="h-4 w-4 text-accent" />
                    <span className="flex-1 truncate text-text-primary">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-text-tertiary">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-text-tertiary">
                {t('sales.documents.supportedFormats')}
              </p>
            </div>
          </form>
        </SheetBody>

        <SheetFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !selectedFile}>
            {loading && <span className="mr-2">...</span>}
            <Upload className="mr-2 h-4 w-4" />
            {t('sales.documents.upload')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

//
// MAIN COMPONENT
//

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  saleId,
  onUploadDocument,
  onDeleteDocument,
}) => {
  const { t } = useTranslation()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  )

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Get document icon
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return FileText
      case 'receipt':
        return FileCheck
      case 'certificate':
        return Shield
      case 'warranty':
        return FileCheck
      case 'estimate':
        return FileText
      default:
        return File
    }
  }

  // Get document type badge
  const getDocumentTypeBadge = (type: string) => {
    switch (type) {
      case 'invoice':
        return 'default'
      case 'receipt':
        return 'success'
      case 'certificate':
        return 'info'
      case 'warranty':
        return 'warning'
      default:
        return 'outline'
    }
  }

  // Calculate statistics
  const stats = {
    total: documents.length,
    invoices: documents.filter(d => d.documentType === 'invoice').length,
    receipts: documents.filter(d => d.documentType === 'receipt').length,
    certificates: documents.filter(d => d.documentType === 'certificate')
      .length,
  }

  // Define table columns
  const columns: DataTableColumn<Document>[] = [
    {
      id: 'documentType',
      header: t('sales.documents.documentType'),
      accessorKey: 'documentType',
      sortable: true,
      cell: ({ row }) => {
        const Icon = getDocumentIcon(row.documentType)
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-accent" />
            <Badge
              variant={getDocumentTypeBadge(row.documentType) as any}
              size="sm"
            >
              {t(`sales.documentType.${row.documentType}`)}
            </Badge>
          </div>
        )
      },
    },
    {
      id: 'documentNumber',
      header: t('sales.documents.documentNumber'),
      accessorKey: 'documentNumber',
      sortable: true,
      cell: ({ value }) => (
        <span className="font-mono text-sm text-text-primary">
          {value || '-'}
        </span>
      ),
    },
    {
      id: 'uploadedAt',
      header: t('sales.documents.uploadedAt'),
      accessorKey: 'uploadedAt',
      sortable: true,
      cell: ({ value }) => (
        <span className="text-sm text-text-secondary">{formatDate(value)}</span>
      ),
    },
    {
      id: 'actions',
      header: t('sales.documents.actions'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(row)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            {t('sales.documents.view')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDownload(row)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {t('sales.documents.download')}
          </Button>
        </div>
      ),
    },
  ]

  // Row actions
  const rowActions = [
    {
      label: t('sales.documents.view'),
      icon: <Eye className="h-4 w-4" />,
      onClick: (doc: Document) => handleView(doc),
    },
    {
      label: t('sales.documents.download'),
      icon: <Download className="h-4 w-4" />,
      onClick: (doc: Document) => handleDownload(doc),
    },
    {
      label: t('sales.documents.print'),
      icon: <Printer className="h-4 w-4" />,
      onClick: (doc: Document) => handlePrint(doc),
    },
    {
      label: t('sales.documents.send'),
      icon: <Send className="h-4 w-4" />,
      onClick: (doc: Document) => handleSend(doc),
    },
    {
      label: t('sales.documents.delete'),
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (doc: Document) => {
        setSelectedDocument(doc)
        setDeleteDialogOpen(true)
      },
      variant: 'destructive' as const,
    },
  ]

  const handleView = (doc: Document) => {
    window.open(doc.documentUrl, '_blank')
  }

  const handleDownload = (doc: Document) => {
    const link = document.createElement('a')
    link.href = doc.documentUrl
    link.download = `${doc.documentType}-${doc.documentNumber || 'document'}`
    link.click()
  }

  const handlePrint = (doc: Document) => {
    const printWindow = window.open(doc.documentUrl, '_blank')
    printWindow?.print()
  }

  const handleSend = (doc: Document) => {
    console.log('Send document:', doc)
    // TODO: Implement send document via email/whatsapp
  }

  const handleUpload = async (data: DocumentUploadData) => {
    if (onUploadDocument) {
      await onUploadDocument(data)
    }
    console.log('Document uploaded:', data)
  }

  const handleDelete = async () => {
    if (selectedDocument?._id && onDeleteDocument) {
      await onDeleteDocument(selectedDocument._id)
    }
    setDeleteDialogOpen(false)
    setSelectedDocument(null)
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <StatCardGrid columns={4} gap="md">
        <StatCard
          title={t('sales.documents.totalDocuments')}
          value={stats.total}
          icon={FileText}
          variant="default"
          size="md"
        />

        <StatCard
          title={t('sales.documents.invoices')}
          value={stats.invoices}
          icon={FileText}
          variant="info"
          size="md"
        />

        <StatCard
          title={t('sales.documents.receipts')}
          value={stats.receipts}
          icon={FileCheck}
          variant="success"
          size="md"
        />

        <StatCard
          title={t('sales.documents.certificates')}
          value={stats.certificates}
          icon={Shield}
          variant="warning"
          size="md"
        />
      </StatCardGrid>

      {/* Header with Upload Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {t('sales.documents.documentsList')}
          </h3>
          <p className="text-sm text-text-tertiary">
            {t('sales.documents.manageDocuments')}
          </p>
        </div>

        <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
          <Plus className="h-5 w-5" />
          {t('sales.documents.uploadDocument')}
        </Button>
      </div>

      {/* Documents Table */}
      <DataTable
        data={documents}
        columns={columns}
        rowActions={{
          enabled: true,
          actions: rowActions,
          position: 'end',
        }}
        style={{
          variant: 'bordered',
          size: 'md',
          hoverEffect: true,
          zebraStripes: true,
        }}
        pagination={{
          enabled: documents.length > 10,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
        }}
        sorting={{
          enabled: true,
        }}
        emptyState={{
          message: t('sales.documents.noDocuments'),
          icon: <FileText className="h-12 w-12" />,
          action: {
            label: t('sales.documents.uploadFirst'),
            onClick: () => setIsUploadOpen(true),
          },
        }}
      />

      {/* Upload Document Sheet */}
      <UploadDocumentForm
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleUpload}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        variant="danger"
        title={t('sales.documents.deleteConfirmTitle')}
        description={t('sales.documents.deleteConfirmDescription')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setSelectedDocument(null)
        }}
      />
    </div>
  )
}

export default DocumentsTab
