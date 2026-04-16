// FILE: src/components/openingBalance/OpeningBalancePage/OpeningBalancePage.desktop.tsx

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Banknote,
  Users,
  Gem,
  Package,
  CheckCircle,
  Save,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormDatePicker } from '@/components/forms/FormDatePicker/FormDatePicker'
import { FormTextarea } from '@/components/forms/FormTextarea/FormTextarea'
import { SetupStatusCard } from '../sections/SetupStatusCard'
import { CashBalanceSection } from '../sections/CashBalanceSection'
import { PartyBalanceSection } from '../sections/PartyBalanceSection'
import { MetalBalanceSection } from '../sections/MetalBalanceSection'
import { StockBalanceSection } from '../sections/StockBalanceSection'
import { useOpeningBalance } from '@/hooks/openingbalance/useOpeningBalance'
import type {
  CashBalance,
  PartyBalance,
  MetalBalance,
  StockBalance,
} from '@/types/openingBalance.types'

interface DesktopOpeningBalancePageProps {
  shopId: string
}

type TabKey = 'cash' | 'party' | 'metal' | 'stock'

const TABS: { key: TabKey; labelKey: string; icon: React.ReactNode }[] = [
  { key: 'cash',   labelKey: 'openingBalance.tabs.cash',   icon: <Banknote className="h-4 w-4" /> },
  { key: 'party',  labelKey: 'openingBalance.tabs.party',  icon: <Users className="h-4 w-4" /> },
  { key: 'metal',  labelKey: 'openingBalance.tabs.metal',  icon: <Gem className="h-4 w-4" /> },
  { key: 'stock',  labelKey: 'openingBalance.tabs.stock',  icon: <Package className="h-4 w-4" /> },
]

export default function DesktopOpeningBalancePage({ shopId }: DesktopOpeningBalancePageProps) {
  const { t } = useTranslation()
  const {
    setupStatus,
    openingBalance,
    isLoading,
    isSaving,
    isConfirming,
    isConfirmed,
    saveOpeningBalance,
    confirmOpeningBalance,
  } = useOpeningBalance(shopId)

  const [activeTab, setActiveTab] = useState<TabKey>('cash')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form State
const [openingDate, setOpeningDate]     = useState(new Date().toISOString())
const [cashBalance, setCashBalance]     = useState<Partial<CashBalance>>({ cash: 0, bank: [] })
const [partyBalances, setPartyBalances] = useState<PartyBalance[]>([])
const [metalBalances, setMetalBalances] = useState<MetalBalance[]>([])
const [stockBalance, setStockBalance]   = useState<Partial<StockBalance>>({ totalStockValue: 0 })
const [notes, setNotes]                 = useState('')

// Data aane ke baad form populate karo
useEffect(() => {
  if (openingBalance) {
    setOpeningDate(openingBalance.openingDate || new Date().toISOString())
    setCashBalance(openingBalance.cashBalance || { cash: 0, bank: [] })
    setPartyBalances(openingBalance.partyBalances || [])
    setMetalBalances(openingBalance.metalBalances || [])
    setStockBalance(openingBalance.stockBalance || { totalStockValue: 0 })
    setNotes(openingBalance.notes || '')
  }
}, [openingBalance])

  const handleSave = async () => {
    const result = await saveOpeningBalance({
      openingDate,
      cashBalance: cashBalance as any,
      partyBalances,
      metalBalances,
      stockBalance: stockBalance as any,
      notes,
    })
    if (!result.success) {
      setErrors({ general: result.error || 'Save failed' })
    }
  }

  const handleConfirm = async () => {
    if (!confirm(t('openingBalance.confirmDialog'))) return
    await confirmOpeningBalance()
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-7xl p-6">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary">
            {t('openingBalance.title')}
          </h1>
          <p className="mt-1 text-text-secondary">
            {t('openingBalance.description')}
          </p>
        </div>

        {/* Setup Status */}
        {setupStatus && (
          <div className="mb-6">
            <SetupStatusCard status={setupStatus} />
          </div>
        )}

        {/* Confirmed Warning */}
        {isConfirmed && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-status-warning/30 bg-status-warning/10 p-4">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-status-warning" />
            <p className="text-sm text-text-primary">
              {t('openingBalance.confirmedWarning')}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

          {/* Left Sidebar - Tabs */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-2 rounded-lg border border-border-secondary bg-bg-secondary p-3">
              {/* Opening Date */}
              <div className="mb-4 pb-4 border-b border-border-secondary">
                <FormDatePicker
                  name="openingDate"
                  label={t('openingBalance.openingDate')}
                  value={openingDate}
                  onChange={(_, val) => setOpeningDate(val)}
                  disabled={isConfirmed}
                  required
                />
              </div>

              {/* Tab Navigation */}
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-accent text-white'
                      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                  }`}
                >
                  {tab.icon}
                  {t(tab.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tab Content */}
            <div className="rounded-lg border border-border-secondary bg-bg-secondary p-6">
              {activeTab === 'cash' && (
                <CashBalanceSection
                  data={cashBalance}
                  errors={errors}
                  onChange={setCashBalance}
                  disabled={isConfirmed}
                />
              )}
              {activeTab === 'party' && (
                <PartyBalanceSection
                  data={partyBalances}
                  errors={errors}
                  onChange={setPartyBalances}
                  disabled={isConfirmed}
                />
              )}
              {activeTab === 'metal' && (
                <MetalBalanceSection
                  data={metalBalances}
                  errors={errors}
                  onChange={setMetalBalances}
                  disabled={isConfirmed}
                />
              )}
              {activeTab === 'stock' && (
                <StockBalanceSection
                  data={stockBalance}
                  errors={errors}
                  onChange={setStockBalance}
                  disabled={isConfirmed}
                />
              )}
            </div>

            {/* Notes */}
            <div className="rounded-lg border border-border-secondary bg-bg-secondary p-6">
              <FormTextarea
                name="notes"
                label={t('openingBalance.notes')}
                value={notes}
                onChange={(_, val) => setNotes(val)}
                placeholder={t('openingBalance.notesPlaceholder')}
                disabled={isConfirmed}
                rows={3}
                maxLength={1000}
                showCharCount
              />
            </div>

            {/* Actions */}
            {!isConfirmed && (
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={isSaving || isConfirming}
                  className="gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {t('openingBalance.saveDraft')}
                </Button>

                <Button
                  onClick={handleConfirm}
                  disabled={isSaving || isConfirming}
                  className="gap-2"
                >
                  {isConfirming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {t('openingBalance.confirm')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}