import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import { SalesDetailHeader } from '@/components/sales/SalesDetailPage/SalesDetailHeader'
import OverviewTab from '@/components/sales/SalesDetailPage/tabs/OverviewTab'
import ItemsTab from '@/components/sales/SalesDetailPage/tabs/ItemsTab'
import PaymentsTab from '@/components/sales/SalesDetailPage/tabs/PaymentsTab'
import HistoryTab from '@/components/sales/SalesDetailPage/tabs/HistoryTab'
import DocumentsTab from '@/components/sales/SalesDetailPage/tabs/DocumentsTab'
import { useSaleById } from '@/hooks/sales/useSaleById'
import { useSalePayments } from '@/hooks/sales/useSalePayments'
import { useSaleActions } from '@/hooks/sales/useSaleActions'
import { useNotification } from '@/hooks/useNotification'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import type { AddPaymentRequest } from '@/types/sale.types'
import { useTranslation } from 'react-i18next'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/overlay/Modal'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDeleteSaleMutation } from '@/store/api/salesApi'

export const SalesDetailsPage: React.FC = () => {
  const { shopId, saleId } = useParams<{ shopId: string; saleId: string }>()
  const navigate = useNavigate()
    const { t } = useTranslation()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
const [sendMethod, setSendMethod] = useState<'email' | 'sms' | 'whatsapp'>('email')
const [sendRecipient, setSendRecipient] = useState('')
const [isSending, setIsSending] = useState(false)
  const { showSuccess, showError } = useNotification()
  const { handleError } = useErrorHandler()

  // ── Hooks ─────────────────────────────────
  const {
    sale,
    documents,
    isLoading,
    error,
    refetch,
  } = useSaleById(shopId ?? '', saleId ?? '')

  const {
    payments,
    addPayment,
    isAddingPayment,
  } = useSalePayments(shopId ?? '', saleId ?? '')
const {
  printInvoice,
  deleteSale,
  isPrinting,
  sendInvoice,
  isDeleting,
} = useSaleActions(shopId ?? '')


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
  const handleBackClick = () =>
    navigate(`/shops/${shopId}/sales`)

  const handleEditClick = () =>
    navigate(`/shops/${shopId}/sales/${saleId}/edit`)

const handleDeleteClick = () => setIsDeleteDialogOpen(true)

const handlePrintClick = async () => {
  await printInvoice(saleId!)   // ← saleId pass karo
}
const handleSendConfirm = async () => {
  setIsSending(true)
  try {
    await sendInvoice(saleId!, {
      method: sendMethod,
      recipient: sendRecipient,
    })
    showSuccess('Invoice sent successfully', 'Sent')
    setIsSendModalOpen(false)
  } catch {
    showError('Failed to send invoice', 'Error')
  } finally {
    setIsSending(false)
  }
}
const handleDeleteConfirm = async () => {
  const result = await deleteSale(saleId!)
  if (result.success) navigate(`/shops/${shopId}/sales`)
}

const handleSendClick = () => {
  setSendRecipient(sale.customerDetails.email || sale.customerDetails.phone || '')
  setIsSendModalOpen(true)
}

  const handleTabChange = (tab: string) => setActiveTab(tab)

  const handleAddPayment = async (paymentData: Partial<any>) => {
    await addPayment(paymentData as AddPaymentRequest)
  }

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
              onAddPayment={handleAddPayment}
            />
          </div>
        )

      case 'documents':
        return (
          <div className="p-6">
            <DocumentsTab
              documents={documents}
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
  sale={sale}          // ← add karo
  activeTab={activeTab}
  onTabChange={handleTabChange}
  onBackClick={handleBackClick}
  onEditClick={handleEditClick}
  onDeleteClick={handleDeleteClick}
  onPrintClick={handlePrintClick}
  onSendClick={handleSendClick}
/>
      {renderTabContent()}
      {/* Send Invoice Modal */}
<Modal
  open={isSendModalOpen}
  onOpenChange={setIsSendModalOpen}
  size="sm"
>
  <ModalHeader
    title="sales.common.sendInvoice"
    description="sales.common.sendInvoiceDescription"
  />
  <ModalBody>
    <div className="space-y-4">
      {/* Method */}
      <div className="space-y-2">
        <Label>{t('sales.common.sendVia')}</Label>
        <Select
          value={sendMethod}
          onValueChange={val => setSendMethod(val as 'email' | 'sms' | 'whatsapp')}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Recipient */}
      <div className="space-y-2">
        <Label>{t('sales.common.recipient')}</Label>
        <Input
          value={sendRecipient}
          onChange={e => setSendRecipient(e.target.value)}
          placeholder={
            sendMethod === 'email'
              ? 'customer@email.com'
              : '+91-9876543210'
          }
        />
      </div>
    </div>
  </ModalBody>
  <ModalFooter>
    <Button
      variant="outline"
      onClick={() => setIsSendModalOpen(false)}
      disabled={isSending}
    >
      {t('common.cancel')}
    </Button>
    <Button
      onClick={handleSendConfirm}
      disabled={isSending || !sendRecipient}
    >
      {isSending ? t('common.sending') : t('sales.common.send')}
    </Button>
  </ModalFooter>
</Modal>

{/* Delete Confirmation */}
<ConfirmDialog
  open={isDeleteDialogOpen}
  onOpenChange={setIsDeleteDialogOpen}
  variant="danger"
  title={t('sales.common.deleteSale')}
  description={t('sales.common.deleteSaleDescription')}
  confirmLabel={t('common.delete')}
  cancelLabel={t('common.cancel')}
  onConfirm={handleDeleteConfirm}
  onCancel={() => setIsDeleteDialogOpen(false)}
  loading={isDeleting}
/>
    </div>
  )
}

export default SalesDetailsPage