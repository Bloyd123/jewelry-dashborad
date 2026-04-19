import { useNavigate as useNavigateDetail, useParams as useParamsDetail } from 'react-router-dom'
import { useTranslation as useTranslationDetail } from 'react-i18next'
import { Button as ButtonDetail } from '@/components/ui/button'
import { Edit, Unlock, ArrowLeft, Trash2, RefreshCw } from 'lucide-react'
import { GirviForm }    from '@/components/girvi/GirviForm'
import { useGirviById } from '@/hooks/girvi/useGirviById'
import { useAuth as useAuthDetail } from '@/hooks/auth'
 import { mapGirviToFormData } from '@/components/girvi/GirviForm/GirviForm.mappers'
 
export const GirviDetailPage = () => {
  const { t }                = useTranslationDetail()
  const navigate             = useNavigateDetail()
  const { shopId, girviId }  = useParamsDetail()
  const { userRole }         = useAuthDetail()
 
  const {
    girvi,
    isLoading,
    canRelease,
    canPartialRelease,
    canRenew,
    canUpdate,
    canDelete,
    activeItemCount,
  } = useGirviById(shopId!, girviId!)
 
  const isManager = ['super_admin', 'org_admin', 'shop_admin', 'manager'].includes(userRole ?? '')
 
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }
 
  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ButtonDetail variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </ButtonDetail>
 
        <div className="flex flex-wrap items-center gap-2">
          {canRelease && isManager && (
            <ButtonDetail
              onClick={() => navigate(`/shops/${shopId}/girvi/${girviId}/release`)}
              className="gap-2"
            >
              <Unlock className="h-4 w-4" />
              {t('girvi.releaseGirvi')}
            </ButtonDetail>
          )}
 
          {canPartialRelease && isManager && activeItemCount > 1 && (
            <ButtonDetail
              variant="outline"
              onClick={() => navigate(`/shops/${shopId}/girvi/${girviId}/partial-release`)}
              className="gap-2"
            >
              <Unlock className="h-4 w-4" />
              {t('girvi.partialRelease')}
            </ButtonDetail>
          )}
 
          {canRenew && isManager && (
            <ButtonDetail
              variant="outline"
              onClick={() => navigate(`/shops/${shopId}/girvi/${girviId}/renew`)}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t('girvi.renewGirvi')}
            </ButtonDetail>
          )}
 
          {canUpdate && isManager && (
            <ButtonDetail
              variant="outline"
              onClick={() => navigate(`/shops/${shopId}/girvi/edit/${girviId}`)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              {t('common.edit')}
            </ButtonDetail>
          )}
        </div>
      </div>
 
<GirviForm
  shopId={shopId!}
  girviId={girviId}
  mode="view"
  initialData={mapGirviToFormData(girvi)}
  onCancel={() => navigate(`/shops/${shopId}/girvi`)}
/>
    </div>
  )
}