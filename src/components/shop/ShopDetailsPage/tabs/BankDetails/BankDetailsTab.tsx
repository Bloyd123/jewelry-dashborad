// FILE: src/components/shop/ShopDetailsPages/tabs/BankDetails/BankDetailsTab.tsx

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Building2,
  Wallet,
  Star,
  Copy,
  Eye,
  EyeOff,
  Download,
  QrCode,
  Plus,
} from 'lucide-react'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/layout/Accordion/Accordion'
import { Separator } from '@/components/ui/layout/Separator/Separator'
import { Label } from '@/components/ui/label'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/overlay/Modal'
import { BankingSection } from '@/components/shop/ShopForm/sections/BankingSection'
import { UPISection } from '@/components/shop/ShopForm/sections/UPISection'
import { useShopActions } from '@/hooks/shop'
import { useNotification } from '@/hooks/useNotification'
import type { BankDetail, UpiDetail } from '@/types/shop.types'
import type { ShopFormData } from '@/types'

// ============================================
// PROPS
// ============================================

interface BankDetailsTabProps {
  shopId: string
  bankDetails?: BankDetail[]
  upiDetails?: UpiDetail[]
  isAdminView?: boolean
}

// ============================================
// MAIN COMPONENT
// ============================================

export const BankDetailsTab: React.FC<BankDetailsTabProps> = ({
  shopId,
  bankDetails = [],
  upiDetails = [],
  isAdminView = true,
}) => {
  const { t } = useTranslation()
  const { showSuccess, showError } = useNotification()
  const { updateShop, isUpdating } = useShopActions(shopId)

  // Visibility state for account numbers
  const [visibleAccounts, setVisibleAccounts] = useState<Record<string, boolean>>({})

  // Modal states
  const [showBankModal, setShowBankModal] = useState(false)
  const [showUpiModal, setShowUpiModal] = useState(false)

  // QR Modal state
  const [qrModal, setQrModal] = useState<{ open: boolean; upiId: string; name: string }>({
    open: false,
    upiId: '',
    name: '',
  })

  // Form data for modals
  const [newBankDetails, setNewBankDetails] = useState<BankDetail[]>([])
  const [newUpiDetails, setNewUpiDetails] = useState<UpiDetail[]>([])

  // ============================================
  // HANDLERS
  // ============================================

  const toggleAccountVisibility = (id: string) => {
    setVisibleAccounts(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const maskAccountNumber = (accountNumber: string, isVisible: boolean) => {
    if (isVisible) return accountNumber
    return '●●●●●●' + accountNumber.slice(-4)
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    showSuccess(`${type} copied to clipboard`, '')
  }

  // ---- QR Handlers ----

  const handleViewQR = (upi: UpiDetail) => {
    setQrModal({
      open: true,
      upiId: upi.upiId,
      name: upi.name || 'UPI Account',
    })
  }

  const handleDownloadQR = (upiId: string, name: string) => {
    // Get canvas element and download as PNG
    const canvas = document.getElementById(`qr-canvas-${upiId}`) as HTMLCanvasElement
    if (!canvas) {
      // If canvas not rendered yet, open modal first then download
      setQrModal({ open: true, upiId, name })
      setTimeout(() => {
        const c = document.getElementById(`qr-canvas-${upiId}`) as HTMLCanvasElement
        if (c) {
          const url = c.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = url
          a.download = `${name || upiId}-qr.png`
          a.click()
        }
      }, 300)
      return
    }
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `${name || upiId}-qr.png`
    a.click()
    showSuccess('QR code downloaded', '')
  }

  const handleDownloadFromModal = () => {
    const canvas = document.getElementById(`qr-canvas-modal`) as HTMLCanvasElement
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `${qrModal.name || qrModal.upiId}-qr.png`
    a.click()
    showSuccess('QR code downloaded', '')
  }

  // ---- Bank Modal ----

  const handleOpenBankModal = () => {
    setNewBankDetails([])
    setShowBankModal(true)
  }

  const handleSaveBank = async () => {
    if (newBankDetails.length === 0) {
      showError('Please add at least one bank account', '')
      return
    }
    const result = await updateShop({
      bankDetails: [...bankDetails, ...newBankDetails],
    } as Partial<ShopFormData>)

    if (result.success) {
      showSuccess('Bank account added successfully', 'Bank Added')
      setShowBankModal(false)
      setNewBankDetails([])
    }
  }

  // ---- UPI Modal ----

  const handleOpenUpiModal = () => {
    setNewUpiDetails([])
    setShowUpiModal(true)
  }

  const handleSaveUpi = async () => {
    if (newUpiDetails.length === 0) {
      showError('Please add at least one UPI account', '')
      return
    }
    const result = await updateShop({
      upiDetails: [...upiDetails, ...newUpiDetails],
    } as Partial<ShopFormData>)

    if (result.success) {
      showSuccess('UPI account added successfully', 'UPI Added')
      setShowUpiModal(false)
      setNewUpiDetails([])
    }
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6 p-6">

      {/* ---- BANK ACCOUNTS SECTION ---- */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Building2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {t('bankDetails.bankAccounts.title')}
              </h3>
              <p className="text-sm text-text-tertiary">
                {t('bankDetails.bankAccounts.subtitle')}
              </p>
            </div>
          </div>
          {isAdminView && (
            <Button variant="outline" size="sm" onClick={handleOpenBankModal}>
              <Plus className="mr-2 h-4 w-4" />
              {t('bankDetails.addBank')}
            </Button>
          )}
        </div>

        <Accordion type="multiple" variant="separated" size="md">
          {bankDetails.map(bank => {
            const bankId = bank._id || ''
            return (
              <AccordionItem key={bankId} value={bankId}>
                <AccordionTrigger
                  icon={<Building2 className="h-5 w-5" />}
                  badge={
                    <div className="flex gap-2">
                      {bank.isPrimary && (
                        <Badge variant="accent" size="sm">
                          <Star className="mr-1 h-3 w-3" />
                          {t('bankDetails.primary')}
                        </Badge>
                      )}
                      <Badge variant={bank.isActive ? 'active' : 'inactive'} size="sm">
                        {bank.isActive ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </div>
                  }
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary">{bank.bankName}</span>
                    <span className="text-sm text-text-tertiary">
                      {maskAccountNumber(bank.accountNumber, visibleAccounts[bankId])}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="space-y-4">
                    {/* Account Number */}
                    <div>
                      <Label className="mb-2 text-text-tertiary">
                        {t('bankDetails.accountNumber')}
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-md bg-bg-tertiary px-3 py-2 font-mono text-text-primary">
                          {maskAccountNumber(bank.accountNumber, visibleAccounts[bankId])}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => toggleAccountVisibility(bankId)}>
                          {visibleAccounts[bankId] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(bank.accountNumber, 'Account number')}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* IFSC Code */}
                    <div>
                      <Label className="mb-2 text-text-tertiary">{t('bankDetails.ifscCode')}</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-md bg-bg-tertiary px-3 py-2 font-mono text-text-primary">
                          {bank.ifscCode}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(bank.ifscCode, 'IFSC code')}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Account Holder */}
                    <div>
                      <Label className="mb-2 text-text-tertiary">{t('bankDetails.accountHolder')}</Label>
                      <div className="rounded-md bg-bg-tertiary px-3 py-2 text-text-primary">
                        {bank.accountHolderName}
                      </div>
                    </div>

                    <Separator />

                    {/* Branch & Account Type */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {bank.branchName && (
                        <div>
                          <Label className="mb-2 text-text-tertiary">{t('bankDetails.branch')}</Label>
                          <div className="rounded-md bg-bg-tertiary px-3 py-2 text-text-primary">
                            {bank.branchName}
                          </div>
                        </div>
                      )}
                      {bank.accountType && (
                        <div>
                          <Label className="mb-2 text-text-tertiary">{t('bankDetails.accountType')}</Label>
                          <div className="rounded-md bg-bg-tertiary px-3 py-2 capitalize text-text-primary">
                            {bank.accountType}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        {bankDetails.length === 0 && (
          <div className="rounded-lg border border-dashed border-border-secondary py-12 text-center">
            <Building2 className="mx-auto mb-3 h-12 w-12 text-text-tertiary" />
            <p className="mb-2 text-text-secondary">{t('bankDetails.noBankAccounts')}</p>
            {isAdminView && (
              <Button variant="outline" size="sm" onClick={handleOpenBankModal}>
                <Plus className="mr-2 h-4 w-4" />
                {t('bankDetails.addFirstBank')}
              </Button>
            )}
          </div>
        )}
      </div>

      <Separator spacing="lg" />

      {/* ---- UPI DETAILS SECTION ---- */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Wallet className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {t('bankDetails.upiDetails.title')}
              </h3>
              <p className="text-sm text-text-tertiary">
                {t('bankDetails.upiDetails.subtitle')}
              </p>
            </div>
          </div>
          {isAdminView && (
            <Button variant="outline" size="sm" onClick={handleOpenUpiModal}>
              <Plus className="mr-2 h-4 w-4" />
              {t('bankDetails.addUPI')}
            </Button>
          )}
        </div>

        <Accordion type="multiple" variant="separated" size="md">
          {upiDetails.map(upi => {
            const upiAccId = upi._id || ''
            return (
              <AccordionItem key={upiAccId} value={upiAccId}>
                <AccordionTrigger
                  icon={<Wallet className="h-5 w-5" />}
                  badge={
                    <div className="flex gap-2">
                      {upi.isPrimary && (
                        <Badge variant="accent" size="sm">
                          <Star className="mr-1 h-3 w-3" />
                          {t('bankDetails.primary')}
                        </Badge>
                      )}
                      <Badge variant={upi.isActive ? 'active' : 'inactive'} size="sm">
                        {upi.isActive ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </div>
                  }
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary">
                      {upi.name || 'UPI Account'}
                    </span>
                    <span className="font-mono text-sm text-text-tertiary">{upi.upiId}</span>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="space-y-4">
                    {/* UPI ID */}
                    <div>
                      <Label className="mb-2 text-text-tertiary">{t('bankDetails.upiId')}</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-md bg-bg-tertiary px-3 py-2 font-mono text-text-primary">
                          {upi.upiId}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(upi.upiId, 'UPI ID')}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Hidden QRCodeCanvas for download */}
                    <div style={{ display: 'none' }}>
                      <QRCodeCanvas
                        id={`qr-canvas-${upi.upiId}`}
                        value={`upi://pay?pa=${upi.upiId}&pn=${upi.name || ''}`}
                        size={256}
                        level="H"
                        includeMargin
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleCopy(upi.upiId, 'UPI ID')}>
                        <Copy className="mr-2 h-4 w-4" />
                        {t('bankDetails.copyUPI')}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadQR(upi.upiId, upi.name || '')}>
                        <Download className="mr-2 h-4 w-4" />
                        {t('bankDetails.downloadQR')}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewQR(upi)}>
                        <QrCode className="mr-2 h-4 w-4" />
                        {t('bankDetails.viewQR')}
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        {upiDetails.length === 0 && (
          <div className="rounded-lg border border-dashed border-border-secondary py-12 text-center">
            <Wallet className="mx-auto mb-3 h-12 w-12 text-text-tertiary" />
            <p className="mb-2 text-text-secondary">{t('bankDetails.noUPIDetails')}</p>
            {isAdminView && (
              <Button variant="outline" size="sm" onClick={handleOpenUpiModal}>
                <Plus className="mr-2 h-4 w-4" />
                {t('bankDetails.addFirstUPI')}
              </Button>
            )}
          </div>
        )}
      </div>

      {!isAdminView && (
        <div className="mt-6 rounded-lg border border-border-secondary bg-bg-tertiary p-4">
          <p className="text-center text-sm text-text-tertiary">
            {t('bankDetails.adminOnlyNotice')}
          </p>
        </div>
      )}

      {/* ============================================ */}
      {/* ADD BANK MODAL                               */}
      {/* ============================================ */}
      <Modal open={showBankModal} onOpenChange={setShowBankModal} size="lg">
        <ModalHeader
          title={t('bankDetails.addBank')}
          description={t('bankDetails.addBankDescription')}
        />
        <ModalBody>
          <BankingSection
            data={{ bankDetails: newBankDetails }}
            errors={{}}
            onChange={(name, value) => {
              if (name === 'bankDetails') setNewBankDetails(value)
            }}
            disabled={isUpdating}
          />
        </ModalBody>
        <ModalFooter align="right">
          <Button variant="outline" onClick={() => setShowBankModal(false)} disabled={isUpdating}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSaveBank} disabled={isUpdating || newBankDetails.length === 0}>
            {isUpdating ? t('common.saving') : t('common.save')}
          </Button>
        </ModalFooter>
      </Modal>

      {/* ============================================ */}
      {/* ADD UPI MODAL                                */}
      {/* ============================================ */}
      <Modal open={showUpiModal} onOpenChange={setShowUpiModal} size="md">
        <ModalHeader
          title={t('bankDetails.addUPI')}
          description={t('bankDetails.addUPIDescription')}
        />
        <ModalBody>
          <UPISection
            data={{ upiDetails: newUpiDetails }}
            errors={{}}
            onChange={(name, value) => {
              if (name === 'upiDetails') setNewUpiDetails(value)
            }}
            disabled={isUpdating}
          />
        </ModalBody>
        <ModalFooter align="right">
          <Button variant="outline" onClick={() => setShowUpiModal(false)} disabled={isUpdating}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSaveUpi} disabled={isUpdating || newUpiDetails.length === 0}>
            {isUpdating ? t('common.saving') : t('common.save')}
          </Button>
        </ModalFooter>
      </Modal>

      {/* ============================================ */}
      {/* VIEW QR MODAL                                */}
      {/* ============================================ */}
      <Modal open={qrModal.open} onOpenChange={open => setQrModal(prev => ({ ...prev, open }))} size="sm">
        <ModalHeader
          title={t('bankDetails.viewQR')}
          description={qrModal.upiId}
        />
        <ModalBody>
          <div className="flex flex-col items-center gap-4 py-4">
            {/* QR Code display */}
            <div className="rounded-xl border border-border-primary bg-white p-4">
              <QRCodeSVG
                value={`upi://pay?pa=${qrModal.upiId}&pn=${qrModal.name}`}
                size={220}
                level="H"
                includeMargin
              />
            </div>
            {/* Hidden canvas for download */}
            <div style={{ display: 'none' }}>
              <QRCodeCanvas
                id="qr-canvas-modal"
                value={`upi://pay?pa=${qrModal.upiId}&pn=${qrModal.name}`}
                size={512}
                level="H"
                includeMargin
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-text-primary">{qrModal.name}</p>
              <p className="font-mono text-sm text-text-secondary">{qrModal.upiId}</p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter align="right">
          <Button variant="outline" onClick={() => setQrModal(prev => ({ ...prev, open: false }))}>
            {t('common.close')}
          </Button>
          <Button onClick={handleDownloadFromModal}>
            <Download className="mr-2 h-4 w-4" />
            {t('bankDetails.downloadQR')}
          </Button>
        </ModalFooter>
      </Modal>

    </div>
  )
}

export default BankDetailsTab