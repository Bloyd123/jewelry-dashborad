// ============================================================================
// FILE: src/components/supplier/SupplierManagementModal/sections/BlacklistSupplierSection.tsx
// Blacklist Supplier Section
// ============================================================================

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { FormTextarea } from '@/components/forms/FormTextarea/FormTextarea'
import { Loader2, AlertTriangle, CheckCircle, Ban } from 'lucide-react'
import type { BlacklistSupplierSectionProps } from '../SupplierManagementModal.types'
import { cn } from '@/lib/utils'

export const BlacklistSupplierSection = ({
  supplier,
  onBlacklist,
  onRemoveBlacklist,
  onCancel,
}: BlacklistSupplierSectionProps) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const isBlacklisted = supplier.isBlacklisted

  const handleBlacklist = async () => {
    if (reason.trim().length < 10) {
      setError(t('suppliers.blacklist.reasonMinLength'))
      return
    }

    setIsLoading(true)
    try {
      await onBlacklist(reason)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveBlacklist = async () => {
    setIsLoading(true)
    try {
      await onRemoveBlacklist()
    } finally {
      setIsLoading(false)
    }
  }

  const handleReasonChange = (_: string, value: string) => {
    setReason(value)
    if (error) setError('')
  }

  // If already blacklisted - show removal UI
  if (isBlacklisted) {
    return (
      <div className="space-y-6">
        {/* Blacklist Status */}
        <div className="rounded-lg border-2 border-status-error bg-status-error/10 p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Ban className="h-6 w-6 text-status-error" />
            <p className="text-lg font-semibold text-status-error">
              {t('suppliers.blacklist.currentlyBlacklisted')}
            </p>
          </div>

          {supplier.blacklistedAt && (
            <p className="mt-2 text-sm text-text-secondary">
              {t('suppliers.blacklist.blacklistedOn')}: {new Date(supplier.blacklistedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Blacklist Reason */}
        {supplier.blacklistReason && (
          <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
            <p className="mb-2 font-medium text-text-primary">
              {t('suppliers.blacklist.reason')}:
            </p>
            <p className="text-sm text-text-secondary">{supplier.blacklistReason}</p>
          </div>
        )}

        {/* Impact Info */}
        <div className="rounded-lg border border-status-warning bg-status-warning/10 p-4">
          <p className="mb-2 font-medium text-text-primary">
            {t('suppliers.blacklist.currentImpact')}:
          </p>
          <ul className="space-y-1 text-sm text-text-secondary">
            <li>• {t('suppliers.blacklist.impact1')}</li>
            <li>• {t('suppliers.blacklist.impact2')}</li>
            <li>• {t('suppliers.blacklist.impact3')}</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            variant="default"
            onClick={handleRemoveBlacklist}
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
                <CheckCircle className="mr-2 h-4 w-4" />
                {t('suppliers.blacklist.removeFromBlacklist')}
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

  // If not blacklisted - show blacklist UI
  return (
    <div className="space-y-6">
      {/* Warning */}
      <div className="rounded-lg border-2 border-status-error bg-status-error/10 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-status-error" />
          <div className="text-sm">
            <p className="font-semibold text-status-error">
              {t('suppliers.blacklist.warning')}
            </p>
            <p className="mt-1 text-text-secondary">
              {t('suppliers.blacklist.warningDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-tertiary">{t('suppliers.blacklist.currentStatus')}:</p>
          <span className="rounded-full bg-status-success/20 px-3 py-1 text-sm font-medium text-status-success">
            {t('suppliers.blacklist.active')}
          </span>
        </div>
      </div>

      {/* Reason Input */}
      <FormTextarea
        name="reason"
        label={t('suppliers.blacklist.reasonLabel')}
        value={reason}
        onChange={handleReasonChange}
        error={error}
        placeholder={t('suppliers.blacklist.reasonPlaceholder')}
        disabled={isLoading}
        rows={4}
        maxLength={500}
        showCharCount
        required
      />

      {/* Consequences */}
      <div className="rounded-lg border border-status-warning bg-status-warning/10 p-4">
        <p className="mb-2 font-medium text-text-primary">
          {t('suppliers.blacklist.consequences')}:
        </p>
        <ul className="space-y-1 text-sm text-text-secondary">
          <li>• {t('suppliers.blacklist.consequence1')}</li>
          <li>• {t('suppliers.blacklist.consequence2')}</li>
          <li>• {t('suppliers.blacklist.consequence3')}</li>
          <li>• {t('suppliers.blacklist.consequence4')}</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          variant="destructive"
          onClick={handleBlacklist}
          disabled={isLoading || !reason.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('common.processing')}
            </>
          ) : (
            <>
              <Ban className="mr-2 h-4 w-4" />
              {t('suppliers.blacklist.blacklistSupplier')}
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