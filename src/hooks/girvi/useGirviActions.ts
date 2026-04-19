// FILE: src/features/girvi/hooks/useGirviActions.ts
import { useCallback } from 'react'
import {
  useCreateGirviMutation,
  useUpdateGirviMutation,
  useDeleteGirviMutation,
  useReleaseGirviMutation,
  usePartialReleaseGirviMutation,
  useRenewGirviMutation,
} from '@/store/api/girviApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type {
  CreateGirviRequest,
  UpdateGirviRequest,
  ReleaseGirviRequest,
  PartialReleaseRequest,
  RenewalRequest,
} from '@/types/girvi.types'

export const useGirviActions = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const [createMutation,         createState]         = useCreateGirviMutation()
  const [updateMutation,         updateState]         = useUpdateGirviMutation()
  const [deleteMutation,         deleteState]         = useDeleteGirviMutation()
  const [releaseMutation,        releaseState]        = useReleaseGirviMutation()
  const [partialReleaseMutation, partialReleaseState] = usePartialReleaseGirviMutation()
  const [renewMutation,          renewState]          = useRenewGirviMutation()

  // CREATE GIRVI (Jama)
  const createGirvi = useCallback(
    async (
      data: CreateGirviRequest,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await createMutation({ shopId, ...data }).unwrap()
        showSuccess(
          `Girvi ${result.girviNumber} created successfully`,
          'Girvi Created'
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error.data?.message }
      }
    },
    [createMutation, shopId, handleError, showSuccess]
  )

  // UPDATE GIRVI
  const updateGirvi = useCallback(
    async (
      girviId: string,
      data: UpdateGirviRequest,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await updateMutation({ shopId, girviId, ...data }).unwrap()
        showSuccess('Girvi updated successfully', 'Girvi Updated')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error.data?.message }
      }
    },
    [updateMutation, shopId, handleError, showSuccess]
  )

  // DELETE GIRVI (soft delete)
  const deleteGirvi = useCallback(
    async (girviId: string) => {
      try {
        const result = await deleteMutation({ shopId, girviId }).unwrap()
        showSuccess('Girvi deleted successfully', 'Girvi Deleted')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [deleteMutation, shopId, handleError, showSuccess]
  )

  // PATCH /girvi/:girviId/release
  const releaseGirvi = useCallback(
    async (
      girviId: string,
      data: ReleaseGirviRequest,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await releaseMutation({ shopId, girviId, ...data }).unwrap()
        showSuccess(
          `Girvi released. ₹${result.releaseSummary.netAmountReceived.toLocaleString('en-IN')} received`,
          'Girvi Released'
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error.data?.message }
      }
    },
    [releaseMutation, shopId, handleError, showSuccess]
  )

  // PATCH /girvi/:girviId/partial-release
  const partialRelease = useCallback(
    async (
      girviId: string,
      data: PartialReleaseRequest,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await partialReleaseMutation({ shopId, girviId, ...data }).unwrap()
        const { releasedItems, netAmountReceived } = result.partialReleaseSummary
        showSuccess(
          `${releasedItems.length} item(s) released. ₹${netAmountReceived.toLocaleString('en-IN')} received`,
          'Partial Release Done'
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error.data?.message }
      }
    },
    [partialReleaseMutation, shopId, handleError, showSuccess]
  )

  // RENEWAL
  // PATCH /girvi/:girviId/renew
  const renewGirvi = useCallback(
    async (
      girviId: string,
      data: RenewalRequest,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await renewMutation({ shopId, girviId, ...data }).unwrap()
        showSuccess(
          `Girvi renewed till ${new Date(result.renewalSummary.newDueDate).toLocaleDateString('en-IN')}`,
          'Girvi Renewed'
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error.data?.message }
      }
    },
    [renewMutation, shopId, handleError, showSuccess]
  )

  return {
    createGirvi,
    updateGirvi,
    deleteGirvi,
    releaseGirvi,
    partialRelease,
    renewGirvi,

    isCreating:         createState.isLoading,
    isUpdating:         updateState.isLoading,
    isDeleting:         deleteState.isLoading,
    isReleasing:        releaseState.isLoading,
    isPartialReleasing: partialReleaseState.isLoading,
    isRenewing:         renewState.isLoading,

    isMutating:
      createState.isLoading         ||
      updateState.isLoading         ||
      deleteState.isLoading         ||
      releaseState.isLoading        ||
      partialReleaseState.isLoading ||
      renewState.isLoading,
  }
}