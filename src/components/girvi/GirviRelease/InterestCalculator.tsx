// FILE: src/components/girvi/GirviRelease/InterestCalculator.tsx
// GET /shops/:shopId/girvi/:girviId/interest — displays simple vs compound comparison
 
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calculator, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGirviInterestLazy } from '@/hooks/girvi/useGirviInterest'
import type { GirviInterestType } from '@/types/girvi.types'
 
interface InterestCalculatorProps {
  shopId:      string
  girviId:     string
  onApply?: (data: {
    interestCalculated: number
    interestType: GirviInterestType
    toDate: string
  }) => void
}
 
export const InterestCalculator = ({
  shopId,
  girviId,
  onApply,
}: InterestCalculatorProps) => {
  const { t } = useTranslation()
  const [toDate,       setToDate]       = useState(new Date().toISOString().split('T')[0])
  const [interestType, setInterestType] = useState<GirviInterestType>('simple')
 
  const { calculate, calculation, isCalculating, hasCalculation } =
    useGirviInterestLazy(shopId, girviId)
 
  const handleCalculate = () => {
    calculate({ toDate, interestType })
  }
 
  return (
    <div className="space-y-4 rounded-lg border border-border-primary bg-bg-secondary p-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-accent" />
        <h3 className="font-semibold text-text-primary">{t('girvi.interestCalculator')}</h3>
      </div>
 
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-text-secondary">{t('girvi.calculateUpTo')}</label>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="h-9 w-full rounded-lg border border-border-primary bg-bg-primary px-3 text-sm text-text-primary focus:border-accent focus:outline-none"
          />
        </div>
 
        <div className="space-y-1">
          <label className="text-xs font-medium text-text-secondary">{t('girvi.interestType')}</label>
          <select
            value={interestType}
            onChange={e => setInterestType(e.target.value as GirviInterestType)}
            className="h-9 w-full rounded-lg border border-border-primary bg-bg-primary px-3 text-sm text-text-primary focus:border-accent focus:outline-none"
          >
            <option value="simple">Simple</option>
            <option value="compound">Compound</option>
          </select>
        </div>
 
        <div className="flex items-end">
          <Button
            type="button"
            onClick={handleCalculate}
            disabled={isCalculating}
            className="h-9 w-full"
          >
            {isCalculating
              ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />{t('common.calculating')}</>
              : <><Calculator className="mr-2 h-4 w-4" />{t('girvi.calculate')}</>
            }
          </Button>
        </div>
      </div>
 
      {hasCalculation && calculation && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-bg-tertiary p-3 text-center">
              <p className="text-xs text-text-tertiary">{t('girvi.days')}</p>
              <p className="text-xl font-bold text-text-primary">{calculation.days}</p>
            </div>
            <div className="rounded-lg bg-bg-tertiary p-3 text-center">
              <p className="text-xs text-text-tertiary">{t('girvi.principal')}</p>
              <p className="text-xl font-bold text-text-primary">
                ₹{calculation.principal.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
 
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-lg border-2 p-3 ${interestType === 'simple' ? 'border-accent bg-accent/10' : 'border-border-primary bg-bg-tertiary'}`}>
              <p className="mb-1 text-xs font-medium text-text-secondary">Simple Interest</p>
              <p className="text-lg font-bold text-accent">
                ₹{calculation.comparison.simple.interest.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-text-tertiary">
                Total: ₹{calculation.comparison.simple.totalAmountDue.toLocaleString('en-IN')}
              </p>
            </div>
            <div className={`rounded-lg border-2 p-3 ${interestType === 'compound' ? 'border-accent bg-accent/10' : 'border-border-primary bg-bg-tertiary'}`}>
              <p className="mb-1 text-xs font-medium text-text-secondary">Compound Interest</p>
              <p className="text-lg font-bold text-accent">
                ₹{calculation.comparison.compound.interest.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-text-tertiary">
                Total: ₹{calculation.comparison.compound.totalAmountDue.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
 
          {onApply && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onApply({
                interestCalculated: calculation.interestCalculated,
                interestType,
                toDate,
              })}
              className="w-full"
            >
              {t('girvi.applyToReleaseForm')}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}