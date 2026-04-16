// FILE: src/components/openingBalance/sections/SetupStatusCard.tsx

import { useTranslation } from 'react-i18next'
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Banknote,
  Users,
  Gem,
  Package,
} from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import type { SetupStatus } from '@/types/openingBalance.types'

interface SetupStatusCardProps {
  status: SetupStatus
}

export const SetupStatusCard = ({ status }: SetupStatusCardProps) => {
  const { t } = useTranslation()

  const getStatusVariant = () => {
    if (status.openingBalanceStatus === 'confirmed') return 'success'
    if (status.openingBalanceStatus === 'draft')     return 'warning'
    return 'error'
  }

  const getStatusIcon = () => {
    if (status.openingBalanceStatus === 'confirmed') return <CheckCircle className="h-5 w-5 text-status-success" />
    if (status.openingBalanceStatus === 'draft')     return <Clock className="h-5 w-5 text-status-warning" />
    return <AlertCircle className="h-5 w-5 text-status-error" />
  }

  const checkItems = [
    {
      key: 'hasCashBalance',
      label: t('openingBalance.status.cashBalance'),
      icon: <Banknote className="h-4 w-4" />,
      done: status.hasCashBalance,
    },
    {
      key: 'hasPartyBalances',
      label: t('openingBalance.status.partyBalances'),
      icon: <Users className="h-4 w-4" />,
      done: status.hasPartyBalances,
    },
    {
      key: 'hasMetalBalances',
      label: t('openingBalance.status.metalBalances'),
      icon: <Gem className="h-4 w-4" />,
      done: status.hasMetalBalances,
    },
    {
      key: 'hasStockBalance',
      label: t('openingBalance.status.stockBalance'),
      icon: <Package className="h-4 w-4" />,
      done: status.hasStockBalance,
    },
  ]

  return (
    <div className="rounded-lg border border-border-secondary bg-bg-secondary p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <h3 className="font-semibold text-text-primary">
            {t('openingBalance.status.title')}
          </h3>
        </div>
        <Badge variant={getStatusVariant()} size="sm">
          {t(`openingBalance.status.${status.openingBalanceStatus}`)}
        </Badge>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {checkItems.map(item => (
          <div
            key={item.key}
            className={`flex items-center gap-2 rounded-md p-2 text-sm ${
              item.done
                ? 'bg-status-success/10 text-status-success'
                : 'bg-bg-tertiary text-text-tertiary'
            }`}
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
            {item.done && <CheckCircle className="ml-auto h-3 w-3 flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Opening Date */}
      {status.openingDate && (
        <p className="mt-3 text-xs text-text-tertiary">
          {t('openingBalance.status.openingDate')}: {new Date(status.openingDate).toLocaleDateString('en-IN')}
        </p>
      )}
    </div>
  )
}