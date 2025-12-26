// ============================================================================
// FILE: src/components/features/PurchaseTable/PurchaseTable.types.ts
// Purchase Table TypeScript Types
// ============================================================================

import type { IPurchase } from '@/types/purchase.types'

// Re-export Purchase type for convenience
export type { IPurchase as Purchase }

// ============================================================================
// TABLE-SPECIFIC TYPES
// ============================================================================

export interface PurchaseTableFilters {
  search: string
  supplierId?: string
  status?: string
  paymentStatus?: string
  purchaseType?: string
  approvalStatus?: string
  dateRange?: {
    from?: Date
    to?: Date
  }
}

export interface PurchaseTableSort {
  field: string
  direction: 'asc' | 'desc'
}

export interface PurchaseTableProps {
  onPurchaseSelect?: (purchase: IPurchase) => void
  onPurchaseEdit?: (purchase: IPurchase) => void
  hideActions?: boolean
  compactView?: boolean
}