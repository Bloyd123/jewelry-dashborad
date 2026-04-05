// USAGE EXAMPLE: How to Use SaleForm Component

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SaleForm } from '@/components/sales/SalesForm'
import type { SaleFormData } from '@/components/sales/SalesForm'

import { useSaleById } from'@/hooks/sales'

export const CreateSalePage = () => {
  const navigate = useNavigate()
  const { shopId } = useParams<{ shopId: string }>()

  const handleSuccess = () =>
    navigate(`/shops/${shopId}/sales`)

  const handleCancel = () =>
    navigate(`/shops/${shopId}/sales`)

  return (
    <SaleForm
      mode="create"
      shopId={shopId!}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  )
}

export default CreateSalePage

export const EditSalePage = () => {
  const navigate = useNavigate()
  const { shopId, saleId } = useParams<{ shopId: string; saleId: string }>()

  // ── Real API ──────────────────────────────
  const { sale, isLoading } = useSaleById(shopId ?? '', saleId ?? '')

  const initialData = sale
    ? {
        customerId: sale.customerId,
        saleType:   sale.saleType,
        saleDate:   sale.saleDate,
        items:      sale.items,
        oldGoldExchange: sale.oldGoldExchange,
        payment: {
          paymentMode: sale.payment.paymentMode,
          paidAmount:  sale.payment.paidAmount,
          dueDate:     sale.payment.dueDate,
        },
        delivery: sale.delivery,
        notes:    sale.notes,
        tags:     sale.tags,
      }
    : undefined

  const handleSuccess = () =>
    navigate(`/shops/${shopId}/sales/${saleId}`)

  const handleCancel = () =>
    navigate(`/shops/${shopId}/sales/${saleId}`)

  if (isLoading) return <div>Loading...</div>
  if (!sale)     return <div>Sale not found</div>

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