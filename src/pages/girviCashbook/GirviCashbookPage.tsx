// FILE: src/pages/girviCashbook/GirviCashbookPage.tsx

import { useState }       from 'react'
import { useTranslation } from 'react-i18next'
import { PlusCircle, X }  from 'lucide-react'
import { Button }         from '@/components/ui/button'
import { Drawer }         from '@/components/ui/overlay/Drawer'
import { useAuth }        from '@/hooks/auth'
import { Tabs }           from '@/components/ui/navigation/Tabs/Tabs'
import { BarChart2, Calendar, TrendingUp, BookOpen } from 'lucide-react'

import { GirviCashbookTable }   from '@/components/girviCashbook/GirviCashbookTable'
import { GirviCashbookFilters } from '@/components/girviCashbook/GirviCashbookFilters'
import { ManualEntryForm }      from '@/components/girviCashbook/GirviCashbookForm'
import {
  BalanceCard,
  DailySummaryCard,
  MonthlySummaryCard,
  YearlySummaryCard,
} from '@/components/girviCashbook/GirviCashbookSummary'
import type { GirviCashbookFilterValues } from '@/components/girviCashbook/GirviCashbookFilters'

type ActiveTab = 'entries' | 'daily' | 'monthly' | 'yearly'

export default function GirviCashbookPage() {
  const { t }      = useTranslation()
  const { currentShopId } = useAuth()
  const shopId     = currentShopId || ''

  const [activeTab,   setActiveTab]   = useState<ActiveTab>('entries')
  const [showForm,    setShowForm]    = useState(false)

  const [filters, setFilters] = useState<GirviCashbookFilterValues>({
    search:     '',
    entryType:  undefined,
    flowType:   undefined,
    dateRange:  undefined,
  })

  const handleClearAll = () => setFilters({
    search: '', entryType: undefined, flowType: undefined, dateRange: undefined,
  })

  const tabItems = [
    {
      value: 'entries',
      label: t('girviCashbook.tabs.entries', 'All Entries'),
      icon:  <BookOpen   className="h-4 w-4" />,
    },
    {
      value: 'daily',
      label: t('girviCashbook.tabs.daily', 'Daily'),
      icon:  <Calendar   className="h-4 w-4" />,
    },
    {
      value: 'monthly',
      label: t('girviCashbook.tabs.monthly', 'Monthly'),
      icon:  <BarChart2  className="h-4 w-4" />,
    },
    {
      value: 'yearly',
      label: t('girviCashbook.tabs.yearly', 'Yearly'),
      icon:  <TrendingUp className="h-4 w-4" />,
    },
  ]

  if (!shopId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-text-secondary">
          {t('common.selectShopFirst', 'Please select a shop first')}
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
            {t('girviCashbook.title', 'Girvi Cashbook')}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {t('girviCashbook.subtitle', 'Track all girvi cash flows')}
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2 whitespace-nowrap"
          onClick={() => setShowForm(true)}
        >
          <PlusCircle className="h-4 w-4" />
          {t('girviCashbook.addEntry', 'Add Entry')}
        </Button>
      </div>

      <BalanceCard shopId={shopId} />

      <div className="overflow-x-auto">
        <Tabs
          tabs={tabItems}
          value={activeTab}
          onValueChange={val => setActiveTab(val as ActiveTab)}
          variant="underline"
          size="md"
        />
      </div>

      {activeTab === 'entries' && (
        <div className="space-y-4">
          <GirviCashbookFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearAll={handleClearAll}
          />
          <GirviCashbookTable shopId={shopId} />
        </div>
      )}

      {activeTab === 'daily' && (
        <div className="max-w-2xl">
          <DailySummaryCard shopId={shopId} />
        </div>
      )}

      {activeTab === 'monthly' && (
        <div className="max-w-2xl">
          <MonthlySummaryCard shopId={shopId} />
        </div>
      )}

      {activeTab === 'yearly' && (
        <div className="max-w-3xl">
          <YearlySummaryCard shopId={shopId} />
        </div>
      )}

      <Drawer
        open={showForm}
        onOpenChange={setShowForm}
        title={t('girviCashbook.form.title', 'Manual Entry')}
        side="right"
        size="md"
      >
        <ManualEntryForm
          shopId={shopId}
          onSuccess={() => {
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      </Drawer>
    </div>
  )
}