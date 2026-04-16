// FILE: src/pages/girvi/GirviListPage.tsx
import { useNavigate }   from 'react-router-dom'
import { useAuth }       from '@/hooks/auth'
import { Plus }          from 'lucide-react'
import { Button }        from '@/components/ui/button'
import { GirviTable }    from '@/components/girvi/GirviTable'
import { useGirviStatistics } from '@/hooks/girvi/useGirviList'
import { useTranslation } from 'react-i18next'
 
export const GirviListPage = () => {
  const { t }           = useTranslation()
  const navigate        = useNavigate()
  const { currentShopId } = useAuth()
  const shopId          = currentShopId || ''
 
  const {
    activeGirvis, overdueGirvis,
    totalOutstanding, totalAmountDue,
  } = useGirviStatistics(shopId)
 
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{t('girvi.title')}</h1>
          <p className="text-sm text-text-secondary">{t('girvi.subtitle')}</p>
        </div>
        <Button onClick={() => navigate(`/shops/${shopId}/girvi/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('girvi.createGirvi')}
        </Button>
      </div>
 
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: t('girvi.stats.active'),      value: activeGirvis,                        color: 'text-status-success' },
          { label: t('girvi.stats.overdue'),     value: overdueGirvis,                       color: 'text-status-error'   },
          { label: t('girvi.stats.outstanding'), value: `₹${totalOutstanding.toLocaleString('en-IN')}`, color: 'text-text-primary' },
          { label: t('girvi.stats.amountDue'),   value: `₹${totalAmountDue.toLocaleString('en-IN')}`,  color: 'text-accent'       },
        ].map(stat => (
          <div key={stat.label} className="rounded-lg border border-border-primary bg-bg-secondary p-4">
            <p className="text-xs text-text-tertiary">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
 
      <GirviTable />
    </div>
  )
}