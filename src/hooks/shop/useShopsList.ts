// FILE: src/features/shops/hooks/useShopsList.ts

import { useState, useCallback } from 'react'
import {
  useGetShopsQuery,
  useCreateShopMutation,
  useDeleteShopMutation,
} from '@/store/api/ShopApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { ShopQueryParams, ShopFormData, ShopFilters } from '@/types/shop.types'

export const useShopsList = (initialFilters?: Partial<ShopQueryParams>) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const [filters, setFilters] = useState<ShopQueryParams>({
    page: 1,
    limit: 10,
    ...initialFilters,
  })

  const { data, isLoading, isFetching, error, refetch } = useGetShopsQuery(filters)

  const [createMutation, createState] = useCreateShopMutation()
  const [deleteMutation, deleteState] = useDeleteShopMutation()

  const createShop = useCallback(
    async (
      formData: ShopFormData,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await createMutation(formData).unwrap()
        showSuccess(result.message || 'Shop created successfully', 'Shop Created')
        return { success: true, data: result.data }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error?.data?.message || 'Failed to create shop' }
      }
    },
    [createMutation, handleError, showSuccess]
  )

  const deleteShop = useCallback(
    async (id: string) => {
      try {
        const result = await deleteMutation(id).unwrap()
        showSuccess(result.message || 'Shop deleted successfully', 'Shop Deleted')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error?.data?.message || 'Failed to delete shop' }
      }
    },
    [deleteMutation, handleError, showSuccess]
  )

  const updateFilters = useCallback((newFilters: Partial<ShopFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  const setPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 10 })
  }, [])

  return {
    shops: data?.data || [],
    pagination: data?.pagination || null,
    totalResults: data?.results || 0,
    isLoading: isLoading || isFetching,
    isCreating: createState.isLoading,
    isDeleting: deleteState.isLoading,
    createShop,
    deleteShop,
    refetch,
    filters,
    updateFilters,
    setPage,
    resetFilters,
    error,
  }
}