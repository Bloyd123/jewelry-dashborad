import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GirviReleaseForm } from '@/components/girvi/GirviRelease'
import { buildRoute } from '@/constants/routePaths'

export const GirviReleasePage = () => {
  const { t }               = useTranslation()
  const navigate            = useNavigate()
  const { shopId, girviId } = useParams()

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Button>
        <h1 className="text-xl font-bold text-text-primary">{t('girvi.releaseGirvi')}</h1>
      </div>

      <GirviReleaseForm
        shopId={shopId!}
        girviId={girviId!}
        onSuccess={() => navigate(buildRoute.girvi.detail(shopId!, girviId!))}
        onCancel={() => navigate(-1)}
      />
    </div>
  )
}