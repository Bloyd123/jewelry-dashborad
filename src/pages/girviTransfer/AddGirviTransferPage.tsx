// FILE: src/pages/girviTransfer/AddGirviTransferPage.tsx

import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation }   from 'react-i18next'
import { useAuth }          from '@/hooks/auth'
import { GirviTransferForm } from '@/components/girviTransfer/GirviTransferForm'

export default function AddGirviTransferPage() {
  const navigate = useNavigate()
  const { girviId } = useParams<{ girviId: string }>()
  const { t }    = useTranslation()
  const { currentShopId } = useAuth()
  const shopId   = currentShopId || ''

  if (!shopId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-text-secondary">{t('common.selectShopFirst')}</p>
      </div>
    )
  }

  if (!girviId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-text-secondary">
          {t('girviTransfer.errors.girviIdRequired', 'Girvi ID is required')}
        </p>
      </div>
    )
  }

  return (
    <GirviTransferForm
      shopId={shopId}
      girviId={girviId}
      onSuccess={() => navigate(`/girvi/${girviId}`)}
      onCancel={() => navigate(-1)}
    />
  )
}