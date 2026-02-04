//
// FILE: src/components/supplier/SupplierManagementModal/SupplierManagementModal.types.ts
// TypeScript Types for SupplierManagementModal
//

import type { Supplier } from '@/types/supplier.types'

export type ManagementAction =
  | 'update-balance'
  | 'update-rating'
  | 'preferred'
  | 'blacklist'
  | 'delete'

export interface SupplierManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier | null
  action: ManagementAction | null
  onSuccess?: () => void
}

//
// UPDATE BALANCE TYPES
//

export type BalanceUpdateType = 'payment' | 'purchase' | 'adjustment'

export interface UpdateBalanceFormData {
  type: BalanceUpdateType
  amount: number
  note?: string
}

export interface UpdateBalanceSectionProps {
  supplier: Supplier
  onSubmit: (data: UpdateBalanceFormData) => Promise<void>
  onCancel: () => void
    isLoading?: boolean  
}

//
// UPDATE RATING TYPES
//

export interface UpdateRatingFormData {
  qualityRating: number
  deliveryRating: number
  priceRating: number
}

export interface UpdateRatingSectionProps {
  supplier: Supplier
  onSubmit: (data: UpdateRatingFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean 
}

//
// PREFERRED SUPPLIER TYPES
//

export interface PreferredSupplierSectionProps {
  supplier: Supplier
  onMarkPreferred: () => Promise<void>
  onRemovePreferred: () => Promise<void>
  onCancel: () => void
    isMarkingPreferred?: boolean      // ⭐ ADD THIS
  isRemovingPreferred?: boolean 
}

//
// BLACKLIST SUPPLIER TYPES
//

export interface BlacklistFormData {
  reason: string
}

export interface BlacklistSupplierSectionProps {
  supplier: Supplier
  onBlacklist: (reason: string) => Promise<void>
  onRemoveBlacklist: () => Promise<void>
  onCancel: () => void
    isBlacklisting?: boolean        
  isRemovingBlacklist?: boolean 
}

//
// DELETE SUPPLIER TYPES
//

export interface DeleteSupplierSectionProps {
  supplier: Supplier
  onDelete: () => Promise<void>
  onRestore: () => Promise<void>
  onCancel: () => void
    isDeleting?: boolean   // ⭐ ADD THIS
  isRestoring?: boolean  
}
