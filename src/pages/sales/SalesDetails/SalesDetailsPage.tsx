import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import { SalesDetailHeader } from '@/components/sales/SalesDetailPage/SalesDetailHeader'
import OverviewTab from '@/components/sales/SalesDetailPage/tabs/OverviewTab'
import ItemsTab from '@/components/sales/SalesDetailPage/tabs/ItemsTab'
import PaymentsTab from '@/components/sales/SalesDetailPage/tabs/PaymentsTab'
import HistoryTab from '@/components/sales/SalesDetailPage/tabs/HistoryTab'
import DocumentsTab from '@/components/sales/SalesDetailPage/tabs/DocumentsTab'
import { useGetSaleByIdQuery } from '@/store/api/salesApi'
import { useGetSalePaymentsQuery } from '@/store/api/salesApi'
import { usePrintInvoiceMutation, useSendInvoiceMutation } from '@/store/api/salesApi'
import { useNotification } from '@/hooks/useNotification'

export const SalesDetailsPage: React.FC = () => {
  const { shopId, saleId } = useParams<{ shopId: string; saleId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useNotification()
  const [activeTab, setActiveTab] = useState('overview')

  // ── Real API ──────────────────────────────
  const {
    data: sale,
    isLoading,
    error,
  } = useGetSaleByIdQuery(
    { shopId: shopId ?? '', saleId: saleId ?? '' },
    { skip: !shopId || !saleId }
  )

  const [printInvoice, { isLoading: isPrinting }] = usePrintInvoiceMutation()
  const [sendInvoice, { isLoading: isSending }] = useSendInvoiceMutation()

  // ── Loading ───────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  // ── Error ─────────────────────────────────
  if (error || !sale) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-status-error" />
        <p className="text-text-secondary">Sale not found</p>
      </div>
    )
  }

  // ── Handlers ──────────────────────────────
  const handleBackClick = () => navigate(`/shops/${shopId}/sales`)

  const handleEditClick = () =>
    navigate(`/shops/${shopId}/sales/${saleId}/edit`)

  const handleDeleteClick = () => {
    // TODO: show confirm dialog
    console.log('Delete sale:', saleId)
  }

  const handlePrintClick = async () => {
    try {
      await printInvoice({ shopId: shopId!, saleId: saleId! }).unwrap()
      showSuccess('Invoice printed successfully', 'Print')
    } catch {
      showError('Failed to print invoice', 'Error')
    }
  }

  const handleSendClick = async () => {
    // TODO: open send modal for method/recipient selection
    console.log('Send invoice:', sale.invoiceNumber)
  }

  const handleTabChange = (tab: string) => setActiveTab(tab)

  // ── Tab Content ───────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="p-6">
            <OverviewTab sale={sale} />
          </div>
        )

      case 'items':
        return (
          <div className="p-6">
            <ItemsTab
              items={sale.items}
              oldGoldExchange={sale.oldGoldExchange}
            />
          </div>
        )

      case 'payments':
        return (
          <div className="p-6">
            <PaymentsTab
              payment={sale.payment}
              invoiceNumber={sale.invoiceNumber}
              saleId={sale._id}
            />
          </div>
        )

      case 'documents':
        return (
          <div className="p-6">
            <DocumentsTab
              documents={sale.documents}
              saleId={sale._id}
            />
          </div>
        )

      case 'history':
        return (
          <div className="p-6">
            <HistoryTab
              saleId={sale._id}
              createdAt={sale.createdAt}
              updatedAt={sale.updatedAt}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <SalesDetailHeader
        saleId={sale._id}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onBackClick={handleBackClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onPrintClick={handlePrintClick}
        onSendClick={handleSendClick}
      />
      {renderTabContent()}
    </div>
  )
}

export default SalesDetailsPage