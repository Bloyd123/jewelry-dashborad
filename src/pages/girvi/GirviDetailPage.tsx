// FILE: src/pages/girvi/GirviDetailPage.tsx
import { useNavigate as useNavigateDetail, useParams as useParamsDetail } from 'react-router-dom'
import { useTranslation as useTranslationDetail } from 'react-i18next'
import { Button as ButtonDetail } from '@/components/ui/button'
import { Edit, Unlock, ArrowLeft, Trash2 } from 'lucide-react'
import { GirviForm }   from '@/components/girvi/GirviForm'
import { useGirviById }  from '@/hooks/girvi/useGirviById'
import { useAuth as useAuthDetail } from '@/hooks/auth'
 
export const GirviDetailPage = () => {
  const { t }           = useTranslationDetail()
  const navigate        = useNavigateDetail()
  const { shopId, girviId } = useParamsDetail()
  const { userRole }    = useAuthDetail()
 
  const {
    girvi, isLoading, canRelease, canUpdate, canDelete,
    outstandingPrincipal, totalAmountDue,
  } = useGirviById(shopId!, girviId!)
 
  const isAdmin = ['super_admin', 'org_admin', 'shop_admin'].includes(userRole ?? '')
 
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }
 
  return (
    <div className="space-y-4 p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <ButtonDetail variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </ButtonDetail>
 
        <div className="flex gap-2">
          {canRelease && (
            <ButtonDetail
              onClick={() => navigate(`/shops/${shopId}/girvi/${girviId}/release`)}
              className="gap-2"
            >
              <Unlock className="h-4 w-4" />
              {t('girvi.releaseGirvi')}
            </ButtonDetail>
          )}
          {canUpdate && (
            <ButtonDetail variant="outline" onClick={() => navigate(`/shops/${shopId}/girvi/edit/${girviId}`)} className="gap-2">
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
        initialData={girvi as any}
        onCancel={() => navigate(`/shops/${shopId}/girvi`)}
      />
    </div>
  )
}