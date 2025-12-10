// ============================================================================
// FILE: src/hooks/customer/useCustomerForm.ts
// Custom Hook for Customer Form State
// ============================================================================

import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  openCreateForm,
  openEditForm,
  closeForm,
  selectCustomerFormState,
} from '@/store/slices/customerSlice'

export const useCustomerForm = () => {
  const dispatch = useAppDispatch()
  const formState = useAppSelector(selectCustomerFormState)

  const openCreate = useCallback(() => {
    dispatch(openCreateForm())
  }, [dispatch])

  const openEdit = useCallback(
    (customerId: string) => {
      dispatch(openEditForm(customerId))
    },
    [dispatch]
  )

  const close = useCallback(() => {
    dispatch(closeForm())
  }, [dispatch])

  return {
    ...formState,
    openCreate,
    openEdit,
    close,
  }
}
