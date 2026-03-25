// FILE: src/features/product/hooks/useProductActions.ts

import { useCallback } from 'react'
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useBulkDeleteProductsMutation,
  useBulkUpdateStatusMutation,
} from '@/store/api/productApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type {
  CreateProductInput,
  UpdateProductInput,
  BulkUpdateStatusInput,
} from '@/types/product.types'

export const useProductActions = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const [createMutation, createState]           = useCreateProductMutation()
  const [updateMutation, updateState]           = useUpdateProductMutation()
  const [deleteMutation, deleteState]           = useDeleteProductMutation()
  const [bulkDeleteMutation, bulkDeleteState]   = useBulkDeleteProductsMutation()
  const [bulkStatusMutation, bulkStatusState]   = useBulkUpdateStatusMutation()

  // ── CREATE ────────────────────────────────────────────────────
  const createProduct = useCallback(
    async (
      data: CreateProductInput,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await createMutation({ shopId, ...data }).unwrap()
        showSuccess('Product created successfully!', 'Product Created')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error.data?.message || 'Failed to create product' }
      }
    },
    [createMutation, shopId, handleError, showSuccess]
  )

  // ── UPDATE ────────────────────────────────────────────────────
  const updateProduct = useCallback(
    async (
      id: string,
      data: Omit<UpdateProductInput, 'id'>,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await updateMutation({ shopId, id, ...data }).unwrap()
        showSuccess('Product updated successfully!', 'Product Updated')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error.data?.message || 'Failed to update product' }
      }
    },
    [updateMutation, shopId, handleError, showSuccess]
  )

  // ── DELETE ────────────────────────────────────────────────────
  const deleteProduct = useCallback(
    async (id: string) => {
      try {
        await deleteMutation({ shopId, id }).unwrap()
        showSuccess('Product deleted successfully!', 'Product Deleted')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message || 'Failed to delete product' }
      }
    },
    [deleteMutation, shopId, handleError, showSuccess]
  )

  // ── BULK DELETE ───────────────────────────────────────────────
  const bulkDeleteProducts = useCallback(
    async (productIds: string[]) => {
      try {
        const result = await bulkDeleteMutation({ shopId, productIds }).unwrap()
        showSuccess(`${result.deletedCount} products deleted!`, 'Bulk Delete')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message || 'Bulk delete failed' }
      }
    },
    [bulkDeleteMutation, shopId, handleError, showSuccess]
  )

  // ── BULK UPDATE STATUS ────────────────────────────────────────
  const bulkUpdateStatus = useCallback(
    async (productIds: string[], status: BulkUpdateStatusInput['status']) => {
      try {
        const result = await bulkStatusMutation({ shopId, productIds, status }).unwrap()
        showSuccess(`${result.modifiedCount} products updated!`, 'Bulk Update')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message || 'Bulk update failed' }
      }
    },
    [bulkStatusMutation, shopId, handleError, showSuccess]
  )

  return {
    // Actions
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    bulkUpdateStatus,

    // Loading states
    isCreating:       createState.isLoading,
    isUpdating:       updateState.isLoading,
    isDeleting:       deleteState.isLoading,
    isBulkDeleting:   bulkDeleteState.isLoading,
    isBulkUpdating:   bulkStatusState.isLoading,

    // Raw states (for form error handling)
    createState,
    updateState,
    deleteState,
  }
}