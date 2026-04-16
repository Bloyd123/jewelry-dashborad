// FILE: src/features/openingBalance/hooks/useOpeningBalance.ts

import { useCallback } from 'react'
import {
  useGetSetupStatusQuery,
  useGetOpeningBalanceQuery,
  useCreateOrUpdateOpeningBalanceMutation,
  useConfirmOpeningBalanceMutation,
} from '@/store/api/openingBalanceApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { CreateOrUpdateOpeningBalanceInput } from '@/types/openingBalance.types'

export const useOpeningBalance = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const {
    data: setupStatus,
    isLoading: isStatusLoading,
    refetch: refetchStatus,
  } = useGetSetupStatusQuery({ shopId }, { skip: !shopId })

  const {
    data: openingBalanceData,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useGetOpeningBalanceQuery({ shopId }, { skip: !shopId })

  const [saveBalanceMutation, saveState]     = useCreateOrUpdateOpeningBalanceMutation()
  const [confirmBalanceMutation, confirmState] = useConfirmOpeningBalanceMutation()

  const saveOpeningBalance = useCallback(
    async (data: CreateOrUpdateOpeningBalanceInput) => {
      try {
        const result = await saveBalanceMutation({ shopId, ...data }).unwrap()
        showSuccess('Opening balance saved as draft!', 'Draft Saved')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message || 'Failed to save' }
      }
    },
    [saveBalanceMutation, shopId, handleError, showSuccess]
  )

  const confirmOpeningBalance = useCallback(
    async () => {
      try {
        const result = await confirmBalanceMutation({ shopId }).unwrap()
        showSuccess('Opening balance confirmed successfully!', 'Confirmed')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message || 'Failed to confirm' }
      }
    },
    [confirmBalanceMutation, shopId, handleError, showSuccess]
  )
  const isConfirmed = setupStatus?.openingBalanceStatus === 'confirmed'
  const isDraft     = setupStatus?.openingBalanceStatus === 'draft'
  const isNotStarted = setupStatus?.openingBalanceStatus === 'not_started'

  const openingBalance = openingBalanceData && 'data' in openingBalanceData
    ? openingBalanceData.data
    : openingBalanceData && 'exists' in openingBalanceData && openingBalanceData.exists
      ? (openingBalanceData as any).data
      : null

  return {
    // Data
    setupStatus,
    openingBalance,

    // Derived
    isConfirmed,
    isDraft,
    isNotStarted,

    // Loading
    isLoading:      isStatusLoading || isBalanceLoading,
    isSaving:       saveState.isLoading,
    isConfirming:   confirmState.isLoading,

    // Actions
    saveOpeningBalance,
    confirmOpeningBalance,
    refetchStatus,
    refetchBalance,
  }
}