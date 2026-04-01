import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Plus,
  Award,
  AlertCircle,
} from 'lucide-react'
import { DataTable } from '@/components/ui/data-display/DataTable/DataTable'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/overlay/Sheet'
import type {
  DataTableColumn,
  RowAction,
} from '@/components/ui/data-display/DataTable/DataTable.types'
import type { Document, Certification, Supplier, DocumentType, CertificationType } from '@/types/supplier.types'
import { useSupplierActions } from '@/hooks/supplier'
import { useAuth } from '@/hooks/auth'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface DocumentWithStatus extends Document {
  uploadedBy?: string
}

interface CertificationWithStatus extends Certification {
  status: 'Valid' | 'Expiring Soon' | 'Expired'
}

interface SupplierDocumentsTabProps {
  supplier: Supplier
  onRefetch?: () => void
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const getCertificationStatus = (expiryDate?: string): 'Valid' | 'Expiring Soon' | 'Expired' => {
  if (!expiryDate) return 'Valid'
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (daysUntilExpiry < 0) return 'Expired'
  if (daysUntilExpiry <= 90) return 'Expiring Soon'
  return 'Valid'
}

const getDocumentTypeName = (type: string): string => {
  const typeMap: Record<string, string> = {
    gst_certificate: 'GST Certificate',
    pan_card: 'PAN Card',
    trade_license: 'Trade License',
    contract: 'Contract',
    other: 'Other Document',
  }
  return typeMap[type] || type
}

const getCertificationTypeName = (type: string): string => {
  const typeMap: Record<string, string> = {
    bis: 'BIS',
    hallmarking: 'Hallmarking',
    iso: 'ISO',
    gemological: 'Gemological',
    other: 'Other',
  }
  return typeMap[type] || type
}

// ─── ADD DOCUMENT SHEET ───────────────────────────────────────────────────────

interface AddDocumentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    documentType: string
    documentNumber?: string
    documentUrl?: string
  }) => Promise<void>
  isLoading?: boolean
}

const AddDocumentSheet: React.FC<AddDocumentSheetProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  const { t } = useTranslation()
  const [documentType, setDocumentType] = useState<string>('')
  const [documentNumber, setDocumentNumber] = useState('')
  const [documentUrl, setDocumentUrl] = useState('')

  const handleSubmit = async () => {
    if (!documentType) return
    await onSubmit({ documentType, documentNumber, documentUrl })
    // Reset
    setDocumentType('')
    setDocumentNumber('')
    setDocumentUrl('')
  }

  const handleClose = () => {
    setDocumentType('')
    setDocumentNumber('')
    setDocumentUrl('')
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent size="md">
        <SheetHeader>
          <SheetTitle>{t('suppliers.documents.addDocument')}</SheetTitle>
          <SheetDescription>
            {t('suppliers.documents.addDocumentDesc')}
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-4">
          {/* Document Type */}
          <div className="space-y-1.5">
            <Label className="text-sm text-text-secondary">
              {t('suppliers.documents.documentType')} *
            </Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder={t('suppliers.documents.selectDocumentType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gst_certificate">GST Certificate</SelectItem>
                <SelectItem value="pan_card">PAN Card</SelectItem>
                <SelectItem value="trade_license">Trade License</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Document Number */}
          <div className="space-y-1.5">
            <Label className="text-sm text-text-secondary">
              {t('suppliers.documents.documentNumber')}
            </Label>
            <Input
              value={documentNumber}
              onChange={e => setDocumentNumber(e.target.value)}
              placeholder={t('suppliers.documents.documentNumberPlaceholder')}
            />
          </div>

          {/* Document URL */}
          <div className="space-y-1.5">
            <Label className="text-sm text-text-secondary">
              {t('suppliers.documents.documentUrl')}
            </Label>
            <Input
              value={documentUrl}
              onChange={e => setDocumentUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </SheetBody>

        <SheetFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!documentType || isLoading}
            isLoading={isLoading}
          >
            {t('suppliers.documents.addDocument')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ─── ADD CERTIFICATION SHEET ──────────────────────────────────────────────────

interface AddCertificationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    certificationType: string
    certificateNumber?: string
    issuedBy?: string
    issueDate?: string
    expiryDate?: string
    documentUrl?: string
  }) => Promise<void>
  isLoading?: boolean
}

const AddCertificationSheet: React.FC<AddCertificationSheetProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  const { t } = useTranslation()
  const [certificationType, setCertificationType] = useState<string>('')
  const [certificateNumber, setCertificateNumber] = useState('')
  const [issuedBy, setIssuedBy] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [documentUrl, setDocumentUrl] = useState('')

  const handleSubmit = async () => {
    if (!certificationType) return
    await onSubmit({
      certificationType,
      certificateNumber,
      issuedBy,
      issueDate,
      expiryDate,
      documentUrl,
    })
    // Reset
    setCertificationType('')
    setCertificateNumber('')
    setIssuedBy('')
    setIssueDate('')
    setExpiryDate('')
    setDocumentUrl('')
  }

  const handleClose = () => {
    setCertificationType('')
    setCertificateNumber('')
    setIssuedBy('')
    setIssueDate('')
    setExpiryDate('')
    setDocumentUrl('')
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent size="lg">
        <SheetHeader>
          <SheetTitle>{t('suppliers.documents.certifications.addCertificate')}</SheetTitle>
          <SheetDescription>
            {t('suppliers.documents.certifications.addCertificateDesc')}
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-4">
          {/* Certification Type */}
          <div className="space-y-1.5">
            <Label className="text-sm text-text-secondary">
              {t('suppliers.documents.certifications.certificationType')} *
            </Label>
            <Select value={certificationType} onValueChange={setCertificationType}>
              <SelectTrigger>
                <SelectValue placeholder={t('suppliers.documents.certifications.selectType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bis">BIS</SelectItem>
                <SelectItem value="hallmarking">Hallmarking</SelectItem>
                <SelectItem value="iso">ISO</SelectItem>
                <SelectItem value="gemological">Gemological</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Certificate Number */}
          <div className="space-y-1.5">
            <Label className="text-sm text-text-secondary">
              {t('suppliers.documents.certifications.certificateNumber')}
            </Label>
            <Input
              value={certificateNumber}
              onChange={e => setCertificateNumber(e.target.value)}
              placeholder="e.g. BIS-2024-001"
            />
          </div>

          {/* Issued By */}
          <div className="space-y-1.5">
            <Label className="text-sm text-text-secondary">
              {t('suppliers.documents.certifications.issuedBy')}
            </Label>
            <Input
              value={issuedBy}
              onChange={e => setIssuedBy(e.target.value)}
              placeholder="e.g. Bureau of Indian Standards"
            />
          </div>

          {/* Issue Date */}
          <div className="space-y-1.5">
            <Label className="text-sm text-text-secondary">
              {t('suppliers.documents.certifications.issueDate')}
            </Label>
            <Input
              type="date"
              value={issueDate}
              onChange={e => setIssueDate(e.target.value)}
            />
          </div>

          {/* Expiry Date */}
          <div className="space-y-1.5">
            <Label className="text-sm text-text-secondary">
              {t('suppliers.documents.certifications.expiryDate')}
            </Label>
            <Input
              type="date"
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
            />
          </div>

          {/* Document URL */}
          <div className="space-y-1.5">
            <Label className="text-sm text-text-secondary">
              {t('suppliers.documents.certifications.documentUrl')}
            </Label>
            <Input
              value={documentUrl}
              onChange={e => setDocumentUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </SheetBody>

        <SheetFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!certificationType || isLoading}
            isLoading={isLoading}
          >
            {t('suppliers.documents.certifications.addCertificate')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const SupplierDocumentsTab: React.FC<SupplierDocumentsTabProps> = ({
  supplier,
  onRefetch,
}) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()
  const shopId = currentShopId!

  // ── Sheet State ─────────────────────────────────────────────────────────
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false)
  const [isAddCertificationOpen, setIsAddCertificationOpen] = useState(false)

  // ── Actions ─────────────────────────────────────────────────────────────
  const {
    addDocument,
    deleteDocument,
    addCertification,
    deleteCertification,
    isAddingDocument,
    isDeletingDocument,
    isAddingCertification,
    isDeletingCertification,
  } = useSupplierActions(shopId)

  // ── Derived Data ────────────────────────────────────────────────────────
  const documents: DocumentWithStatus[] = (supplier.documents || []).map(doc => ({
    ...doc,
    uploadedBy: 'Admin User',
  }))

  const certifications: CertificationWithStatus[] = (supplier.certifications || []).map(cert => ({
    ...cert,
    status: getCertificationStatus(cert.expiryDate),
  }))

  const validCount    = certifications.filter(c => c.status === 'Valid').length
  const expiringCount = certifications.filter(c => c.status === 'Expiring Soon').length
  const expiredCount  = certifications.filter(c => c.status === 'Expired').length

  // ── Formatters ───────────────────────────────────────────────────────────
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getDaysUntilExpiry = (expiryDate?: string): number => {
    if (!expiryDate) return 0
    const today = new Date()
    const expiry = new Date(expiryDate)
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAddDocument = async (data: {
    documentType: string
    documentNumber?: string
    documentUrl?: string
  }) => {
    const result = await addDocument(supplier._id, data)
    if (result.success) {
      setIsAddDocumentOpen(false)
      onRefetch?.()
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    const result = await deleteDocument(supplier._id, documentId)
    if (result.success) {
      onRefetch?.()
    }
  }

  const handleAddCertification = async (data: {
    certificationType: string
    certificateNumber?: string
    issuedBy?: string
    issueDate?: string
    expiryDate?: string
    documentUrl?: string
  }) => {
    const result = await addCertification(supplier._id, data)
    if (result.success) {
      setIsAddCertificationOpen(false)
      onRefetch?.()
    }
  }

  const handleDeleteCertification = async (certificationId: string) => {
    const result = await deleteCertification(supplier._id, certificationId)
    if (result.success) {
      onRefetch?.()
    }
  }

  // ── Table Actions ────────────────────────────────────────────────────────
  const documentActions: RowAction<DocumentWithStatus>[] = [
    {
      label: 'suppliers.documents.actions.view',
      icon: <Eye className="h-4 w-4" />,
      onClick: row => {
        if (row.documentUrl) window.open(row.documentUrl, '_blank')
      },
    },
    {
      label: 'suppliers.documents.actions.download',
      icon: <Download className="h-4 w-4" />,
      onClick: row => {
        if (row.documentUrl) window.open(row.documentUrl, '_blank')
      },
    },
    {
      label: 'suppliers.documents.actions.delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: row => {
        if (row._id) handleDeleteDocument(row._id)
      },
      variant: 'destructive',
      isLoading: isDeletingDocument,
    },
  ]

  const certificationActions: RowAction<CertificationWithStatus>[] = [
    {
      label: 'suppliers.documents.actions.view',
      icon: <Eye className="h-4 w-4" />,
      onClick: row => {
        if (row.documentUrl) window.open(row.documentUrl, '_blank')
      },
    },
    {
      label: 'suppliers.documents.actions.download',
      icon: <Download className="h-4 w-4" />,
      onClick: row => {
        if (row.documentUrl) window.open(row.documentUrl, '_blank')
      },
    },
    {
      label: 'suppliers.documents.actions.delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: row => {
        if (row._id) handleDeleteCertification(row._id)
      },
      variant: 'destructive',
      isLoading: isDeletingCertification,
    },
  ]

  // ── Table Columns ────────────────────────────────────────────────────────
  const documentColumns: DataTableColumn<DocumentWithStatus>[] = [
    {
      id: 'type',
      header: 'suppliers.documents.table.type',
      accessorFn: row => getDocumentTypeName(row.documentType),
      cell: ({ value }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-accent" />
          <span className="font-medium text-text-primary">{value}</span>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'number',
      header: 'suppliers.documents.table.number',
      accessorKey: 'documentNumber',
      cell: ({ value }) => (
        <span className="font-mono text-sm text-text-primary">{value || '-'}</span>
      ),
      sortable: true,
    },
    {
      id: 'uploadedDate',
      header: 'suppliers.documents.table.uploaded',
      accessorKey: 'uploadedAt',
      cell: ({ value }) => (
        <span className="text-sm text-text-secondary">{formatDate(value)}</span>
      ),
      sortable: true,
    },
  ]

  const certificationColumns: DataTableColumn<CertificationWithStatus>[] = [
    {
      id: 'type',
      header: 'suppliers.documents.certifications.table.type',
      accessorFn: row => getCertificationTypeName(row.certificationType),
      cell: ({ value }) => (
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-accent" />
          <span className="font-medium text-text-primary">{value}</span>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'number',
      header: 'suppliers.documents.certifications.table.number',
      accessorKey: 'certificateNumber',
      cell: ({ value }) => (
        <span className="font-mono text-sm text-text-primary">{value || '-'}</span>
      ),
      sortable: true,
    },
    {
      id: 'issuedBy',
      header: 'suppliers.documents.certifications.table.issuedBy',
      accessorKey: 'issuedBy',
      cell: ({ value }) => (
        <span className="text-sm text-text-secondary">{value || '-'}</span>
      ),
      sortable: true,
    },
    {
      id: 'issueDate',
      header: 'suppliers.documents.certifications.table.issueDate',
      accessorKey: 'issueDate',
      cell: ({ value }) => (
        <span className="text-sm text-text-secondary">{formatDate(value)}</span>
      ),
      sortable: true,
    },
    {
      id: 'expiryDate',
      header: 'suppliers.documents.certifications.table.expiry',
      accessorKey: 'expiryDate',
      cell: ({ value, row }) => {
        const daysUntilExpiry = getDaysUntilExpiry(value)
        const status = row.status
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm text-text-secondary">{formatDate(value)}</span>
            {status === 'Expiring Soon' && (
              <span className="text-xs text-status-warning">
                {daysUntilExpiry} {t('suppliers.documents.certifications.daysLeft')}
              </span>
            )}
          </div>
        )
      },
      sortable: true,
    },
    {
      id: 'status',
      header: 'suppliers.documents.certifications.table.status',
      accessorKey: 'status',
      cell: ({ value }) => {
        const statusStyles = {
          Valid: 'bg-status-success/10 text-status-success',
          'Expiring Soon': 'bg-status-warning/10 text-status-warning',
          Expired: 'bg-status-error/10 text-status-error',
        }
        const statusIcons = {
          Valid: '✓',
          'Expiring Soon': '⚠',
          Expired: '✕',
        }
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusStyles[value as keyof typeof statusStyles]}`}
          >
            <span>{statusIcons[value as keyof typeof statusIcons]}</span>
            <span>{value}</span>
          </span>
        )
      },
      sortable: true,
    },
  ]

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Business Documents */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary">
        <div className="flex flex-col gap-4 border-b border-border-primary px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 rounded-lg p-2">
              <FileText className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {t('suppliers.documents.businessDocuments')}
              </h3>
              <p className="text-sm text-text-secondary">
                {documents.length} {t('suppliers.documents.documentsUploaded')}
              </p>
            </div>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddDocumentOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>{t('suppliers.documents.addDocument')}</span>
          </Button>
        </div>

        <DataTable
          data={documents}
          columns={documentColumns}
          rowActions={{
            enabled: true,
            actions: documentActions,
            position: 'end',
          }}
          pagination={{
            enabled: true,
            pageSize: 10,
            pageSizeOptions: [5, 10, 20],
            showPageInfo: true,
          }}
          sorting={{ enabled: true }}
          style={{ hoverEffect: true, zebraStripes: false }}
          emptyState={{ message: t('suppliers.documents.noDocuments') }}
        />
      </div>

      {/* Certifications */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary">
        <div className="flex flex-col gap-4 border-b border-border-primary px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 rounded-lg p-2">
              <Award className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {t('suppliers.documents.certifications.title')}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-status-success" />
                  {validCount} {t('suppliers.documents.certifications.valid')}
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-status-warning" />
                  {expiringCount} {t('suppliers.documents.certifications.expiring')}
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-status-error" />
                  {expiredCount} {t('suppliers.documents.certifications.expired')}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddCertificationOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>{t('suppliers.documents.certifications.addCertificate')}</span>
          </Button>
        </div>

        {/* Expiry Alert */}
        {(expiringCount > 0 || expiredCount > 0) && (
          <div className="bg-status-warning/5 border-b border-border-primary px-6 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-status-warning" />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {t('suppliers.documents.certifications.alert.title')}
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  {expiringCount > 0 && (
                    <>{expiringCount} {t('suppliers.documents.certifications.alert.expiringSoon')}</>
                  )}
                  {expiringCount > 0 && expiredCount > 0 && ' • '}
                  {expiredCount > 0 && (
                    <>{expiredCount} {t('suppliers.documents.certifications.alert.expired')}</>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <DataTable
          data={certifications}
          columns={certificationColumns}
          rowActions={{
            enabled: true,
            actions: certificationActions,
            position: 'end',
          }}
          pagination={{
            enabled: true,
            pageSize: 10,
            pageSizeOptions: [5, 10, 20],
            showPageInfo: true,
          }}
          sorting={{ enabled: true }}
          style={{ hoverEffect: true, zebraStripes: false }}
          emptyState={{ message: t('suppliers.documents.certifications.noCertifications') }}
        />
      </div>

      {/* Add Document Sheet */}
      <AddDocumentSheet
        open={isAddDocumentOpen}
        onOpenChange={setIsAddDocumentOpen}
        onSubmit={handleAddDocument}
        isLoading={isAddingDocument}
      />

      {/* Add Certification Sheet */}
      <AddCertificationSheet
        open={isAddCertificationOpen}
        onOpenChange={setIsAddCertificationOpen}
        onSubmit={handleAddCertification}
        isLoading={isAddingCertification}
      />
    </div>
  )
}

export default SupplierDocumentsTab