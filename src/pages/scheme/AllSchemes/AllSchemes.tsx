// FILE: src/pages/scheme/AllSchemes/AllSchemes.tsx

import React, { useState } from 'react'
import { useTranslation }  from 'react-i18next'
import { Plus, List, BarChart3, LayoutDashboard } from 'lucide-react'
import { Tabs, TabsContent } from '@/components/ui/navigation/Tabs'
import { Button }           from '@/components/ui/button'
import { useNavigate }      from 'react-router-dom'
import { useAuth }          from '@/hooks/auth'
import { usePermissionCheck } from '@/hooks/auth/usePermissions'
import { SchemeTable }      from '@/components/scheme/SchemeTable'
import { SchemeAnalytics }  from '@/components/scheme/analytics'
import { SchemeDashboardTab } from './tabs/SchemeDashboardTab'

export interface AllSchemesProps {
  className?: string
}

export const AllSchemes: React.FC<AllSchemesProps> = ({ className }) => {
  const { t }             = useTranslation()
  const navigate          = useNavigate()
  const { currentShopId } = useAuth()
  const { can }           = usePermissionCheck()

  const [activeTab, setActiveTab] = useState('table')

  const tabs = [
    {
      value: 'table',
      label: t('scheme.tabs.list'),
      icon:  <List className="h-4 w-4" />,
    },
    {
      value: 'dashboard',
      label: t('scheme.tabs.dashboard'),
      icon:  <LayoutDashboard className="h-4 w-4" />,
    },
    ...(can('canViewAnalytics')
      ? [{
          value: 'analytics',
          label: t('scheme.tabs.analytics'),
          icon:  <BarChart3 className="h-4 w-4" />,
        }]
      : []),
  ]

  return (
    <div className={`min-h-screen bg-bg-primary ${className || ''}`}>
      {/* Page Header */}
      <div className="sticky top-0 z-10 border-b border-border-primary bg-bg-secondary shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
                {t('scheme.page.title')}
              </h1>
              <p className="mt-1 text-sm text-text-tertiary">
                {t('scheme.page.subtitle')}
              </p>
            </div>

            {can('canManageSchemes') && (
              <Button
                onClick={() => navigate('/schemes/add')}
                variant="default"
                size="default"
                className="whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {t('scheme.actions.addNew')}
                </span>
                <span className="sm:hidden">{t('scheme.actions.add')}</span>
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
          {/* Table Tab */}
          <TabsContent value="table" className="focus-visible:outline-none">
            <div className="mt-4">
              <SchemeTable />
            </div>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="focus-visible:outline-none">
            <div className="mt-4">
              {currentShopId && (
                <SchemeDashboardTab shopId={currentShopId} />
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="focus-visible:outline-none">
            <div className="mt-4">
              {currentShopId && (
                <SchemeAnalytics shopId={currentShopId} />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

AllSchemes.displayName = 'AllSchemes'