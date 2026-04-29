// FILE: src/hooks/user/useUserActions.ts

import { useCallback } from 'react'
import {
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useAdminResetPasswordMutation,
  useUpdateUserMutation,
} from '@/store/api/userApi'
import type { UpdateUserInput } from '@/store/api/userApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import { useTranslation } from 'react-i18next'

export const useUserActions = () => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()
  const { t } = useTranslation()

  const [deleteMutation,         deleteState]         = useDeleteUserMutation()
  const [activateMutation,       activateState]       = useActivateUserMutation()
  const [deactivateMutation,     deactivateState]     = useDeactivateUserMutation()
  const [resetPasswordMutation,  resetPasswordState]  = useAdminResetPasswordMutation()
  const [updateMutation,         updateState]         = useUpdateUserMutation()

  // ── Delete ─────────────────────────────────────────────
  const deleteUser = useCallback(async (userId: string) => {
    try {
      await deleteMutation(userId).unwrap()
      showSuccess(t('user.deleteSuccess'), t('user.deleteSuccessDesc'))
      return { success: true }
    } catch (error: any) {
      handleError(error)
      return { success: false }
    }
  }, [deleteMutation, handleError, showSuccess, t])

  // ── Activate ───────────────────────────────────────────
  const activateUser = useCallback(async (userId: string) => {
    try {
      await activateMutation(userId).unwrap()
      showSuccess(t('user.activateSuccess'), t('user.activateSuccessDesc'))
      return { success: true }
    } catch (error: any) {
      handleError(error)
      return { success: false }
    }
  }, [activateMutation, handleError, showSuccess, t])

  // ── Deactivate ─────────────────────────────────────────
  const deactivateUser = useCallback(async (userId: string) => {
    try {
      await deactivateMutation(userId).unwrap()
      showSuccess(t('user.deactivateSuccess'), t('user.deactivateSuccessDesc'))
      return { success: true }
    } catch (error: any) {
      handleError(error)
      return { success: false }
    }
  }, [deactivateMutation, handleError, showSuccess, t])

  // ── Admin Reset Password ───────────────────────────────
  const adminResetPassword = useCallback(
    async (userId: string, newPassword: string) => {
      try {
        await resetPasswordMutation({ userId, newPassword }).unwrap()
        showSuccess(t('user.resetPasswordSuccess'), t('user.resetPasswordSuccessDesc'))
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [resetPasswordMutation, handleError, showSuccess, t]
  )

  // ── Update ─────────────────────────────────────────────
  const updateUser = useCallback(
    async (data: UpdateUserInput) => {
      try {
        const result = await updateMutation(data).unwrap()
        showSuccess(t('user.updateSuccess'), t('user.updateSuccessDesc'))
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [updateMutation, handleError, showSuccess, t]
  )

  return {
    deleteUser,
    activateUser,
    deactivateUser,
    adminResetPassword,
    updateUser,
    isDeleting:        deleteState.isLoading,
    isActivating:      activateState.isLoading,
    isDeactivating:    deactivateState.isLoading,
    isResettingPassword: resetPasswordState.isLoading,
    isUpdating:        updateState.isLoading,
  }
}