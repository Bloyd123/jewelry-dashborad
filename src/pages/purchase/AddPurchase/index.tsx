// ============================================================================
// FILE: src/pages/purchase/AddPurchase/index.tsx
// Add/Edit Purchase Page
// ============================================================================

import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
// import { useGetPurchaseQuery } from '@/api/services/purchaseService'
import { PurchaseForm } from '@/components/purchase/PurchaseForm'
// import { Loader2 } from 'lucide-react'
import type { IPurchase } from '@/types/purchase.types'
import type { PurchaseFormData } from '@/components/purchase/PurchaseForm/PurchaseForm.types'
import { dummyPurchases } from '../mock.data'

// ============================================================================
// HELPER: Convert Purchase to Form Data
// ============================================================================
const convertPurchaseToFormData = (
  purchase: IPurchase
): Partial<PurchaseFormData> => {
  return {
    // Basic Info
    supplierId: purchase.supplierId,
    purchaseDate:
      typeof purchase.purchaseDate === 'string'
        ? purchase.purchaseDate
        : purchase.purchaseDate.toISOString(),
    purchaseType: purchase.purchaseType,

    // Items
    items: purchase.items.map(item => ({
      ...item,
      _id: item._id || undefined,
    })),

    // Payment
    paymentMode: purchase.payment.paymentMode,
    paidAmount: purchase.payment.paidAmount,
    paymentTerms: purchase.payment.paymentTerms,
    dueDate:
      purchase.payment.dueDate && typeof purchase.payment.dueDate === 'string'
        ? purchase.payment.dueDate
        : purchase.payment.dueDate?.toString(),

    // Delivery
    expectedDate:
      purchase.delivery.expectedDate &&
      typeof purchase.delivery.expectedDate === 'string'
        ? purchase.delivery.expectedDate
        : purchase.delivery.expectedDate?.toString(),
    deliveryAddress: purchase.delivery.deliveryAddress,

    // Additional
    notes: purchase.notes,
    internalNotes: purchase.internalNotes,
    tags: purchase.tags,
  }
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default function AddPurchasePage() {
  const navigate = useNavigate()
  const { purchaseId } = useParams()
  const isEditMode = Boolean(purchaseId)

  // Get current shop ID from Redux
  const currentShopId = useAppSelector(state => state.auth.currentShop)
  const shopId = currentShopId || 'SHOP001'

  // ============================================================================
  // OPTION 1: Using Mock Data (Current Implementation)
  // ============================================================================
  const mockPurchase = useMemo(() => {
    if (!isEditMode || !purchaseId) return undefined
    return dummyPurchases.find(p => p._id === purchaseId)
  }, [purchaseId, isEditMode])

  const initialData = useMemo(() => {
    if (!mockPurchase) return undefined
    return convertPurchaseToFormData(mockPurchase)
  }, [mockPurchase])

  // ============================================================================
  // OPTION 2: Using RTK Query (For Future Integration)
  // Uncomment this when API is ready
  // ============================================================================
  /*
  const { data: purchaseData, isLoading } = useGetPurchaseQuery(
    { shopId: currentShopId!, purchaseId: purchaseId! },
    { skip: !isEditMode || !purchaseId || !currentShopId }
  )

  const initialData = useMemo(() => {
    if (!purchaseData?.data) return undefined
    return convertPurchaseToFormData(purchaseData.data)
  }, [purchaseData])

  // Loading state
  if (isEditMode && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  // No shop selected
  if (!currentShopId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-text-secondary">Please select a shop first</p>
      </div>
    )
  }
  */

  return (
    <PurchaseForm
      shopId={shopId}
      purchaseId={purchaseId}
      initialData={initialData}
      onSuccess={() => {
        console.log('Mock Success - Navigate to /purchases')
        navigate('/purchases')
      }}
      onCancel={() => {
        navigate('/purchases')
      }}
      mode={isEditMode ? 'edit' : 'create'}
    />
  )
}