// FILE: src/hooks/bugReport/useBugReport.ts

import { useCallback } from 'react'
import { useCreateBugReportMutation } from '@/store/api/bugReportApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { CreateBugReportInput } from '@/types/bugReport.types'

export const useBugReport = () => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const [createMutation, createState] = useCreateBugReportMutation()

  // ── Submit Bug Report ────────────────────────────────────
  const submitBugReport = useCallback(
    async (
      data: CreateBugReportInput,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await createMutation(data).unwrap()
        showSuccess(
          'bugReport.submitSuccess',
          `bugReport.ticketCreated`
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return {
          success: false,
          error: error?.data?.message || 'bugReport.submitError',
        }
      }
    },
    [createMutation, handleError, showSuccess]
  )

  return {
    submitBugReport,
    isSubmitting: createState.isLoading,
    isSuccess: createState.isSuccess,
    submittedBug: createState.data,
    reset: createState.reset,
  }
}