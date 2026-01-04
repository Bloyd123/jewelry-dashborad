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
import type {
  DataTableColumn,
  RowAction,
} from '@/components/ui/data-display/DataTable/DataTable.types'
import { dummySupplier } from '@/pages/suppliers/data'
import type { Document, Certification } from '@/types/supplier.types'

//
// EXTEND TYPES FOR UI
//

interface DocumentWithStatus extends Document {
  uploadedBy?: string
}

interface CertificationWithStatus extends Certification {
  status: 'Valid' | 'Expiring Soon' | 'Expired'
}

//
// TRANSFORM DUMMY DATA
//

const transformDocuments = (): DocumentWithStatus[] => {
  return (dummySupplier.documents || []).map(doc => ({
    ...doc,
    uploadedBy: 'Admin User',
  }))
}

const transformCertifications = (): CertificationWithStatus[] => {
  return (dummySupplier.certifications || []).map(cert => {
    const getDaysUntilExpiry = (expiryDate: string): number => {
      const today = new Date()
      const expiry = new Date(expiryDate)
      const diffTime = expiry.getTime() - today.getTime()
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const getCertificationStatus = (
      expiryDate?: string
    ): CertificationWithStatus['status'] => {
      if (!expiryDate) return 'Valid'
      const daysUntilExpiry = getDaysUntilExpiry(expiryDate)
      if (daysUntilExpiry < 0) return 'Expired'
      if (daysUntilExpiry <= 90) return 'Expiring Soon'
      return 'Valid'
    }

    return {
      ...cert,
      status: getCertificationStatus(cert.expiryDate),
    }
  })
}

//
// MAIN COMPONENT
//

const SupplierDocumentsTab: React.FC = () => {
  const { t } = useTranslation()
  const [documents] = useState<DocumentWithStatus[]>(transformDocuments())
  const [certifications] = useState<CertificationWithStatus[]>(
    transformCertifications()
  )

  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate?: string): number => {
    if (!expiryDate) return 0
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Get document type display name
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

  // Get certification type display name
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

  // Document actions
  const documentActions: RowAction<DocumentWithStatus>[] = [
    {
      label: 'suppliers.documents.actions.view',
      icon: <Eye className="h-4 w-4" />,
      onClick: row => {
        console.log('View document:', row)
      },
    },
    {
      label: 'suppliers.documents.actions.download',
      icon: <Download className="h-4 w-4" />,
      onClick: row => {
        console.log('Download document:', row)
      },
    },
    {
      label: 'suppliers.documents.actions.delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: row => {
        console.log('Delete document:', row)
      },
      variant: 'destructive',
    },
  ]

  // Certification actions
  const certificationActions: RowAction<CertificationWithStatus>[] = [
    {
      label: 'suppliers.documents.actions.view',
      icon: <Eye className="h-4 w-4" />,
      onClick: row => {
        console.log('View certification:', row)
      },
    },
    {
      label: 'suppliers.documents.actions.download',
      icon: <Download className="h-4 w-4" />,
      onClick: row => {
        console.log('Download certification:', row)
      },
    },
  ]

  // Document columns
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
        <span className="font-mono text-sm text-text-primary">
          {value || '-'}
        </span>
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

  // Certification columns
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
        <span className="font-mono text-sm text-text-primary">
          {value || '-'}
        </span>
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
            <span className="text-sm text-text-secondary">
              {formatDate(value)}
            </span>
            {status === 'Expiring Soon' && (
              <span className="text-xs text-status-warning">
                {daysUntilExpiry}{' '}
                {t('suppliers.documents.certifications.daysLeft')}
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

  // Count certifications by status
  const validCount = certifications.filter(c => c.status === 'Valid').length
  const expiringCount = certifications.filter(
    c => c.status === 'Expiring Soon'
  ).length
  const expiredCount = certifications.filter(c => c.status === 'Expired').length

  return (
    <div className="space-y-6">
      {/* Business Documents Section */}
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
            onClick={() => {}}
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
          sorting={{
            enabled: true,
          }}
          style={{
            hoverEffect: true,
            zebraStripes: false,
          }}
        />
      </div>

      {/* Certifications Section */}
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
                  <span className="inline-block h-2 w-2 rounded-full bg-status-success"></span>
                  {validCount} {t('suppliers.documents.certifications.valid')}
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-status-warning"></span>
                  {expiringCount}{' '}
                  {t('suppliers.documents.certifications.expiring')}
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-status-error"></span>
                  {expiredCount}{' '}
                  {t('suppliers.documents.certifications.expired')}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => {}}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>
              {t('suppliers.documents.certifications.addCertificate')}
            </span>
          </Button>
        </div>

        {/* Expiring/Expired Certifications Alert */}
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
                    <>
                      {expiringCount}{' '}
                      {t(
                        'suppliers.documents.certifications.alert.expiringSoon'
                      )}
                    </>
                  )}
                  {expiringCount > 0 && expiredCount > 0 && ' • '}
                  {expiredCount > 0 && (
                    <>
                      {expiredCount}{' '}
                      {t('suppliers.documents.certifications.alert.expired')}
                    </>
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
          sorting={{
            enabled: true,
          }}
          style={{
            hoverEffect: true,
            zebraStripes: false,
          }}
        />
      </div>

      {/* API Note */}
      <div className="rounded-lg border border-border-secondary bg-bg-tertiary px-4 py-3">
        <p className="text-xs text-text-tertiary">
          <span className="font-medium">API:</span> Supplier documents &
          certifications from GET /api/v1/suppliers/:id
        </p>
      </div>
    </div>
  )
}

export default SupplierDocumentsTab
