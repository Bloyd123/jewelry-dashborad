//
// FILE: src/components/supplier/SupplierManagementModal/sections/DeleteSupplierSection.tsx
// Delete/Restore Supplier Section
//

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2, AlertTriangle, RotateCcw } from 'lucide-react'
import type { DeleteSupplierSectionProps } from '../SupplierManagementModal.types'

export const DeleteSupplierSection = ({
  supplier,
  onDelete,
  onRestore,
  onCancel,
}: DeleteSupplierSectionProps) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const isDeleted = !!supplier.deletedAt

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await onDelete()
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = async () => {
    setIsLoading(true)
    try {
      await onRestore()
    } finally {
      setIsLoading(false)
    }
  }

  // If already deleted - show restore UI
  if (isDeleted) {
    return (
      <div className="space-y-6">
        {/* Delete Status */}
        <div className="bg-status-warning/10 rounded-lg border-2 border-status-warning p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Trash2 className="h-6 w-6 text-status-warning" />
            <p className="text-lg font-semibold text-status-warning">
              {t('suppliers.delete.currentlyDeleted')}
            </p>
          </div>

          {supplier.deletedAt && (
            <p className="mt-2 text-sm text-text-secondary">
              {t('suppliers.delete.deletedOn')}:{' '}
              {new Date(supplier.deletedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Restore Info */}
        <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
          <p className="mb-3 font-medium text-text-primary">
            {t('suppliers.delete.restoreInfo')}:
          </p>
          <ul className="space-y-1.5 text-sm text-text-secondary">
            <li>• {t('suppliers.delete.restoreBenefit1')}</li>
            <li>• {t('suppliers.delete.restoreBenefit2')}</li>
            <li>• {t('suppliers.delete.restoreBenefit3')}</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            variant="default"
            onClick={handleRestore}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.processing')}
              </>
            ) : (
              <>
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('suppliers.delete.restoreSupplier')}
              </>
            )}
          </Button>

          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
        </div>
      </div>
    )
  }

  // If not deleted - show delete UI
  return (
    <div className="space-y-6">
      {/* Warning */}
      <div className="bg-status-warning/10 rounded-lg border-2 border-status-warning p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-status-warning" />
          <div className="text-sm">
            <p className="font-semibold text-status-warning">
              {t('suppliers.delete.warning')}
            </p>
            <p className="mt-1 text-text-secondary">
              {t('suppliers.delete.warningDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Important Info Before Delete */}
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <p className="mb-3 font-medium text-text-primary">
          {t('suppliers.delete.beforeDeleting')}:
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-text-tertiary">
              {t('suppliers.delete.outstandingDue')}
            </p>
            <p className="mt-1 text-lg font-semibold text-status-error">
              {supplier.totalDue < 0 ? '-' : ''}₹
              {Math.abs(supplier.totalDue).toLocaleString('en-IN')}
            </p>
          </div>

          <div>
            <p className="text-text-tertiary">
              {t('suppliers.delete.pendingOrders')}
            </p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              {supplier.statistics.pendingOrders}
            </p>
          </div>

          <div className="col-span-2">
            <p className="text-text-tertiary">
              {t('suppliers.delete.lastTransaction')}
            </p>
            <p className="mt-1 text-sm font-medium text-text-primary">
              {supplier.statistics.lastOrderDate
                ? new Date(
                    supplier.statistics.lastOrderDate
                  ).toLocaleDateString()
                : t('suppliers.delete.noTransactions')}
            </p>
          </div>
        </div>
      </div>

      {/* What Happens */}
      <div className="bg-status-info/10 rounded-lg border border-status-info p-4">
        <p className="mb-2 font-medium text-text-primary">
          {t('suppliers.delete.whatHappens')}:
        </p>
        <ul className="space-y-1 text-sm text-text-secondary">
          <li>• {t('suppliers.delete.consequence1')}</li>
          <li>• {t('suppliers.delete.consequence2')}</li>
          <li>• {t('suppliers.delete.consequence3')}</li>
          <li>• {t('suppliers.delete.consequence4')}</li>
        </ul>
      </div>

      {/* Confirmation Question */}
      <div className="bg-status-error/5 rounded-lg border-2 border-status-error p-4 text-center">
        <p className="font-semibold text-text-primary">
          {t('suppliers.delete.confirmQuestion')}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('common.deleting')}
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              {t('suppliers.delete.deleteSupplier')}
            </>
          )}
        </Button>

        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          {t('common.cancel')}
        </Button>
      </div>
    </div>
  )
}
