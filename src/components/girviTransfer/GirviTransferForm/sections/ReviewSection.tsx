// FILE: src/components/girviTransfer/GirviTransferForm/sections/ReviewSection.tsx

import { useTranslation } from 'react-i18next'
import { Label }          from '@/components/ui/label'
import type { FormSectionProps } from '../GirviTransferForm.types'

export const ReviewSection = ({ data }: FormSectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">

      {/* Transfer Summary */}
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">
          {t('girviTransfer.review.title', 'Transfer Summary')}
        </h3>

        <div className="space-y-2 text-sm">
          {/* Parties */}
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">
              {t('girviTransfer.review.fromParty', 'From')}
            </span>
            <span className="font-medium text-text-primary">
              {data.fromPartyName || '-'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">
              {t('girviTransfer.review.toParty', 'To')}
            </span>
            <span className="font-medium text-text-primary">
              {data.toPartyName || '-'}
            </span>
          </div>

          <div className="my-2 border-t border-border-secondary" />

          {/* Financials */}
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">
              {t('girviTransfer.review.partyPrincipal', 'Party Principal')}
            </span>
            <span className="font-semibold text-text-primary">
              ₹{Number(data.partyPrincipalAmount || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">
              {t('girviTransfer.review.partyInterestRate', 'Party Interest Rate')}
            </span>
            <span className="text-text-primary">
              {data.toPartyInterestRate || 0}% / month ({data.toPartyInterestType || 'simple'})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">
              {t('girviTransfer.review.ourInterest', 'Our Interest Till Transfer')}
            </span>
            <span className="text-text-primary">
              ₹{Number(data.ourInterestTillTransfer || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">
              {t('girviTransfer.review.transferAmount', 'Settlement Amount')}
            </span>
            <span className="text-text-primary">
              ₹{Number(data.transferAmount || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">
              {t('girviTransfer.review.commission', 'Commission')}
            </span>
            <span className="text-text-primary">
              ₹{Number(data.commission || 0).toLocaleString()}
            </span>
          </div>

          <div className="my-2 border-t border-border-secondary" />

          {/* Transfer Date */}
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">
              {t('girviTransfer.review.transferDate', 'Transfer Date')}
            </span>
            <span className="text-text-primary">
              {data.transferDate
                ? new Date(data.transferDate).toLocaleDateString()
                : '-'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">
              {t('girviTransfer.review.paymentMode', 'Payment Mode')}
            </span>
            <span className="capitalize text-text-primary">
              {data.paymentMode || '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Warning Box */}
      <div className="flex items-start gap-2 rounded-lg border border-status-warning bg-status-warning/10 p-3">
        <span>⚠️</span>
        <p className="text-xs text-text-secondary">
          {t(
            'girviTransfer.review.warning',
            'Once transferred, the girvi status will change to "Transferred". The party will manage this girvi until returned.'
          )}
        </p>
      </div>
    </div>
  )
}