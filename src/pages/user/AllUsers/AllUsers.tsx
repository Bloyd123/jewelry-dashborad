// FILE: src/pages/users/AllUsers/AllUsers.tsx

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Users, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent } from '@/components/ui/navigation/Tabs'
import { Button } from '@/components/ui/button'
import { UserTable } from '@/components/user/UserTable/UserTable'
import { usePermissionCheck } from '@/hooks/auth/usePermissions'
import { ROUTE_PATHS } from '@/constants/routePaths'

export interface AllUsersProps {
  className?: string
}

export const AllUsers: React.FC<AllUsersProps> = ({ className }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { can } = usePermissionCheck()

  const [activeTab, setActiveTab] = useState('table')

  const tabs = [
    {
      value: 'table',
      label: t('user.tabs.table'),
      icon: <Users className="h-4 w-4" />,
    },
  ]

  const handleAddUser = () => navigate(ROUTE_PATHS.USERS.ADD)

  return (
    <div className={`min-h-screen bg-bg-primary ${className || ''}`}>
      {/* Page Header */}
      <div className="sticky top-0 z-10 border-b border-border-primary bg-bg-secondary shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Title */}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
                {t('user.page.title')}
              </h1>
              <p className="mt-1 text-sm text-text-tertiary">
                {t('user.page.subtitle')}
              </p>
            </div>

            {/* Add Button */}
            {can('canCreateUsers') && (
              <Button
                onClick={handleAddUser}
                variant="default"
                size="default"
                className="whitespace-nowrap"
                aria-label={t('user.actions.addNew')}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{t('user.actions.addNew')}</span>
                <span className="sm:hidden">{t('user.actions.add')}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Tabs
          tabs={tabs}
          value={activeTab}
          onValueChange={setActiveTab}
          variant="underline"
          size="md"
          fullWidth={false}
          className="w-full"
        >
          <TabsContent value="table" className="focus-visible:outline-none">
            <div className="mt-4">
              <UserTable />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

AllUsers.displayName = 'AllUsers'