// FILE: src/pages/Sales/SalesDetailsPage.tsx
// Sales Details Page Component

import React, { useState } from 'react'
import { SalesDetailHeader } from '@/components/sales/SalesDetailPage/SalesDetailHeader'
import OverviewTab from //   HistoryTab, //   DocumentsTab, //   PaymentsTab,
'@/components/sales/SalesDetailPage/tabs/OverviewTab'
import ItemsTab from '@/components/sales/SalesDetailPage/tabs/ItemsTab'
import PaymentsTab from '@/components/sales/SalesDetailPage/tabs/PaymentsTab'
import HistoryTab from '@/components/sales/SalesDetailPage/tabs/HistoryTab'
import DocumentsTab from '@/components/sales/SalesDetailPage/tabs/DocumentsTab'

import { dummySales } from '../data'

// SALES DETAILS PAGE COMPONENT

export const SalesDetailsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')

  // Get sale data - Currently using dummy data
  // TODO: Replace with API call - const { saleId } = useParams(); const { data: sale } = useGetSaleByIdQuery(saleId)
  const sale = dummySales[0]

  // Handle back navigation
  const handleBackClick = () => {
    // TODO: Add navigation logic
    console.log('Navigate back to sales list')
    // window.history.back() or navigate('/sales')
  }

  // Handle edit
  const handleEditClick = () => {
    console.log('Edit sale:', sale._id)
    // TODO: Navigate to edit page or open edit modal
  }

  // Handle delete
  const handleDeleteClick = () => {
    console.log('Delete sale:', sale._id)
    // TODO: Show delete confirmation dialog
  }

  // Handle print
  const handlePrintClick = () => {
    console.log('Print invoice:', sale.invoiceNumber)
    // TODO: Generate and print PDF invoice
    // await printInvoice(sale._id)
  }

  // Handle send
  const handleSendClick = () => {
    console.log('Send invoice:', sale.invoiceNumber)
    // TODO: Open send invoice modal (email/sms/whatsapp)
  }

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    console.log('Active tab changed to:', tab)
  }

  // Render tab content based on active tab
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
            <DocumentsTab documents={sale.documents} saleId={sale._id} />
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
      {/* Header with Tabs */}
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

      {/* Tab Content - BAHAR render ho raha hai ✅ */}
      {renderTabContent()}
    </div>
  )
}

export default SalesDetailsPage
