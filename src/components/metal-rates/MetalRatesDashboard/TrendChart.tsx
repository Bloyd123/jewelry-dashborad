// ============================================================================
// FILE: src/components/metalRates/TrendChart/TrendChart.tsx
// Metal Rate Trend Chart with Period Filter
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LineChart } from '@/components/ui/charts/LineChart/LineChart'
import {
  TypeFilter,
  FilterOption,
} from '@/components/ui/filters/TypeFilter/TypeFilter'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  mockTrendChartData,
  mockMetalRateApi,
} from '@/pages/metal-rates/metal-rate.mock'
import type { TrendChartResponse, MetalType } from '@/types/metalrate.types'

// ============================================================================
// INTERFACES
// ============================================================================

export interface TrendChartProps {
  shopId: string
  metalType?: MetalType
  defaultPeriod?: number
  className?: string
}

// ============================================================================
// PERIOD OPTIONS
// ============================================================================

const PERIOD_OPTIONS: FilterOption[] = [
  { value: '7', label: '7 Days' },
  { value: '30', label: '30 Days' },
  { value: '90', label: '90 Days' },
  { value: '180', label: '180 Days' },
  { value: '365', label: '1 Year' },
]

const METAL_TYPE_OPTIONS: FilterOption[] = [
  { value: 'gold', label: 'Gold 24K' },
  { value: 'silver', label: 'Silver 999' },
  { value: 'platinum', label: 'Platinum 950' },
]

// ============================================================================
// COMPONENT
// ============================================================================

export const TrendChart = React.forwardRef<HTMLDivElement, TrendChartProps>(
  ({ shopId, metalType = 'gold', defaultPeriod = 90, className }, ref) => {
    const { t } = useTranslation()

    // ============================================================================
    // STATE
    // ============================================================================

    const [selectedPeriod, setSelectedPeriod] = React.useState<string>(
      defaultPeriod.toString()
    )
    const [selectedMetal, setSelectedMetal] = React.useState<string>(metalType)
    const [loading, setLoading] = React.useState(false)
    const [trendData, setTrendData] = React.useState<TrendChartResponse | null>(
      null
    )

    // ============================================================================
    // FETCH DATA
    // ============================================================================

    const fetchTrendData = React.useCallback(async () => {
      setLoading(true)
      try {
        const response = await mockMetalRateApi.getTrendChartData(
          shopId,
          selectedMetal as MetalType,
          parseInt(selectedPeriod)
        )
        if (response.success) {
          setTrendData(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch trend data:', error)
      } finally {
        setLoading(false)
      }
    }, [shopId, selectedMetal, selectedPeriod])

    React.useEffect(() => {
      fetchTrendData()
    }, [fetchTrendData])

    // ============================================================================
    // CHART DATA FORMATTING
    // ============================================================================

    const chartData = React.useMemo(() => {
      if (!trendData) return []

      return trendData.trendData.map(point => ({
        date: new Date(point.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        [t('metalRates.trend.rate')]: point.rate,
        [t('metalRates.trend.ma7')]: point.ma7,
        [t('metalRates.trend.ma30')]: point.ma30,
      }))
    }, [trendData, t])

    // ============================================================================
    // STATISTICS CALCULATION
    // ============================================================================

    const statistics = React.useMemo(() => {
      if (!trendData || !trendData.summary) return null

      const { currentRate, startRate, highestRate, lowestRate, averageRate } =
        trendData.summary
      const change = currentRate - startRate
      const changePercentage = ((change / startRate) * 100).toFixed(2)

      return {
        highest: highestRate,
        lowest: lowestRate,
        average: averageRate,
        change,
        changePercentage: parseFloat(changePercentage),
      }
    }, [trendData])

    // ============================================================================
    // TREND INDICATOR
    // ============================================================================

    const getTrendIcon = () => {
      if (!statistics) return <Minus className="h-4 w-4 text-text-tertiary" />

      if (statistics.change > 0) {
        return <TrendingUp className="h-4 w-4 text-status-success" />
      } else if (statistics.change < 0) {
        return <TrendingDown className="h-4 w-4 text-status-error" />
      }
      return <Minus className="h-4 w-4 text-text-tertiary" />
    }

    // ============================================================================
    // CURRENCY FORMATTER
    // ============================================================================

    const formatCurrency = (value: number) => {
      return `₹${value.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    }

    // ============================================================================
    // RENDER
    // ============================================================================

    return (
      <Card ref={ref} className={cn('w-full', className)}>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-text-primary">
                {t('metalRates.trend.title')}
              </CardTitle>
              <CardDescription className="text-text-tertiary">
                {t('metalRates.trend.description')}
              </CardDescription>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Metal Type Filter */}
              <TypeFilter
                options={METAL_TYPE_OPTIONS}
                value={selectedMetal}
                onChange={value => setSelectedMetal(value || 'gold')}
                placeholder={t('metalRates.trend.selectMetal')}
                showAllOption={false}
                className="w-full sm:w-[140px]"
              />

              {/* Period Filter */}
              <TypeFilter
                options={PERIOD_OPTIONS}
                value={selectedPeriod}
                onChange={value => setSelectedPeriod(value || '90')}
                placeholder={t('metalRates.trend.selectPeriod')}
                showAllOption={false}
                className="w-full sm:w-[120px]"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Statistics Row */}
          {statistics && (
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {/* Highest */}
              <div className="space-y-1">
                <p className="text-xs text-text-tertiary">
                  {t('metalRates.trend.highest')}
                </p>
                <p className="text-lg font-semibold text-text-primary">
                  {formatCurrency(statistics.highest)}
                </p>
              </div>

              {/* Lowest */}
              <div className="space-y-1">
                <p className="text-xs text-text-tertiary">
                  {t('metalRates.trend.lowest')}
                </p>
                <p className="text-lg font-semibold text-text-primary">
                  {formatCurrency(statistics.lowest)}
                </p>
              </div>

              {/* Average */}
              <div className="space-y-1">
                <p className="text-xs text-text-tertiary">
                  {t('metalRates.trend.average')}
                </p>
                <p className="text-lg font-semibold text-text-primary">
                  {formatCurrency(statistics.average)}
                </p>
              </div>

              {/* Change */}
              <div className="space-y-1">
                <p className="text-xs text-text-tertiary">
                  {t('metalRates.trend.change')}
                </p>
                <div className="flex items-center gap-2">
                  {getTrendIcon()}
                  <p
                    className={cn(
                      'text-lg font-semibold',
                      statistics.change > 0 && 'text-status-success',
                      statistics.change < 0 && 'text-status-error',
                      statistics.change === 0 && 'text-text-tertiary'
                    )}
                  >
                    {statistics.change > 0 ? '+' : ''}
                    {formatCurrency(Math.abs(statistics.change))}
                    <span className="ml-1 text-sm">
                      ({statistics.changePercentage > 0 ? '+' : ''}
                      {statistics.changePercentage}%)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Line Chart */}
          <LineChart
            data={chartData}
            lines={[
              {
                dataKey: t('metalRates.trend.rate'),
                name: t('metalRates.trend.sellingRate'),
                color: 'var(--accent)',
                strokeWidth: 3,
              },
              {
                dataKey: t('metalRates.trend.ma7'),
                name: t('metalRates.trend.ma7'),
                color: 'var(--status-success)',
                strokeWidth: 2,
              },
              {
                dataKey: t('metalRates.trend.ma30'),
                name: t('metalRates.trend.ma30'),
                color: 'var(--status-warning)',
                strokeWidth: 2,
              },
            ]}
            xAxisKey="date"
            height={400}
            loading={loading}
            showGrid={true}
            showLegend={true}
            showTooltip={true}
            formatYAxis={formatCurrency}
            formatTooltip={(value: any) => formatCurrency(Number(value))}
          />

          {/* Period Info */}
          <div className="mt-4 text-center text-sm text-text-tertiary">
            {t('metalRates.trend.showing')} {selectedPeriod}{' '}
            {t('metalRates.trend.days')} {t('metalRates.trend.of')}{' '}
            {METAL_TYPE_OPTIONS.find(opt => opt.value === selectedMetal)?.label}
          </div>
        </CardContent>
      </Card>
    )
  }
)

TrendChart.displayName = 'TrendChart'
