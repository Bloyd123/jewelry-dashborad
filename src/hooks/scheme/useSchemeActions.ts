// FILE: src/hooks/scheme/useSchemeActions.ts

import { useCallback } from 'react'
import {
  useCreateSchemeMutation,
  useUpdateSchemeMutation,
  useDeleteSchemeMutation,
  useActivateSchemeMutation,
  usePauseSchemeMutation,
  useArchiveSchemeMutation,
  useApproveSchemeMutation,
  useRejectSchemeMutation,
  useUpdateSchemeStatusMutation,
  useEnrollCustomerMutation,
  useCancelEnrollmentMutation,
  useUpdateEnrollmentMutation,
  useRecordPaymentMutation,
  useMatureEnrollmentMutation,
  useRedeemEnrollmentMutation,
  useBulkSendRemindersMutation,
  useBulkExportSchemesMutation,
  useSendPaymentRemindersMutation,
} from '@/store/api/schemeApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type {
  CreateSchemeInput,
  UpdateSchemeInput,
  EnrollCustomerInput,
  RecordPaymentInput,
  CancelEnrollmentInput,
  RedeemEnrollmentInput,
  BulkReminderInput,
  BulkExportInput,
  SchemeStatus,
} from '@/types/scheme.types'

export const useSchemeActions = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  // ─────────────────────────────────────────────
  // MUTATIONS
  // ─────────────────────────────────────────────
  const [createMutation,          createState]          = useCreateSchemeMutation()
  const [updateMutation,          updateState]          = useUpdateSchemeMutation()
  const [deleteMutation,          deleteState]          = useDeleteSchemeMutation()
  const [activateMutation,        activateState]        = useActivateSchemeMutation()
  const [pauseMutation,           pauseState]           = usePauseSchemeMutation()
  const [archiveMutation,         archiveState]         = useArchiveSchemeMutation()
  const [approveMutation,         approveState]         = useApproveSchemeMutation()
  const [rejectMutation,          rejectState]          = useRejectSchemeMutation()
  const [statusMutation,          statusState]          = useUpdateSchemeStatusMutation()
  const [enrollMutation,          enrollState]          = useEnrollCustomerMutation()
  const [cancelEnrollMutation,    cancelEnrollState]    = useCancelEnrollmentMutation()
  const [updateEnrollMutation,    updateEnrollState]    = useUpdateEnrollmentMutation()
  const [recordPaymentMutation,   recordPaymentState]   = useRecordPaymentMutation()
  const [matureMutation,          matureState]          = useMatureEnrollmentMutation()
  const [redeemMutation,          redeemState]          = useRedeemEnrollmentMutation()
  const [bulkReminderMutation,    bulkReminderState]    = useBulkSendRemindersMutation()
  const [bulkExportMutation,      bulkExportState]      = useBulkExportSchemesMutation()
  const [sendRemindersMutation,   sendRemindersState]   = useSendPaymentRemindersMutation()

  // ══════════════════════════════════════════
  // SECTION 1 — SCHEME CRUD
  // ══════════════════════════════════════════

  const createScheme = useCallback(
    async (
      data: Omit<CreateSchemeInput, 'shopId'>,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await createMutation({ shopId, ...data }).unwrap()
        showSuccess('scheme.success.created', 'scheme.success.createdTitle')
        return { success: true, data: result }
      } catch (error: any) {
        if (error.data?.errors && Array.isArray(error.data.errors)) {
          const validationErrors: Record<string, string> = {}
          error.data.errors.forEach((err: any) => {
            const fieldMatch = err.detail?.match(/(\w+):/)
            if (fieldMatch) {
              validationErrors[fieldMatch[1]] = err.detail || err.message
            }
          })
          if (Object.keys(validationErrors).length > 0 && setErrors) {
            setErrors(validationErrors)
          }
        }
        const actualError =
          error.data?.errors?.[0]?.detail ||
          error.data?.message ||
          'Failed to create scheme'
        return { success: false, error: actualError }
      }
    },
    [createMutation, shopId]
  )

  const updateScheme = useCallback(
    async (
      schemeId: string,
      data: Omit<UpdateSchemeInput, 'shopId' | 'schemeId'>,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await updateMutation({ shopId, schemeId, ...data }).unwrap()
        showSuccess('scheme.success.updated', 'scheme.success.updatedTitle')
        return { success: true, data: result }
      } catch (error: any) {
        if (error.data?.errors && Array.isArray(error.data.errors)) {
          const validationErrors: Record<string, string> = {}
          error.data.errors.forEach((err: any) => {
            const fieldMatch = err.detail?.match(/(\w+):/)
            if (fieldMatch) {
              validationErrors[fieldMatch[1]] = err.detail || err.message
            }
          })
          if (Object.keys(validationErrors).length > 0 && setErrors) {
            setErrors(validationErrors)
          }
        }
        return {
          success: false,
          error: error.data?.message || 'Failed to update scheme',
        }
      }
    },
    [updateMutation, shopId]
  )

  const deleteScheme = useCallback(
    async (schemeId: string) => {
      try {
        await deleteMutation({ shopId, schemeId }).unwrap()
        showSuccess('scheme.success.deleted', 'scheme.success.deletedTitle')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to delete scheme',
        }
      }
    },
    [deleteMutation, shopId, handleError, showSuccess]
  )

  // ══════════════════════════════════════════
  // SECTION 2 — STATUS MANAGEMENT
  // ══════════════════════════════════════════

  const activateScheme = useCallback(
    async (schemeId: string) => {
      try {
        const result = await activateMutation({ shopId, schemeId }).unwrap()
        showSuccess('scheme.success.activated', 'scheme.success.activatedTitle')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to activate scheme',
        }
      }
    },
    [activateMutation, shopId, handleError, showSuccess]
  )

  const pauseScheme = useCallback(
    async (schemeId: string, reason?: string) => {
      try {
        const result = await pauseMutation({ shopId, schemeId, reason }).unwrap()
        showSuccess('scheme.success.paused', 'scheme.success.pausedTitle')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to pause scheme',
        }
      }
    },
    [pauseMutation, shopId, handleError, showSuccess]
  )

  const archiveScheme = useCallback(
    async (schemeId: string) => {
      try {
        const result = await archiveMutation({ shopId, schemeId }).unwrap()
        showSuccess('scheme.success.archived', 'scheme.success.archivedTitle')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to archive scheme',
        }
      }
    },
    [archiveMutation, shopId, handleError, showSuccess]
  )

  const updateSchemeStatus = useCallback(
    async (schemeId: string, status: SchemeStatus) => {
      try {
        const result = await statusMutation({ shopId, schemeId, status }).unwrap()
        showSuccess('scheme.success.statusUpdated', 'scheme.success.statusUpdatedTitle')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to update status',
        }
      }
    },
    [statusMutation, shopId, handleError, showSuccess]
  )

  // ══════════════════════════════════════════
  // SECTION 3 — APPROVAL
  // ══════════════════════════════════════════

  const approveScheme = useCallback(
    async (schemeId: string, notes?: string) => {
      try {
        const result = await approveMutation({ shopId, schemeId, notes }).unwrap()
        showSuccess('scheme.success.approved', 'scheme.success.approvedTitle')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to approve scheme',
        }
      }
    },
    [approveMutation, shopId, handleError, showSuccess]
  )

  const rejectScheme = useCallback(
    async (schemeId: string, reason: string) => {
      try {
        const result = await rejectMutation({ shopId, schemeId, reason }).unwrap()
        showSuccess('scheme.success.rejected', 'scheme.success.rejectedTitle')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to reject scheme',
        }
      }
    },
    [rejectMutation, shopId, handleError, showSuccess]
  )

  // ══════════════════════════════════════════
  // SECTION 4 — ENROLLMENTS
  // ══════════════════════════════════════════

  const enrollCustomer = useCallback(
    async (
      data: Omit<EnrollCustomerInput, 'shopId'>,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await enrollMutation({ shopId, ...data }).unwrap()
        showSuccess('scheme.success.enrolled', 'scheme.success.enrolledTitle')
        return { success: true, data: result }
      } catch (error: any) {
        if (error.data?.errors && Array.isArray(error.data.errors)) {
          const validationErrors: Record<string, string> = {}
          error.data.errors.forEach((err: any) => {
            const fieldMatch = err.detail?.match(/(\w+):/)
            if (fieldMatch) {
              validationErrors[fieldMatch[1]] = err.detail || err.message
            }
          })
          if (Object.keys(validationErrors).length > 0 && setErrors) {
            setErrors(validationErrors)
          }
        }
        return {
          success: false,
          error: error.data?.message || 'Failed to enroll customer',
        }
      }
    },
    [enrollMutation, shopId]
  )

  const cancelEnrollment = useCallback(
    async (data: Omit<CancelEnrollmentInput, 'shopId'>) => {
      try {
        const result = await cancelEnrollMutation({ shopId, ...data }).unwrap()
        showSuccess('scheme.success.enrollmentCancelled', 'scheme.success.enrollmentCancelledTitle')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to cancel enrollment',
        }
      }
    },
    [cancelEnrollMutation, shopId, handleError, showSuccess]
  )

  const updateEnrollment = useCallback(
    async (enrollmentId: string, data: Record<string, any>) => {
      try {
        const result = await updateEnrollMutation({ shopId, enrollmentId, ...data }).unwrap()
        showSuccess('scheme.success.enrollmentUpdated', 'scheme.success.enrollmentUpdatedTitle')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to update enrollment',
        }
      }
    },
    [updateEnrollMutation, shopId, handleError, showSuccess]
  )

  // ══════════════════════════════════════════
  // SECTION 5 — PAYMENTS
  // ══════════════════════════════════════════

  const recordPayment = useCallback(
    async (data: Omit<RecordPaymentInput, 'shopId'>) => {
      try {
        const result = await recordPaymentMutation({ shopId, ...data }).unwrap()
        showSuccess('scheme.success.paymentRecorded', 'scheme.success.paymentRecordedTitle')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to record payment',
        }
      }
    },
    [recordPaymentMutation, shopId, handleError, showSuccess]
  )

  // ══════════════════════════════════════════
  // SECTION 6 — MATURITY
  // ══════════════════════════════════════════

  const matureEnrollment = useCallback(
    async (enrollmentId: string) => {
      try {
        const result = await matureMutation({ shopId, enrollmentId }).unwrap()
        showSuccess('scheme.success.matured', 'scheme.success.maturedTitle')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to mature enrollment',
        }
      }
    },
    [matureMutation, shopId, handleError, showSuccess]
  )

  const redeemEnrollment = useCallback(
    async (data: Omit<RedeemEnrollmentInput, 'shopId'>) => {
      try {
        const result = await redeemMutation({ shopId, ...data }).unwrap()
        showSuccess('scheme.success.redeemed', 'scheme.success.redeemedTitle')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to redeem enrollment',
        }
      }
    },
    [redeemMutation, shopId, handleError, showSuccess]
  )

  // ══════════════════════════════════════════
  // SECTION 7 — REMINDERS & EXPORT
  // ══════════════════════════════════════════

  const sendPaymentReminders = useCallback(
    async (data: Omit<BulkReminderInput, 'shopId'>) => {
      try {
        const result = await sendRemindersMutation({ shopId, ...data }).unwrap()
        showSuccess('scheme.success.remindersSent', 'scheme.success.remindersSentTitle')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to send reminders',
        }
      }
    },
    [sendRemindersMutation, shopId, handleError, showSuccess]
  )

  const bulkSendReminders = useCallback(
    async (data: Omit<BulkReminderInput, 'shopId'>) => {
      try {
        const result = await bulkReminderMutation({ shopId, ...data }).unwrap()
        showSuccess('scheme.success.bulkRemindersSent', 'scheme.success.bulkRemindersSentTitle')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to send bulk reminders',
        }
      }
    },
    [bulkReminderMutation, shopId, handleError, showSuccess]
  )

  const bulkExportSchemes = useCallback(
    async (data: Omit<BulkExportInput, 'shopId'>) => {
      try {
        const result = await bulkExportMutation({ shopId, ...data }).unwrap()
        showSuccess('scheme.success.exported', 'scheme.success.exportedTitle')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to export schemes',
        }
      }
    },
    [bulkExportMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────
  return {
    // Scheme CRUD
    createScheme,
    updateScheme,
    deleteScheme,

    // Status
    activateScheme,
    pauseScheme,
    archiveScheme,
    updateSchemeStatus,

    // Approval
    approveScheme,
    rejectScheme,

    // Enrollments
    enrollCustomer,
    cancelEnrollment,
    updateEnrollment,

    // Payments
    recordPayment,

    // Maturity
    matureEnrollment,
    redeemEnrollment,

    // Reminders & Export
    sendPaymentReminders,
    bulkSendReminders,
    bulkExportSchemes,

    // Loading States
    isCreating:          createState.isLoading,
    isUpdating:          updateState.isLoading,
    isDeleting:          deleteState.isLoading,
    isActivating:        activateState.isLoading,
    isPausing:           pauseState.isLoading,
    isArchiving:         archiveState.isLoading,
    isApproving:         approveState.isLoading,
    isRejecting:         rejectState.isLoading,
    isUpdatingStatus:    statusState.isLoading,
    isEnrolling:         enrollState.isLoading,
    isCancellingEnroll:  cancelEnrollState.isLoading,
    isUpdatingEnroll:    updateEnrollState.isLoading,
    isRecordingPayment:  recordPaymentState.isLoading,
    isMaturing:          matureState.isLoading,
    isRedeeming:         redeemState.isLoading,
    isSendingReminders:  sendRemindersState.isLoading,
    isBulkReminding:     bulkReminderState.isLoading,
    isExporting:         bulkExportState.isLoading,
  }
}