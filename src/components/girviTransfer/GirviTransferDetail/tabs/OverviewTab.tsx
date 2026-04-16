// FILE: src/components/girviTransfer/GirviTransferDetail/tabs/OverviewTab.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRightLeft, Building2, User } from 'lucide-react'
import { Badge }         from '@/components/ui/data-display/Badge/Badge'
import { Label }         from '@/components/ui/label'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { Wallet, TrendingDown, Package, Calendar } from 'lucide-react'
import type { IGirviTransfer } from '@/types/girviTransfer.types'

interface OverviewTabProps {
  transfer: IGirviTransfer
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ transfer }) => {
  const { t } = useTranslation()

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">

      {/* Summary Cards */}
      <StatCardGrid columns={4}>
        <StatCard
          title={t('girviTransfer.overview.partyPrincipal', 'Party Principal')}
          value={`₹${transfer.partyPrincipalAmount.toLocaleString()}`}
          icon={Wallet}
          variant="info"
          size="md"
        />
        <StatCard
          title={t('girviTransfer.overview.transferAmount', 'Settlement')}
          value={`₹${transfer.transferAmount.toLocaleString()}`}
          icon={TrendingDown}
          variant="warning"
          size="md"
        />
        <StatCard
          title={t('girviTransfer.overview.partyInterest', 'Party Interest Rate')}
          value={`${transfer.partyInterestRate}% / mo`}
          icon={Package}
          variant="default"
          size="md"
        />
        <StatCard
          title={t('girviTransfer.overview.transferDate', 'Transfer Date')}
          value={new Date(transfer.transferDate).toLocaleDateString()}
          icon={Calendar}
          variant="default"
          size="md"
        />
      </StatCardGrid>

      {/* Parties */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* From Party */}
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            {t('girviTransfer.overview.fromParty', 'From Party')}
          </h3>
          {[
            { label: 'Name',    value: transfer.fromParty.name },
            { label: 'Phone',   value: transfer.fromParty.phone },
            { label: 'Address', value: transfer.fromParty.address },
            { label: 'Type',    value: transfer.fromParty.type },
          ].filter(r => r.value).map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <Label className="text-xs text-text-secondary">{row.label}</Label>
              <p className="text-sm font-medium capitalize text-text-primary">{row.value}</p>
            </div>
          ))}
        </div>

        {/* To Party */}
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <User className="h-4 w-4" />
            {t('girviTransfer.overview.toParty', 'To Party')}
          </h3>
          {[
            { label: 'Name',          value: transfer.toParty.name },
            { label: 'Phone',         value: transfer.toParty.phone },
            { label: 'Address',       value: transfer.toParty.address },
            { label: 'Interest Rate', value: `${transfer.toParty.interestRate}% / mo` },
            { label: 'Interest Type', value: transfer.toParty.interestType },
          ].filter(r => r.value).map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <Label className="text-xs text-text-secondary">{row.label}</Label>
              <p className="text-sm font-medium capitalize text-text-primary">{row.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">
          {t('girviTransfer.overview.financials', 'Financial Breakdown')}
        </h3>
        {[
          { label: 'Our Principal',          value: `₹${transfer.ourPrincipalAmount.toLocaleString()}` },
          { label: 'Our Interest Till Transfer', value: `₹${transfer.ourInterestTillTransfer.toLocaleString()}` },
          { label: 'Our Total Due',          value: `₹${transfer.ourTotalDue.toLocaleString()}` },
          { label: 'Party Principal Given',  value: `₹${transfer.partyPrincipalAmount.toLocaleString()}` },
          { label: 'Commission',             value: `₹${transfer.commission.toLocaleString()}` },
          { label: 'Payment Mode',           value: transfer.paymentMode },
          { label: 'Transaction Ref',        value: transfer.transactionReference },
        ].filter(r => r.value).map(row => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">{row.label}</span>
            <span className="font-medium capitalize text-text-primary">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Items Snapshot */}
      {transfer.itemsSnapshot && transfer.itemsSnapshot.length > 0 && (
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">
            {t('girviTransfer.overview.items', 'Pledged Items')}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-secondary text-left">
                  {['#', 'Item', 'Type', 'Gross', 'Net', 'Tunch', 'Value'].map(h => (
                    <th key={h} className="pb-2 pr-4 text-xs font-medium text-text-secondary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-secondary">
                {transfer.itemsSnapshot.map((item, idx) => (
                  <tr key={idx} className="hover:bg-bg-tertiary">
                    <td className="py-3 pr-4 text-text-tertiary">{idx + 1}</td>
                    <td className="py-3 pr-4 font-medium text-text-primary">{item.itemName}</td>
                    <td className="py-3 pr-4 capitalize text-text-secondary">{item.itemType}</td>
                    <td className="py-3 pr-4 text-text-secondary">{item.grossWeight}g</td>
                    <td className="py-3 pr-4 text-text-secondary">{item.netWeight}g</td>
                    <td className="py-3 pr-4 text-text-secondary">{item.tunch ?? '-'}%</td>
                    <td className="py-3 font-semibold text-text-primary">
                      ₹{Number(item.finalValue || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes */}
      {transfer.notes && (
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-5">
          <Label className="text-xs text-text-secondary">Notes</Label>
          <p className="mt-1 text-sm text-text-secondary">{transfer.notes}</p>
        </div>
      )}
    </div>
  )
}