// ============================================================================
// FILE: src/hooks/customer/useCustomerPagination.ts
// Custom Hook for Customer Pagination
// ============================================================================

import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  setCurrentPage,
  setPageSize,
  nextPage,
  previousPage,
  selectCustomerPagination,
} from '@/store/slices/customerSlice'

export const useCustomerPagination = () => {
  const dispatch = useAppDispatch()
  const pagination = useAppSelector(selectCustomerPagination)

  const goToPage = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page))
    },
    [dispatch]
  )

  const changePageSize = useCallback(
    (size: number) => {
      dispatch(setPageSize(size))
    },
    [dispatch]
  )

  const goToNextPage = useCallback(() => {
    dispatch(nextPage())
  }, [dispatch])

  const goToPreviousPage = useCallback(() => {
    dispatch(previousPage())
  }, [dispatch])

  return {
    ...pagination,
    goToPage,
    changePageSize,
    goToNextPage,
    goToPreviousPage,
  }
}