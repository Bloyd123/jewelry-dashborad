// FILE: src/components/girviTransfer/GirviTransferDetail/GirviTransferDetailHeader.tsx

import React, { useState }  from 'react'
import { useTranslation }   from 'react-i18next'
import { ChevronLeft, ClipboardList, Calculator, RotateCcw } from 'lucide-react'
import { Button }           from '@/components/ui/button'
import { Badge }            from '@/components/ui/data-display/Badge/Badge'
import { Tabs }             from '@/components/ui/navigation/Tabs/Tabs'
import { Separator }        from '@/components/ui/layout/Separator/Separator'
import { useMediaQuery }    from '@/hooks/useMediaQuery'
import type { IGirviTransfer } from '@/types/girviTransfer.types'

interface GirviTransferDetailHeaderProps {
  transfer:     IGirviTransfer
  activeTab?:   string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
}

const getStatusVariant = (status: string) => {
  const map: Record<string, string> = {
    pending: 'warning', completed: 'success', returned: 'info', cancelled: 'error',
  }
  return map[status] ?? 'default'
}

const getTypeVariant = (type: string) => {
  const map: Record<string, string> = {
    outgoing: 'error', incoming: 'success', return: 'info',
  }
  return map[type] ?? 'default'
}

const tabItems = (t: any) => [
  { value: 'overview',      label: t('girviTransfer.tabs.overview',      'Overview'),       icon: <ClipboardList className="h-4 w-4" /> },
  { value: 'partyInterest', label: t('girviTransfer.tabs.partyInterest', 'Party Interest'), icon: <Calculator    className="h-4 w-4" /> },
  { value: 'return',        label: t('girviTransfer.tabs.return',        'Return'),         icon: <RotateCcw     className="h-4 w-4" /> },
]

export const GirviTransferDetailHeader: React.FC<GirviTransferDetailHeaderProps> = ({
  transfer,
  activeTab = 'overview',
  onTabChange,
  onBackClick,
}) => {
  const { t }     = useTranslation()
  const isMobile  = useMediaQuery('(max-width: 1024px)')
  const [currentTab, setCurrentTab] = useState(activeTab)

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  if (isMobile) {
    return (
      <div className="border-b border-border-secondary bg-bg-secondary">
        <div className="space-y-3 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBackClick} className="gap-2 px-2">
              <ChevronLeft className="h-4 w-4" />
              {t('common.back', 'Back')}
            </Button>
          </div>

          <div className="space-y-2">
            <h1 className="text-lg font-bold text-text-primary">{transfer.transferNumber}</h1>
            <p className="text-sm text-text-secondary">{transfer.toParty.name}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant={getStatusVariant(transfer.status) as any} size="sm">
                {transfer.status.toUpperCase()}
              </Badge>
              <Badge variant={getTypeVariant(transfer.transferType) as any} size="sm">
                {transfer.transferType.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-bg-primary p-2 text-center">
              <p className="text-xs text-text-tertiary">Principal</p>
              <p className="text-sm font-semibold text-text-primary">
                ₹{transfer.partyPrincipalAmount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-bg-primary p-2 text-center">
              <p className="text-xs text-text-tertiary">Rate</p>
              <p className="text-sm font-semibold text-text-primary">
                {transfer.partyInterestRate}%
              </p>
            </div>
            <div className="rounded-lg bg-bg-primary p-2 text-center">
              <p className="text-xs text-text-tertiary">Settlement</p>
              <p className="text-sm font-semibold text-text-primary">
                ₹{transfer.transferAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto px-4">
          <Tabs
            tabs={tabItems(t)}
            value={currentTab}
            onValueChange={handleTabChange}
            variant="underline"
            size="sm"
          />
        </div>
      </div>
    )
  }

  // Desktop
  return (
    <div className="border-b border-border-secondary bg-bg-secondary">
      <div className="space-y-4 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBackClick} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              {t('girviTransfer.common.backToList', 'Back to Transfers')}
            </Button>
            <Separator orientation="vertical" className="h-6" />
          </div>
        </div>

        <Separator />

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary">
                {transfer.transferNumber}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getStatusVariant(transfer.status) as any} size="sm">
                {transfer.status.toUpperCase()}
              </Badge>
              <Badge variant={getTypeVariant(transfer.transferType) as any} size="sm">
                {transfer.transferType.toUpperCase()}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span>
                {t('girviTransfer.detail.toParty', 'To')}:{' '}
                <span className="font-medium text-text-primary">{transfer.toParty.name}</span>
              </span>
              <span>
                {t('girviTransfer.detail.date', 'Date')}:{' '}
                {new Date(transfer.transferDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {[
              { label: 'Party Principal', value: `₹${transfer.partyPrincipalAmount.toLocaleString()}` },
              { label: 'Interest Rate',   value: `${transfer.partyInterestRate}% / mo` },
              { label: 'Settlement',      value: `₹${transfer.transferAmount.toLocaleString()}` },
            ].map(stat => (
              <div key={stat.label} className="min-w-[110px] rounded-lg border border-border-primary bg-bg-primary p-3 text-center">
                <p className="text-xs text-text-tertiary">{stat.label}</p>
                <p className="text-lg font-bold text-text-primary">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6">
        <Tabs
          tabs={tabItems(t)}
          value={currentTab}
          onValueChange={handleTabChange}
          variant="underline"
          size="md"
        />
      </div>
    </div>
  )
}