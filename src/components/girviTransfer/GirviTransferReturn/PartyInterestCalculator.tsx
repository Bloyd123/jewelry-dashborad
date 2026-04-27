// FILE: src/components/girviTransfer/GirviTransferReturn/PartyInterestCalculator.tsx

import React, { useState } from 'react'
import { useTranslation }  from 'react-i18next'
import { Calculator, RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label }  from '@/components/ui/label'
import { usePartyInterestLazy } from '@/hooks/girviTransfer'

interface PartyInterestCalculatorProps {
  shopId:      string
  girviId:     string
  transferId:  string
  onUseAmount: (interest: number, days: number, totalPayable: number) => void
}

export const PartyInterestCalculator: React.FC<PartyInterestCalculatorProps> = ({
  shopId,
  girviId,
  transferId,
  onUseAmount,
}) => {
  const { t }     = useTranslation()
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])

  const { calculate, calculation, isLoading } =
    usePartyInterestLazy(shopId, girviId, transferId)

  return (
    <div className="rounded-lg border border-border-primary bg-bg-secondary p-4 space-y-4">
      <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
        <Calculator className="h-4 w-4 text-accent" />
        {t('girviTransfer.calculator.title', 'Calculate Party Interest')}
      </h3>

      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Label className="text-xs text-text-secondary">
            {t('girviTransfer.calculator.toDate', 'Calculate Till Date')}
          </Label>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="mt-1 w-full rounded-md border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <Button size="sm" onClick={() => calculate(toDate)} disabled={isLoading} className="gap-2">
          {isLoading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <RefreshCw className="h-4 w-4" />
          }
          {t('girviTransfer.calculator.calculate', 'Calculate')}
        </Button>
      </div>

      {calculation && (
        <div className="space-y-2 rounded-lg bg-bg-tertiary p-3 text-sm">
          {[
            { label: 'Days',              value: calculation.days },
            { label: 'Interest Calc',     value: `₹${calculation.partyInterestCalculated.toLocaleString()}` },
            { label: 'Total Payable',     value: `₹${calculation.totalPayableToParty.toLocaleString()}` },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-text-secondary">{row.label}</span>
              <span className="font-medium text-text-primary">{row.value}</span>
            </div>
          ))}

          <Button
            size="sm"
            variant="outline"
            className="mt-2 w-full"
            onClick={() => onUseAmount(
  calculation.partyInterestCalculated,
  calculation.days,
  calculation.totalPayableToParty
)}
          >
            {t('girviTransfer.calculator.useThisAmount', 'Use This Amount')}
          </Button>
        </div>
      )}
    </div>
  )
}