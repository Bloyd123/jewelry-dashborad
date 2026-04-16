// FILE: src/components/girviTransfer/GirviTransferDetail/tabs/PartyInterestTab.tsx

import React, { useState } from 'react'
import { useTranslation }  from 'react-i18next'
import { Calculator, RefreshCw, Loader2 } from 'lucide-react'
import { Button }          from '@/components/ui/button'
import { Label }           from '@/components/ui/label'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { Wallet, Calendar, Clock } from 'lucide-react'
import { usePartyInterestLazy }   from '@/hooks/girviTransfer'
import type { IGirviTransfer }    from '@/types/girviTransfer.types'

interface PartyInterestTabProps {
  transfer:   IGirviTransfer
  shopId:     string
  girviId:    string
  transferId: string
}

export const PartyInterestTab: React.FC<PartyInterestTabProps> = ({
  transfer,
  shopId,
  girviId,
  transferId,
}) => {
  const { t }     = useTranslation()
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])

  const { calculate, calculation, isLoading } =
    usePartyInterestLazy(shopId, girviId, transferId)

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">

      {/* Calculator Input */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-4">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Calculator className="h-4 w-4 text-accent" />
          {t('girviTransfer.partyInterest.calculator', 'Party Interest Calculator')}
        </h3>

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Label className="text-xs text-text-secondary">
              {t('girviTransfer.partyInterest.calculateUpTo', 'Calculate Up To Date')}
            </Label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <Button
            size="sm"
            onClick={() => calculate(toDate)}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <RefreshCw className="h-4 w-4" />
            }
            {t('girviTransfer.partyInterest.calculate', 'Calculate')}
          </Button>
        </div>
      </div>

      {/* Calculation Result */}
      {calculation && (
        <>
          <StatCardGrid columns={3}>
            <StatCard
              title={t('girviTransfer.partyInterest.days', 'Days Elapsed')}
              value={calculation.days}
              icon={Clock}
              variant="info"
              size="md"
            />
            <StatCard
              title={t('girviTransfer.partyInterest.interestCalc', 'Interest Calculated')}
              value={`₹${calculation.partyInterestCalculated.toLocaleString()}`}
              icon={Wallet}
              variant="warning"
              size="md"
            />
            <StatCard
              title={t('girviTransfer.partyInterest.totalPayable', 'Total Payable to Party')}
              value={`₹${calculation.totalPayableToParty.toLocaleString()}`}
              icon={Wallet}
              variant="error"
              size="md"
            />
          </StatCardGrid>

          <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-2">
            <h3 className="text-sm font-semibold text-text-primary">
              {t('girviTransfer.partyInterest.breakdown', 'Calculation Breakdown')}
            </h3>
            {[
              { label: 'Party Name',          value: calculation.toPartyName },
              { label: 'Principal Amount',    value: `₹${calculation.partyPrincipalAmount.toLocaleString()}` },
              { label: 'Interest Rate',       value: `${calculation.partyInterestRate}% / month` },
              { label: 'Interest Type',       value: calculation.partyInterestType },
              { label: 'From Date',           value: new Date(calculation.fromDate).toLocaleDateString() },
              { label: 'To Date',             value: new Date(calculation.toDate).toLocaleDateString() },
              { label: 'Days',                value: calculation.days },
              { label: 'Months',              value: calculation.months.toFixed(2) },
              { label: 'Interest Calculated', value: `₹${calculation.partyInterestCalculated.toLocaleString()}` },
              { label: 'Total Payable',       value: `₹${calculation.totalPayableToParty.toLocaleString()}` },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">{row.label}</span>
                <span className="font-medium capitalize text-text-primary">{row.value}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Transfer Info */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-2">
        <h3 className="text-sm font-semibold text-text-primary">Transfer Info</h3>
        {[
          { label: 'Transfer Number',   value: transfer.transferNumber },
          { label: 'To Party',          value: transfer.toParty.name },
          { label: 'Transfer Date',     value: new Date(transfer.transferDate).toLocaleDateString() },
          { label: 'Party Principal',   value: `₹${transfer.partyPrincipalAmount.toLocaleString()}` },
          { label: 'Party Rate',        value: `${transfer.partyInterestRate}% / month` },
          { label: 'Party Int. Type',   value: transfer.partyInterestType },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">{row.label}</span>
            <span className="font-medium capitalize text-text-primary">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}