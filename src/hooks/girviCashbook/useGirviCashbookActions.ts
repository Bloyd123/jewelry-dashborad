// FILE: src/hooks/girviCashbook/useGirviCashbookActions.ts

import { useCallback } from 'react'
import {
  useCreateManualEntryMutation,
  useDeleteCashbookEntryMutation,
} from '@/store/api/girviCashbookApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { ICreateManualEntryForm } from '@/types/girviCashbook.types'

export const useGirviCashbookActions = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const [createMutation, createState] = useCreateManualEntryMutation()
  const [deleteMutation, deleteState] = useDeleteCashbookEntryMutation()

  // ── Create Manual Entry ───────────────────────────────────────────────────
  const createManualEntry = useCallback(
    async (
      data:      ICreateManualEntryForm,
      setErrors?: (e: Record<string, string>) => void
    ) => {
      try {
        const result = await createMutation({ shopId, ...data }).unwrap()
        showSuccess(
          'Cashbook entry created successfully',
          'Entry Created'
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false }
      }
    },
    [createMutation, shopId, handleError, showSuccess]
  )

  const deleteEntry = useCallback(
    async (entryId: string) => {
      try {
        await deleteMutation({ shopId, entryId }).unwrap()
        showSuccess(
          'Cashbook entry deleted successfully',
          'Entry Deleted'
        )
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [deleteMutation, shopId, handleError, showSuccess]
  )

  return {
    createManualEntry,
    deleteEntry,

    isCreating: createState.isLoading,
    isDeleting: deleteState.isLoading,
  }
}