// FILE: src/components/openingBalance/OpeningBalancePage/OpeningBalancePage.mobile.tsx

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
  ChevronLeft,
  ChevronRight,
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

interface MobileOpeningBalancePageProps {
  shopId: string
}

const STEPS = [
  { key: 'cash',  labelKey: 'openingBalance.tabs.cash',  icon: Banknote  },
  { key: 'party', labelKey: 'openingBalance.tabs.party', icon: Users     },
  { key: 'metal', labelKey: 'openingBalance.tabs.metal', icon: Gem       },
  { key: 'stock', labelKey: 'openingBalance.tabs.stock', icon: Package   },
]

export default function MobileOpeningBalancePage({ shopId }: MobileOpeningBalancePageProps) {
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

  const [currentStep, setCurrentStep] = useState(0)
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
    await saveOpeningBalance({
      openingDate,
      cashBalance: cashBalance as any,
      partyBalances,
      metalBalances,
      stockBalance: stockBalance as any,
      notes,
    })
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

  const currentStepData = STEPS[currentStep]
  const StepIcon = currentStepData.icon

  const renderStep = () => {
    switch (currentStepData.key) {
      case 'cash':
        return <CashBalanceSection data={cashBalance} errors={errors} onChange={setCashBalance} disabled={isConfirmed} />
      case 'party':
        return <PartyBalanceSection data={partyBalances} errors={errors} onChange={setPartyBalances} disabled={isConfirmed} />
      case 'metal':
        return <MetalBalanceSection data={metalBalances} errors={errors} onChange={setMetalBalances} disabled={isConfirmed} />
      case 'stock':
        return <StockBalanceSection data={stockBalance} errors={errors} onChange={setStockBalance} disabled={isConfirmed} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-32">

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 border-b border-border-secondary bg-bg-secondary px-4 py-3">
        <h1 className="text-xl font-bold text-text-primary">
          {t('openingBalance.title')}
        </h1>

        {/* Step Indicator */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {t('openingBalance.step')} {currentStep + 1} / {STEPS.length}
          </span>
          <div className="flex items-center gap-1 text-sm font-medium text-accent">
            <StepIcon className="h-4 w-4" />
            {t(currentStepData.labelKey)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-bg-tertiary">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4 p-4">

        {/* Setup Status */}
        {setupStatus && <SetupStatusCard status={setupStatus} />}

        {/* Confirmed Warning */}
        {isConfirmed && (
          <div className="flex items-start gap-3 rounded-lg border border-status-warning/30 bg-status-warning/10 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-status-warning" />
            <p className="text-sm text-text-primary">
              {t('openingBalance.confirmedWarning')}
            </p>
          </div>
        )}

        {/* Opening Date - only on first step */}
        {currentStep === 0 && (
          <div className="rounded-lg border border-border-secondary bg-bg-secondary p-4">
            <FormDatePicker
              name="openingDate"
              label={t('openingBalance.openingDate')}
              value={openingDate}
              onChange={(_, val) => setOpeningDate(val)}
              disabled={isConfirmed}
              required
            />
          </div>
        )}

        {/* Step Content */}
        <div className="rounded-lg border border-border-secondary bg-bg-secondary p-4">
          {renderStep()}
        </div>

        {/* Notes - only on last step */}
        {currentStep === STEPS.length - 1 && (
          <div className="rounded-lg border border-border-secondary bg-bg-secondary p-4">
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
        )}
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border-primary bg-bg-secondary p-4">
        <div className="flex gap-2">
          {/* Previous */}
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(s => s - 1)}
              className="flex-1 gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('openingBalance.previous')}
            </Button>
          )}

          {/* Save Draft */}
          {!isConfirmed && (
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 gap-1"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {t('openingBalance.saveDraft')}
            </Button>
          )}

          {/* Next / Confirm */}
          {currentStep < STEPS.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(s => s + 1)}
              className="flex-1 gap-1"
            >
              {t('openingBalance.next')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            !isConfirmed && (
              <Button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="flex-1 gap-1"
              >
                {isConfirming
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <CheckCircle className="h-4 w-4" />
                }
                {t('openingBalance.confirm')}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  )
}