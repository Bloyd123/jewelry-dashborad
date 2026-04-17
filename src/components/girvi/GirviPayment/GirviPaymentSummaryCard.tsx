// FILE: src/components/girvi/GirviPayment/GirviPaymentSummaryCard.tsx
import { useTranslation } from 'react-i18next'
import { TrendingUp, TrendingDown, Tag, DollarSign } from 'lucide-react'
import type { GirviPaymentSummary } from '@/types/girvi.types'

interface GirviPaymentSummaryCardProps {
  summary?:   GirviPaymentSummary
  isLoading?: boolean
}

const Stat = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label:  string
  value:  number
  icon:   React.ElementType
  color:  string
}) => (
  <div className="flex items-center gap-3 rounded-lg bg-bg-tertiary p-3">
    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-xs text-text-tertiary">{label}</p>
      <p className="font-bold text-text-primary">
        ₹{value.toLocaleString('en-IN')}
      </p>
    </div>
  </div>
)

const SkeletonStat = () => (
  <div className="flex animate-pulse items-center gap-3 rounded-lg bg-bg-tertiary p-3">
    <div className="h-10 w-10 rounded-full bg-bg-secondary" />
    <div className="space-y-2">
      <div className="h-3 w-20 rounded bg-bg-secondary" />
      <div className="h-4 w-16 rounded bg-bg-secondary" />
    </div>
  </div>
)

export const GirviPaymentSummaryCard = ({
  summary,
  isLoading = false,
}: GirviPaymentSummaryCardProps) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => <SkeletonStat key={i} />)}
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label={t('girviPayment.totalInterestReceived')}
          value={summary.totalInterestReceived}
          icon={TrendingUp}
          color="bg-status-success/10 text-status-success"
        />
        <Stat
          label={t('girviPayment.totalPrincipalReceived')}
          value={summary.totalPrincipalReceived}
          icon={DollarSign}
          color="bg-accent/10 text-accent"
        />
        <Stat
          label={t('girviPayment.totalDiscountGiven')}
          value={summary.totalDiscountGiven}
          icon={Tag}
          color="bg-status-warning/10 text-status-warning"
        />
        <Stat
          label={t('girviPayment.totalNetReceived')}
          value={summary.totalNetReceived}
          icon={TrendingDown}
          color="bg-status-info/10 text-status-info"
        />
      </div>
      <p className="text-right text-xs text-text-tertiary">
        {summary.paymentCount} {t('girviPayment.paymentsRecorded')}
      </p>
    </div>
  )
}