// / ============================================================================
// FILE: src/components/metalrates/CurrentRatesCards/CurrentRatesCards.tsx
// Current Metal Rates Display Cards
// ============================================================================

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Sparkles,
  Award,
  Gem
} from 'lucide-react'
import { StatCard } from '@/components/ui/data-display/StatCard/StatCard'
import { StatCardGrid } from '@/components/ui/data-display/StatCard/StatCardGrid'
import { StatCardSkeleton } from '@/components/ui/data-display/StatCard/StatCardSkeleton'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card'
import { mockCurrentRate } from '@/pages/metal-rates/metal-rate.mock'
import { CURRENCY_SYMBOLS } from '@/types/metalrate.types'
import type { MetalRate, TrendDirection } from '@/types/metalrate.types'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CurrentRatesCardsProps {
  loading?: boolean
  onCardClick?: (metalType: string, purity: string) => void
  className?: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatCurrency = (value: number, currency: string = 'INR'): string => {
  return `${CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS]}${value.toFixed(2)}`
}

const getTrendDirection = (changePercentage: number): 'up' | 'down' | 'neutral' => {
  if (changePercentage > 0.1) return 'up'
  if (changePercentage < -0.1) return 'down'
  return 'neutral'
}

const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
  switch (direction) {
    case 'up':
      return TrendingUp
    case 'down':
      return TrendingDown
    default:
      return Minus
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const CurrentRatesCards: React.FC<CurrentRatesCardsProps> = ({
  loading = false,
  onCardClick,
  className,
}) => {
  const { t } = useTranslation()
  
  // Using mock data
  const rateData: MetalRate = mockCurrentRate
  
  // Calculate trend data
  const goldTrendDirection = getTrendDirection(rateData.changes.goldChangePercentage)
  const silverTrendDirection = getTrendDirection(rateData.changes.silverChangePercentage)
  
  // Format last updated time
  const lastUpdated = new Date(rateData.updatedAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('metalRates.currentRates.title')}</CardTitle>
                <CardDescription>
                  {t('metalRates.currentRates.description')}
                </CardDescription>
              </div>
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <StatCardGrid columns={4} gap="md">
              {[...Array(8)].map((_, i) => (
                <StatCardSkeleton key={i} size="md" showTrend />
              ))}
            </StatCardGrid>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                {t('metalRates.currentRates.title')}
              </CardTitle>
              <CardDescription className="mt-1">
                {t('metalRates.currentRates.lastUpdated')}: {lastUpdated}
              </CardDescription>
            </div>
            
            {/* Rate Source Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
              <div className="h-2 w-2 rounded-full bg-status-success animate-pulse" />
              <span className="text-xs font-medium text-text-primary">
                {t(`metalRates.rateSource.${rateData.rateSource}`)}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Gold Rates Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              <h3 className="text-base sm:text-lg font-semibold text-text-primary">
                {t('metalRates.metals.gold')}
              </h3>
              <span className="text-xs sm:text-sm text-text-tertiary">
                ({t('metalRates.perGram')})
              </span>
            </div>
            
            <StatCardGrid columns={2} gap="md" className="lg:grid-cols-4">
              {/* 24K Gold */}
              <StatCard
                title={t('metalRates.purity.gold24K')}
                subtitle="99.9%"
                value={formatCurrency(rateData.gold.gold24K.sellingRate, rateData.currency)}
                description={`${t('metalRates.buying')}: ${formatCurrency(rateData.gold.gold24K.buyingRate, rateData.currency)}`}
                icon={getTrendIcon(goldTrendDirection)}
                variant={goldTrendDirection === 'up' ? 'success' : goldTrendDirection === 'down' ? 'error' : 'default'}
                size="sm"
                trend={{
                  value: rateData.changes.goldChangePercentage,
                  direction: goldTrendDirection,
                  label: t('metalRates.today'),
                  showIcon: true,
                }}
                onClick={() => onCardClick?.('gold', '24K')}
                className="sm:size-md"
                footer={
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-tertiary">
                      {t('metalRates.spread')}:
                    </span>
                    <span className="font-medium text-text-primary">
                      {formatCurrency(rateData.gold24KSpread || 0, rateData.currency)}
                    </span>
                  </div>
                }
              />

              {/* 22K Gold */}
              <StatCard
                title={t('metalRates.purity.gold22K')}
                subtitle="91.6%"
                value={formatCurrency(rateData.gold.gold22K.sellingRate, rateData.currency)}
                description={`${t('metalRates.buying')}: ${formatCurrency(rateData.gold.gold22K.buyingRate, rateData.currency)}`}
                icon={getTrendIcon(goldTrendDirection)}
                variant={goldTrendDirection === 'up' ? 'success' : goldTrendDirection === 'down' ? 'error' : 'default'}
                size="sm"
                trend={{
                  value: rateData.changes.goldChangePercentage,
                  direction: goldTrendDirection,
                  label: t('metalRates.today'),
                  showIcon: true,
                }}
                onClick={() => onCardClick?.('gold', '22K')}
                className="sm:size-md"
                footer={
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-tertiary">
                      {t('metalRates.spread')}:
                    </span>
                    <span className="font-medium text-text-primary">
                      {formatCurrency(rateData.gold22KSpread || 0, rateData.currency)}
                    </span>
                  </div>
                }
              />

              {/* 18K Gold */}
              <StatCard
                title={t('metalRates.purity.gold18K')}
                subtitle="75%"
                value={formatCurrency(rateData.gold.gold18K.sellingRate, rateData.currency)}
                description={`${t('metalRates.buying')}: ${formatCurrency(rateData.gold.gold18K.buyingRate, rateData.currency)}`}
                icon={getTrendIcon(goldTrendDirection)}
                variant={goldTrendDirection === 'up' ? 'success' : goldTrendDirection === 'down' ? 'error' : 'default'}
                size="sm"
                trend={{
                  value: rateData.changes.goldChangePercentage,
                  direction: goldTrendDirection,
                  label: t('metalRates.today'),
                  showIcon: true,
                }}
                onClick={() => onCardClick?.('gold', '18K')}
                className="sm:size-md"
              />

              {/* 14K Gold */}
              <StatCard
                title={t('metalRates.purity.gold14K')}
                subtitle="58.5%"
                value={formatCurrency(rateData.gold.gold14K.sellingRate, rateData.currency)}
                description={`${t('metalRates.buying')}: ${formatCurrency(rateData.gold.gold14K.buyingRate, rateData.currency)}`}
                icon={getTrendIcon(goldTrendDirection)}
                variant={goldTrendDirection === 'up' ? 'success' : goldTrendDirection === 'down' ? 'error' : 'default'}
                size="sm"
                trend={{
                  value: rateData.changes.goldChangePercentage,
                  direction: goldTrendDirection,
                  label: t('metalRates.today'),
                  showIcon: true,
                }}
                onClick={() => onCardClick?.('gold', '14K')}
                className="sm:size-md"
              />
            </StatCardGrid>
          </div>

          {/* Silver Rates Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Gem className="h-4 w-4 sm:h-5 sm:w-5 text-text-secondary" />
              <h3 className="text-base sm:text-lg font-semibold text-text-primary">
                {t('metalRates.metals.silver')}
              </h3>
              <span className="text-xs sm:text-sm text-text-tertiary">
                ({t('metalRates.perGram')})
              </span>
            </div>
            
            <StatCardGrid columns={2} gap="md" className="lg:grid-cols-4">
              {/* Pure Silver 999 */}
              <StatCard
                title={t('metalRates.purity.silver999')}
                subtitle="99.9%"
                value={formatCurrency(rateData.silver.pure.sellingRate, rateData.currency)}
                description={`${t('metalRates.buying')}: ${formatCurrency(rateData.silver.pure.buyingRate, rateData.currency)}`}
                icon={getTrendIcon(silverTrendDirection)}
                variant={silverTrendDirection === 'up' ? 'success' : silverTrendDirection === 'down' ? 'error' : 'default'}
                size="sm"
                trend={{
                  value: rateData.changes.silverChangePercentage,
                  direction: silverTrendDirection,
                  label: t('metalRates.today'),
                  showIcon: true,
                }}
                onClick={() => onCardClick?.('silver', '999')}
                className="sm:size-md"
                footer={
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-tertiary">
                      {t('metalRates.spread')}:
                    </span>
                    <span className="font-medium text-text-primary">
                      {formatCurrency(rateData.silverSpread || 0, rateData.currency)}
                    </span>
                  </div>
                }
              />

              {/* Sterling Silver 925 */}
              <StatCard
                title={t('metalRates.purity.silver925')}
                subtitle="92.5%"
                value={formatCurrency(rateData.silver.sterling925.sellingRate, rateData.currency)}
                description={`${t('metalRates.buying')}: ${formatCurrency(rateData.silver.sterling925.buyingRate, rateData.currency)}`}
                icon={getTrendIcon(silverTrendDirection)}
                variant={silverTrendDirection === 'up' ? 'success' : silverTrendDirection === 'down' ? 'error' : 'default'}
                size="sm"
                trend={{
                  value: rateData.changes.silverChangePercentage,
                  direction: silverTrendDirection,
                  label: t('metalRates.today'),
                  showIcon: true,
                }}
                onClick={() => onCardClick?.('silver', '925')}
                className="sm:size-md"
              />

              {/* Platinum */}
              <StatCard
                title={t('metalRates.metals.platinum')}
                subtitle="95%"
                value={formatCurrency(rateData.platinum.sellingRate, rateData.currency)}
                description={`${t('metalRates.buying')}: ${formatCurrency(rateData.platinum.buyingRate, rateData.currency)}`}
                icon={Gem}
                variant="info"
                size="sm"
                onClick={() => onCardClick?.('platinum', '950')}
                className="sm:size-md"
              />
            </StatCardGrid>
          </div>

          {/* Market Reference Section */}
          {rateData.marketReference && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-bg-tertiary border border-border-secondary">
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-text-primary mb-1 sm:mb-2">
                    {t('metalRates.marketReference.title')}
                  </h4>
                  <p className="text-xs text-text-tertiary">
                    {t('metalRates.marketReference.source')}: {rateData.marketReference.referenceSource}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center sm:text-left p-3 rounded bg-bg-secondary border border-border-primary">
                    <p className="text-xs text-text-tertiary mb-1">
                      {t('metalRates.marketReference.intlGold')}
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-text-primary">
                      ${rateData.marketReference.internationalGoldPrice?.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="text-center sm:text-left p-3 rounded bg-bg-secondary border border-border-primary">
                    <p className="text-xs text-text-tertiary mb-1">
                      {t('metalRates.marketReference.intlSilver')}
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-text-primary">
                      ${rateData.marketReference.internationalSilverPrice?.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="text-center sm:text-left p-3 rounded bg-bg-secondary border border-border-primary">
                    <p className="text-xs text-text-tertiary mb-1">
                      {t('metalRates.marketReference.exchangeRate')}
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-text-primary">
                      ₹{rateData.marketReference.exchangeRate?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes Section */}
          {rateData.notes && (
            <div className="mt-4 p-3 rounded bg-status-info/10 border border-status-info/20">
              <p className="text-sm text-text-secondary">
                <span className="font-medium">{t('metalRates.notes')}:</span> {rateData.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

CurrentRatesCards.displayName = 'CurrentRatesCards'