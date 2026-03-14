// FILE: src/features/purchase/hooks/usePurchaseDocuments.ts
// Purchase Module - Documents Management Hook

import { useGetDocumentsQuery } from '@/store/api/purchaseApi'
import { useMemo } from 'react'
import type { IDocument } from '@/types/purchase.types'

/**
 * 🎯 PURCHASE DOCUMENTS HOOK
 * Get all documents for a specific purchase
 */
export const usePurchaseDocuments = (shopId: string, purchaseId: string) => {
  const {
    data: documents,
    isLoading,
    error,
    refetch,
  } = useGetDocumentsQuery({ shopId, purchaseId }, { skip: !purchaseId })

  // Document statistics
  const documentStats = useMemo(() => {
    if (!documents || documents.length === 0) {
      return {
        total: 0,
        byType: {},
        hasInvoice: false,
        hasReceipt: false,
        hasCertificate: false,
      }
    }

    const byType = documents.reduce(
      (acc, doc) => {
        acc[doc.documentType] = (acc[doc.documentType] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      total: documents.length,
      byType,
      hasInvoice: byType['invoice'] > 0,
      hasReceipt: byType['receipt'] > 0,
      hasCertificate: byType['certificate'] > 0,
    }
  }, [documents])

  return {
    documents: documents || [],
    documentStats,
    isLoading,
    error,
    refetch,
  }
}

/**
 * 🎯 DOCUMENTS BY TYPE HOOK
 * Filter documents by type
 */
export const useDocumentsByType = (
  shopId: string,
  purchaseId: string,
  documentType: string
) => {
  const { documents, isLoading, error } = usePurchaseDocuments(
    shopId,
    purchaseId
  )

  const filteredDocuments = useMemo(() => {
    if (!documents) return []
    return documents.filter(doc => doc.documentType === documentType)
  }, [documents, documentType])

  return {
    documents: filteredDocuments,
    count: filteredDocuments.length,
    isLoading,
    error,
  }
}

/**
 * 🎯 INVOICE DOCUMENTS HOOK
 * Get all invoice documents
 */
export const useInvoiceDocuments = (shopId: string, purchaseId: string) => {
  return useDocumentsByType(shopId, purchaseId, 'invoice')
}

/**
 * 🎯 RECEIPT DOCUMENTS HOOK
 * Get all receipt documents
 */
export const useReceiptDocuments = (shopId: string, purchaseId: string) => {
  return useDocumentsByType(shopId, purchaseId, 'receipt')
}

/**
 * 🎯 CERTIFICATE DOCUMENTS HOOK
 * Get all certificate documents
 */
export const useCertificateDocuments = (shopId: string, purchaseId: string) => {
  return useDocumentsByType(shopId, purchaseId, 'certificate')
}

/**
 * 🎯 RECENT DOCUMENTS HOOK
 * Get most recently uploaded documents
 */
export const useRecentDocuments = (
  shopId: string,
  purchaseId: string,
  limit: number = 5
) => {
  const { documents, isLoading } = usePurchaseDocuments(shopId, purchaseId)

  const recentDocuments = useMemo(() => {
    if (!documents) return []

    return [...documents]
      .sort(
        (a, b) =>
          new Date(b.uploadedAt!).getTime() - new Date(a.uploadedAt!).getTime()
      )
      .slice(0, limit)
  }, [documents, limit])

  return {
    recentDocuments,
    isLoading,
  }
}

/**
 * 🎯 DOCUMENT VALIDATION HOOK
 * Validate document before upload
 */
export const useDocumentValidation = () => {
  const validateDocument = (file: File) => {
    const errors: string[] = []

    // File size validation (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      errors.push('File size must be less than 10MB')
    }

    // File type validation
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ]
    if (!allowedTypes.includes(file.type)) {
      errors.push('Only PDF and image files (JPEG, PNG, WebP) are allowed')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  return {
    validateDocument,
  }
}

/**
 * 🎯 DOCUMENT ORGANIZER HOOK
 * Organize documents by category/type
 */
export const useDocumentOrganizer = (shopId: string, purchaseId: string) => {
  const { documents, isLoading } = usePurchaseDocuments(shopId, purchaseId)

  const organized = useMemo(() => {
    if (!documents) {
      return {
        invoices: [],
        receipts: [],
        certificates: [],
        deliveryNotes: [],
        others: [],
      }
    }

    return {
      invoices: documents.filter(d => d.documentType === 'invoice'),
      receipts: documents.filter(d => d.documentType === 'receipt'),
      certificates: documents.filter(d => d.documentType === 'certificate'),
      deliveryNotes: documents.filter(d => d.documentType === 'delivery_note'),
      others: documents.filter(d => d.documentType === 'other'),
    }
  }, [documents])

  return {
    organized,
    isLoading,
  }
}

/**
 * 🎯 MISSING DOCUMENTS CHECKER HOOK
 * Check which required documents are missing
 */
export const useMissingDocuments = (shopId: string, purchaseId: string) => {
  const { documentStats, isLoading } = usePurchaseDocuments(shopId, purchaseId)

  const missingDocuments = useMemo(() => {
    const required = [
      { type: 'invoice', label: 'Invoice' },
      { type: 'receipt', label: 'Receipt' },
    ]

    return required.filter(
      doc =>
        !documentStats.byType[doc.type] || documentStats.byType[doc.type] === 0
    )
  }, [documentStats])

  return {
    missingDocuments,
    hasMissingDocuments: missingDocuments.length > 0,
    isComplete: missingDocuments.length === 0,
    isLoading,
  }
}

/**
 * 🎯 DOCUMENT SEARCH HOOK
 * Search documents by number or name
 */
export const useDocumentSearch = (
  shopId: string,
  purchaseId: string,
  searchTerm: string
) => {
  const { documents, isLoading } = usePurchaseDocuments(shopId, purchaseId)

  const searchResults = useMemo(() => {
    if (!documents || !searchTerm) return documents || []

    const term = searchTerm.toLowerCase().trim()

    return documents.filter(doc => {
      const number = doc.documentNumber?.toLowerCase() || ''
      const type = doc.documentType.toLowerCase()

      return number.includes(term) || type.includes(term)
    })
  }, [documents, searchTerm])

  return {
    searchResults,
    isLoading,
    hasResults: searchResults.length > 0,
  }
}

export default usePurchaseDocuments
