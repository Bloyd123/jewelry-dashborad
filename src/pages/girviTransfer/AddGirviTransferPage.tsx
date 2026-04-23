// FILE: src/pages/girviTransfer/AddGirviTransferPage.tsx

import { useState }               from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation }         from 'react-i18next'
import { useAuth }                from '@/hooks/auth'
import { buildRoute }             from '@/constants/routePaths'
import { GirviTransferForm }      from '@/components/girviTransfer/GirviTransferForm'
import { GirviSection }           from '@/components/girviTransfer/GirviTransferForm/sections/GirviSection'

export default function AddGirviTransferPage() {
  const navigate                = useNavigate()
  const { girviId: urlGirviId } = useParams<{ girviId?: string }>()
  const { t }                   = useTranslation()
  const { currentShopId }       = useAuth()
  const shopId                  = currentShopId || ''

  const [selectedGirviInfo, setSelectedGirviInfo] = useState<{
    girviId:              string
    girviNumber:          string
    principalAmount:      number
    outstandingPrincipal: number
    interestRate:         number
    interestType:         string
    customerName:         string
    customerPhone:        string
  } | null>(null)

  if (!shopId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-text-secondary">{t('common.selectShopFirst', 'Please select a shop first')}</p>
      </div>
    )
  }

  const girviId = urlGirviId || selectedGirviInfo?.girviId || ''

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-6">

      {/* Girvi Search — sirf tab jab URL mein girviId nahi (sidebar flow) */}
      {!urlGirviId && (
        <div className="mb-6">
          <GirviSection
            data={{}}
            errors={{}}
            onChange={() => {}}
            onGirviSelected={info => {
              if (info.girviId) setSelectedGirviInfo(info)
              else              setSelectedGirviInfo(null)
            }}
          />
        </div>
      )}

      {/* Transfer Form — girviId available hone ke baad */}
      {girviId ? (
        <GirviTransferForm
          shopId={shopId}
          girviId={girviId}
          onSuccess={() => navigate(buildRoute.girvi.list(shopId))}
          onCancel={() => navigate(-1)}
          girviInfo={selectedGirviInfo ? {
            girviNumber:          selectedGirviInfo.girviNumber,
            principalAmount:      selectedGirviInfo.principalAmount,
            outstandingPrincipal: selectedGirviInfo.outstandingPrincipal,
            interestRate:         selectedGirviInfo.interestRate,
            interestType:         selectedGirviInfo.interestType as any,
          } : undefined}
        />
      ) : (
        !urlGirviId && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border-primary py-16 text-center">
            <p className="text-lg font-medium text-text-secondary">
              {t('girviTransfer.selectGirviFirst', 'Search and select a girvi above to start transfer')}
            </p>
            <p className="mt-1 text-sm text-text-tertiary">
              {t('girviTransfer.selectGirviFirstSub', 'Only active or overdue girvis can be transferred')}
            </p>
          </div>
        )
      )}
    </div>
  )
}