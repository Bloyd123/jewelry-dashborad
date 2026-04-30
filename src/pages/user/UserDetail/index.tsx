// FILE: src/pages/users/UserDetail/index.tsx

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGetUserByIdQuery } from '@/store/api/userApi'
import { usePermissionCheck } from '@/hooks/auth/usePermissions'
import {
  UserDetailHeader,
  PersonalInfoTab,
  RoleAccessTab,
  SalesInfoTab,
  PreferencesTab,
  ActivityLogsTab,
} from '@/components/user/UserDetail'

export default function UserDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const { can } = usePermissionCheck()

  const [activeTab, setActiveTab] = useState('personal')

  const { data, isLoading, isError } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  })

 const user = data 

  // ── Loading ────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-border-primary border-t-accent" />
          <p className="text-sm text-text-secondary">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────
  if (isError || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-center">
          <p className="text-lg font-medium text-text-primary">
            {t('user.notFound')}
          </p>
          <button
            onClick={() => navigate('/users')}
            className="mt-4 text-sm text-accent hover:underline"
          >
            {t('common.goBack')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header with Tabs */}
      <UserDetailHeader
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBackClick={() => navigate('/users')}
      />

      {/* Tab Content */}
      <div>
        {activeTab === 'personal' && (
          <PersonalInfoTab user={user} />
        )}

        {activeTab === 'role' && (
          <RoleAccessTab user={user} />
        )}

        {activeTab === 'sales' && (
          <SalesInfoTab user={user} />
        )}

        {activeTab === 'preferences' && (
          <PreferencesTab user={user} />
        )}

        {activeTab === 'activity' && can('canViewUsers') && (
          <ActivityLogsTab user={user} />
        )}
      </div>
    </div>
  )
}