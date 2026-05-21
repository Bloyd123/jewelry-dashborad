// FILE: src/pages/scheme/SchemeDetail/index.tsx

import { useState }        from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation }  from 'react-i18next'
import { Loader2 }         from 'lucide-react'
import { useAuth }         from '@/hooks/auth'
import { usePermissionCheck } from '@/hooks/auth/usePermissions'
import { useSchemeById }   from '@/hooks/scheme/useSchemeById'
import { SchemeDetailHeader } from '@/components/scheme/SchemePage'
import {
  SchemeOverviewTab,
  EnrollmentsTab,
  PaymentsTab,
  ScheduleTab,
  AnalyticsTab,
} from '@/components/scheme/SchemePage/tabs'

export default function SchemeDetailPage() {
  const { t }             = useTranslation()
  const navigate          = useNavigate()
  const { schemeId }      = useParams()
  const { currentShopId } = useAuth()
  const { can }           = usePermissionCheck()

  const [activeTab, setActiveTab] = useState('overview')

  const { scheme, isLoading } = useSchemeById(
    currentShopId!,
    schemeId!
  )

  if (isLoading || !scheme) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <SchemeDetailHeader
        scheme={scheme}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBackClick={() => navigate('/schemes')}
        onSettingsClick={() => navigate(`/schemes/edit/${schemeId}`)}
      />

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <SchemeOverviewTab scheme={scheme} />
        )}

        {activeTab === 'enrollments' && (
          <EnrollmentsTab
            scheme={scheme}
            shopId={currentShopId!}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsTab
            scheme={scheme}
            shopId={currentShopId!}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleTab
            scheme={scheme}
            shopId={currentShopId!}
          />
        )}

        {activeTab === 'analytics' && can('canViewAnalytics') && (
          <AnalyticsTab
            scheme={scheme}
            shopId={currentShopId!}
          />
        )}
      </div>
    </div>
  )
}