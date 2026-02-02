// FILE: src/features/product/hooks/useProductActions.ts

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateStockMutation,
  useReserveProductMutation,
  useCancelReservationMutation,
  useMarkAsSoldMutation,
  useCalculatePriceMutation,
} from '@/store/api/productApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type {
  ProductFormData,
  StockUpdateData,
  ReservationData,
  SaleData,
  PriceCalculationData,
} from '@/types/product.types'

/**
 *  PRODUCT ACTIONS HOOK
 * Handles all product CRUD and inventory operations
 */
export const useProductActions = (shopId: string) => {
  const { t } = useTranslation()
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  
  //  MUTATIONS
  
  const [createMutation, createState] = useCreateProductMutation()
  const [updateMutation, updateState] = useUpdateProductMutation()
  const [deleteMutation, deleteState] = useDeleteProductMutation()
  const [updateStockMutation, updateStockState] = useUpdateStockMutation()
  const [reserveMutation, reserveState] = useReserveProductMutation()
  const [cancelReservationMutation, cancelReservationState] =
    useCancelReservationMutation()
  const [markAsSoldMutation, markAsSoldState] = useMarkAsSoldMutation()
  const [calculatePriceMutation, calculatePriceState] =
    useCalculatePriceMutation()

  
  //  CREATE PRODUCT
  
  const createProduct = useCallback(
    async (
      data: Omit<ProductFormData, 'shopId'>,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await createMutation({ shopId, ...data }).unwrap()
        showSuccess(
          t('product.messages.createSuccess'),
          t('product.messages.created')
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return {
          success: false,
          error: error.data?.message || t('product.errors.createFailed'),
        }
      }
    },
    [createMutation, shopId, handleError, showSuccess, t]
  )

  
  //  UPDATE PRODUCT
  
  const updateProduct = useCallback(
    async (
      id: string,
      data: Partial<Omit<ProductFormData, 'shopId' | 'id'>>,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await updateMutation({ shopId, id, ...data }).unwrap()
        showSuccess(
          t('product.messages.updateSuccess'),
          t('product.messages.updated')
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return {
          success: false,
          error: error.data?.message || t('product.errors.updateFailed'),
        }
      }
    },
    [updateMutation, shopId, handleError, showSuccess, t]
  )

  
  // 🗑 DELETE PRODUCT
  
  const deleteProduct = useCallback(
    async (id: string) => {
      try {
        await deleteMutation({ shopId, id }).unwrap()
        showSuccess(
          t('product.messages.deleteSuccess'),
          t('product.messages.deleted')
        )
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || t('product.errors.deleteFailed'),
        }
      }
    },
    [deleteMutation, shopId, handleError, showSuccess, t]
  )

  
  //  UPDATE STOCK
  
  const updateStock = useCallback(
    async (id: string, data: Omit<StockUpdateData, 'shopId' | 'id'>) => {
      try {
        const result = await updateStockMutation({
          shopId,
          id,
          ...data,
        }).unwrap()
        showSuccess(
          t('product.messages.stockUpdateSuccess'),
          t('product.messages.stockUpdated')
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || t('product.errors.stockUpdateFailed'),
        }
      }
    },
    [updateStockMutation, shopId, handleError, showSuccess, t]
  )

  
  //  RESERVE PRODUCT
  
  const reserveProduct = useCallback(
    async (id: string, data: Omit<ReservationData, 'shopId' | 'id'>) => {
      try {
        const result = await reserveMutation({ shopId, id, ...data }).unwrap()
        showSuccess(
          t('product.messages.reserveSuccess'),
          t('product.messages.reserved')
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || t('product.errors.reserveFailed'),
        }
      }
    },
    [reserveMutation, shopId, handleError, showSuccess, t]
  )

  
  //  CANCEL RESERVATION
  
  const cancelReservation = useCallback(
    async (id: string) => {
      try {
        const result = await cancelReservationMutation({ shopId, id }).unwrap()
        showSuccess(
          t('product.messages.cancelReservationSuccess'),
          t('product.messages.reservationCancelled')
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error:
            error.data?.message || t('product.errors.cancelReservationFailed'),
        }
      }
    },
    [cancelReservationMutation, shopId, handleError, showSuccess, t]
  )

  
  //  MARK AS SOLD
  
  const markAsSold = useCallback(
    async (id: string, data: Omit<SaleData, 'shopId' | 'id'>) => {
      try {
        const result = await markAsSoldMutation({
          shopId,
          id,
          ...data,
        }).unwrap()
        showSuccess(
          t('product.messages.markAsSoldSuccess'),
          t('product.messages.sold')
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || t('product.errors.markAsSoldFailed'),
        }
      }
    },
    [markAsSoldMutation, shopId, handleError, showSuccess, t]
  )

  
  //  CALCULATE PRICE
  
  const calculatePrice = useCallback(
    async (id: string, data: Omit<PriceCalculationData, 'shopId' | 'id'>) => {
      try {
        const result = await calculatePriceMutation({
          shopId,
          id,
          ...data,
        }).unwrap()
        showSuccess(
          t('product.messages.calculatePriceSuccess'),
          t('product.messages.priceCalculated')
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error:
            error.data?.message || t('product.errors.calculatePriceFailed'),
        }
      }
    },
    [calculatePriceMutation, shopId, handleError, showSuccess, t]
  )

  
  //  RETURN API
  
  return {
    // Actions
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    reserveProduct,
    cancelReservation,
    markAsSold,
    calculatePrice,

    // Loading states
    isCreating: createState.isLoading,
    isUpdating: updateState.isLoading,
    isDeleting: deleteState.isLoading,
    isUpdatingStock: updateStockState.isLoading,
    isReserving: reserveState.isLoading,
    isCancellingReservation: cancelReservationState.isLoading,
    isMarkingAsSold: markAsSoldState.isLoading,
    isCalculatingPrice: calculatePriceState.isLoading,

    // States (for advanced usage)
    createState,
    updateState,
    deleteState,
    updateStockState,
    reserveState,
    cancelReservationState,
    markAsSoldState,
    calculatePriceState,
  }
}