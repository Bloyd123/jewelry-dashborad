import { useNavigate as useNavigateDetail, useParams as useParamsDetail, useSearchParams } from 'react-router-dom'
import { useTranslation as useTranslationDetail } from 'react-i18next'
import { useRef, useEffect ,useState} from 'react'
import { Button as ButtonDetail } from '@/components/ui/button'
import { Edit, Unlock, ArrowLeft, Trash2, RefreshCw } from 'lucide-react'
import { GirviForm }    from '@/components/girvi/GirviForm'
import { useGirviById } from '@/hooks/girvi/useGirviById'
import { useAuth as useAuthDetail } from '@/hooks/auth'
import { buildRoute } from '@/constants/routePaths'
 import { mapGirviToFormData } from '@/components/girvi/GirviForm/GirviForm.mappers'
 import { Dialog } from '@/components/ui/overlay/Dialog/Dialog'
 import {InterestCalculator } from "@/components/girvi/GirviRelease/InterestCalculator.tsx"
export const GirviDetailPage = () => {
  const { t }                = useTranslationDetail()
  const navigate             = useNavigateDetail()
  const { shopId, girviId }  = useParamsDetail()
  const { userRole }         = useAuthDetail()
  
 const [searchParams]       = useSearchParams()
const [showInterestModal, setShowInterestModal] = useState(
  searchParams.get('tab') === 'interest'
)
  // tab=interest hone par activity timeline section pe scroll
  const interestSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchParams.get('tab') === 'interest' && interestSectionRef.current) {
      setTimeout(() => {
        interestSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 500)  // wait for page to render
    }
  }, [searchParams])
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
<div className="flex flex-col">
    <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-3 border-b border-border-primary bg-bg-secondary px-6 py-3">
        <ButtonDetail variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </ButtonDetail>
 
        <div className="flex flex-wrap items-center gap-2">
          {canRelease && isManager && (
            <ButtonDetail
            onClick={() => navigate(buildRoute.girvi.release(shopId!, girviId!))}
              className="gap-2"
            >
              <Unlock className="h-4 w-4" />
              {t('girvi.releaseGirvi')}
            </ButtonDetail>
          )}
 
          {canPartialRelease && isManager && activeItemCount > 1 && (
            <ButtonDetail
              variant="outline"
     onClick={() => navigate(buildRoute.girvi.partialRelease(shopId!, girviId!))}
              className="gap-2"
            >
              <Unlock className="h-4 w-4" />
              {t('girvi.partialRelease')}
            </ButtonDetail>
          )}
 
          {canRenew && isManager && (
            <ButtonDetail
              variant="outline"
              onClick={() => navigate(buildRoute.girvi.renew(shopId!, girviId!))}
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
 
<Dialog
  open={showInterestModal}
  onOpenChange={setShowInterestModal}
  title="girvi.interestCalculator"
  closeOnOutsideClick
  contentClassName="max-w-2xl"
>
  <div className="px-6 pb-6">
    <InterestCalculator
      shopId={shopId!}
      girviId={girviId!}
    />
  </div>
</Dialog>

<GirviForm
  shopId={shopId!}
  girviId={girviId}
  mode="view"
  initialData={mapGirviToFormData(girvi)}
  onCancel={() => navigate(`/shops/${shopId}/girvi`)}
  scrollToInterest={searchParams.get('tab') === 'interest'}
/>
    </div>
  )
}