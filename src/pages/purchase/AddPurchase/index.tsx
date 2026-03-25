// FILE: src/pages/purchase/AddPurchase/index.tsx
// Add/Edit Purchase Page - Same pattern as AddCustomer

import { useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/common/Alert'
import { useAuth } from '@/hooks/auth'
import { Button } from '@/components/ui/button'
import { usePurchaseById } from '@/hooks/purchase/usePurchaseById'
import { PurchaseForm } from '@/components/purchase/PurchaseForm'
import { usePermissionCheck } from '@/hooks/auth/usePermissions'
import type { IPurchase } from '@/types/purchase.types'
import type { PurchaseFormData } from '@/components/purchase/PurchaseForm/PurchaseForm.types'

// ─────────────────────────────────────────────
// HELPER: Convert IPurchase → PurchaseFormData
// ─────────────────────────────────────────────
const convertPurchaseToFormData = (
  purchase: IPurchase
): Partial<PurchaseFormData> => {
  return {
    // Basic Info
    supplierId:   purchase.supplierId,
    purchaseDate: typeof purchase.purchaseDate === 'string'
      ? purchase.purchaseDate
      : new Date(purchase.purchaseDate).toISOString(),
    purchaseType: purchase.purchaseType,

    // Items
    items: purchase.items.map(item => ({
      ...item,
      _id: item._id || undefined,
    })),

    // Payment
    paymentMode:  purchase.payment.paymentMode,
    paidAmount:   purchase.payment.paidAmount,
    paymentTerms: purchase.payment.paymentTerms,
    dueDate: purchase.payment.dueDate
      ? typeof purchase.payment.dueDate === 'string'
        ? purchase.payment.dueDate
        : new Date(purchase.payment.dueDate).toISOString()
      : undefined,

    // Delivery
    expectedDate: purchase.delivery?.expectedDate
      ? typeof purchase.delivery.expectedDate === 'string'
        ? purchase.delivery.expectedDate
        : new Date(purchase.delivery.expectedDate).toISOString()
      : undefined,
    deliveryAddress: purchase.delivery?.deliveryAddress,

    // Additional
    notes:         purchase.notes,
    internalNotes: purchase.internalNotes,
    tags:          purchase.tags,
  }
}

// ─────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────
export default function AddPurchasePage() {
  const { currentShopId } = useAuth()
  const navigate = useNavigate()
  const { purchaseId } = useParams()
  const { t } = useTranslation()
  const isEditMode = Boolean(purchaseId)
  const { can } = usePermissionCheck()

  const shopId = currentShopId || ''

  // ── Fetch purchase data (only in edit mode) ──
  const { purchase, isLoading, error } = usePurchaseById(
    shopId,
    purchaseId || ''
  )

  // ── Permission check ──
  useEffect(() => {
    if (isEditMode && !can('canUpdatePurchase')) {
      navigate('/purchases')
    }
    if (!isEditMode && !can('canCreatePurchase')) {
      navigate('/purchases')
    }
  }, [isEditMode, can, navigate])

  // ── Convert purchase to form data ──
  const initialData = useMemo(() => {
    if (!purchase) return undefined
    return convertPurchaseToFormData(purchase)
  }, [purchase])

  // ── No shop selected ──
  if (!shopId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-text-secondary">
          {t('common.selectShopFirst')}
        </p>
      </div>
    )
  }

  // ── Loading state ──
  if (isEditMode && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  // ── Error state ──
  if (isEditMode && error) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertTitle>
            {t('purchase.errors.fetchFailed', 'Failed to load purchase')}
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">
              {t('purchase.errors.fetchFailedDescription', 'Something went wrong while loading the purchase.')}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/purchases')}
              className="w-full"
            >
              {t('common.goBack', 'Go Back')}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // ── Not found ──
  if (isEditMode && !purchase) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-text-secondary">
            {t('purchase.errors.notFound', 'Purchase not found')}
          </p>
          <button
            onClick={() => navigate('/purchases')}
            className="text-accent hover:underline"
          >
            {t('common.goBack', 'Go Back')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <PurchaseForm
      shopId={shopId}
      purchaseId={purchaseId}
      initialData={initialData}
      onSuccess={() => navigate('/purchases')}
      onCancel={() => navigate('/purchases')}
      mode={isEditMode ? 'edit' : 'create'}
    />
  )
}