// ============================================================================
// USAGE EXAMPLE: How to Use SaleForm Component
// ============================================================================

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SaleForm } from '@/components/sales/SalesForm'
import type { SaleFormData } from '@/components/sales/SalesForm'

// ============================================================================
// EXAMPLE 1: Create New Sale Page
// ============================================================================

export const CreateSalePage = () => {
  const navigate = useNavigate()
  const { shopId } = useParams<{ shopId: string }>()

  const handleSuccess = () => {
    // Navigate to sales list or show success message
    navigate(`/shops/${shopId}/sales`)
  }

  const handleCancel = () => {
    // Navigate back or show confirmation dialog
    navigate(`/shops/${shopId}/sales`)
  }

  return (
    <SaleForm
      mode="create"
      shopId={shopId!}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  )
}

// ============================================================================
// EXAMPLE 2: Edit Existing Sale Page
// ============================================================================

export const EditSalePage = () => {
  const navigate = useNavigate()
  const { shopId, saleId } = useParams<{ shopId: string; saleId: string }>()
  const [loading, setLoading] = useState(true)
  const [initialData, setInitialData] = useState<Partial<SaleFormData>>()

  // Fetch sale data on mount
  useEffect(() => {
    const fetchSale = async () => {
      try {
        // Replace with actual API call
        const response = await fetch(`/api/shops/${shopId}/sales/${saleId}`)
        const data = await response.json()

        // Transform API data to form format
        setInitialData({
          customerId: data.customerId,
          saleType: data.saleType,
          saleDate: data.saleDate,
          items: data.items,
          oldGoldExchange: data.oldGoldExchange,
          payment: {
            paymentMode: data.payment.paymentMode,
            paidAmount: data.payment.paidAmount,
            dueDate: data.payment.dueDate,
          },
          delivery: data.delivery,
          notes: data.notes,
          tags: data.tags,
        })
      } catch (error) {
        console.error('Failed to fetch sale:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSale()
  }, [shopId, saleId])

  const handleSuccess = () => {
    navigate(`/shops/${shopId}/sales/${saleId}`)
  }

  const handleCancel = () => {
    navigate(`/shops/${shopId}/sales/${saleId}`)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <SaleForm
      mode="edit"
      shopId={shopId!}
      saleId={saleId}
      initialData={initialData}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  )
}
