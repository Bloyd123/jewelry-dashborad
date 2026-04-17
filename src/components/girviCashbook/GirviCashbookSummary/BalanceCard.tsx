// FILE: src/components/girviCashbook/GirviCashbookSummary/BalanceCard.tsx

import React        from 'react'
import { useTranslation } from 'react-i18next'
import { Wallet, RefreshCw, Loader2 } from 'lucide-react'
import { Button }   from '@/components/ui/button'
import { useCashbookBalance } from '@/hooks/girviCashbook'

interface BalanceCardProps {
  shopId: string
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ shopId }) => {
  const { t } = useTranslation()
  const { currentBalance, isLoading, refetch } = useCashbookBalance(shopId)

  return (
    <div className="rounded-lg border border-border-primary bg-bg-secondary p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Wallet className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-xs text-text-secondary">
              {t('girviCashbook.summary.balance', 'Current Balance')}
            </p>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-accent" />
            ) : (
              <p className={`text-2xl font-bold ${
                currentBalance >= 0
                  ? 'text-status-success'
                  : 'text-status-error'
              }`}>
                ₹{currentBalance.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  )
}