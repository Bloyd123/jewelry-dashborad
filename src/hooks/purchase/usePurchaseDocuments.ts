// FILE: src/hooks/purchase/usePurchaseDocuments.ts

import { useCallback } from 'react'
import {
  useGetPurchaseDocumentsQuery,
  useUploadDocumentMutation,
} from '@/store/api/purchaseApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'

export const usePurchaseDocuments = (shopId: string, purchaseId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  // ── GET Documents ──
  const {
    data: documents,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPurchaseDocumentsQuery(
    { shopId, purchaseId },
    { skip: !shopId || !purchaseId }
  )

  // ── UPLOAD Document ──
  const [uploadDocMutation, uploadDocState] = useUploadDocumentMutation()

  const uploadDocument = useCallback(
    async (
      documentType: string,
      documentUrl: string,
      documentNumber?: string
    ) => {
      try {
        const result = await uploadDocMutation({
          shopId,
          purchaseId,
          documentType,
          documentUrl,
          documentNumber,
        }).unwrap()
        showSuccess('Document uploaded successfully', 'Uploaded')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [uploadDocMutation, shopId, purchaseId, handleError, showSuccess]
  )

  return {
    // Data
    documents:       documents ?? [],
    totalDocuments:  documents?.length ?? 0,
    canUploadMore:   (documents?.length ?? 0) < 10, // max 10 allowed
    isLoading:       isLoading || isFetching,
    isUploading:     uploadDocState.isLoading,
    error,

    // Actions
    uploadDocument,
    refetch,
  }
}