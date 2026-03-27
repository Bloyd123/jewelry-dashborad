// FILE: src/hooks/purchase/usePurchaseList.ts

import { useCallback } from 'react'
import {
  useGetPurchasesQuery,
  useDeletePurchaseMutation,
  useBulkDeletePurchasesMutation,
  useBulkApprovePurchasesMutation,
} from '@/store/api/purchaseApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { IPurchaseFilters,IPurchase } from '@/types/purchase.types'

export const usePurchaseList = (
  shopId: string,
  filters?: Partial<IPurchaseFilters>
) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const { data, isLoading, isFetching, error, refetch } = useGetPurchasesQuery({
    shopId,
    page:  filters?.page  ?? 1,
    limit: filters?.limit ?? 20,
    ...filters,
  })

  const [deleteMutation,      deleteState]      = useDeletePurchaseMutation()
  const [bulkDeleteMutation,  bulkDeleteState]  = useBulkDeletePurchasesMutation()
  const [bulkApproveMutation, bulkApproveState] = useBulkApprovePurchasesMutation()

  const deletePurchase = useCallback(
    async (purchaseId: string) => {
      try {
        await deleteMutation({ shopId, purchaseId }).unwrap()
        showSuccess('Purchase deleted successfully', 'Deleted')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [deleteMutation, shopId, handleError, showSuccess]
  )

  const bulkDelete = useCallback(
    async (purchaseIds: string[]) => {
      try {
        const result = await bulkDeleteMutation({ shopId, purchaseIds }).unwrap()
        showSuccess(`${result.deletedCount} purchases deleted`, 'Bulk Delete')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [bulkDeleteMutation, shopId, handleError, showSuccess]
  )

  const bulkApprove = useCallback(
    async (purchaseIds: string[]) => {
      try {
        const result = await bulkApproveMutation({ shopId, purchaseIds }).unwrap()
        showSuccess(`${result.approvedCount} purchases approved`, 'Bulk Approve')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [bulkApproveMutation, shopId, handleError, showSuccess]
  )

  return {
purchases: ((data?.data as any)?.purchases ?? data?.data ?? []) as IPurchase[],
pagination: (data as any)?.meta?.pagination,
    isLoading:   isLoading || isFetching,
    isDeleting:  deleteState.isLoading,
    isBulkDeleting: bulkDeleteState.isLoading,
    isBulkApproving: bulkApproveState.isLoading,
    error,
    refetch,
    deletePurchase,
    bulkDelete,
    bulkApprove,
  }
}