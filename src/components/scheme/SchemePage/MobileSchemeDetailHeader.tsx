// FILE: src/components/scheme/SchemePage/MobileSchemeDetailHeader.tsx

import React, { useState } from 'react'
import { useTranslation }  from 'react-i18next'
import {
  Settings, ChevronLeft, Users, BarChart3,
  FileText, Calendar, Activity,
} from 'lucide-react'
import { Button }    from '@/components/ui/button'
import { Badge }     from '@/components/ui/data-display/Badge'
import { Tabs }      from '@/components/ui/navigation/Tabs/Tabs'
import { Avatar }    from '@/components/ui/data-display/Avatar/Avatar'
import { usePermissionCheck } from '@/hooks/auth/usePermissions'
import type { Scheme } from '@/types/scheme.types'

interface MobileSchemeDetailHeaderProps {
  scheme:           Scheme
  activeTab?:       string
  onTabChange?:     (tab: string) => void
  onBackClick?:     () => void
  onSettingsClick?: () => void
}

export const MobileSchemeDetailHeader: React.FC<
  MobileSchemeDetailHeaderProps
> = ({
  scheme,
  activeTab = 'overview',
  onTabChange,
  onBackClick,
  onSettingsClick,
}) => {
  const { t }   = useTranslation()
  const { can } = usePermissionCheck()
  const [currentTab, setCurrentTab] = useState(activeTab)

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  const tabItems = [
    {
      value: 'overview',
      label: t('scheme.tabs.overview'),
      icon:  <FileText className="h-4 w-4" />,
    },
    {
      value: 'enrollments',
      label: t('scheme.tabs.enrollments'),
      icon:  <Users className="h-4 w-4" />,
    },
    {
      value: 'payments',
      label: t('scheme.tabs.payments'),
      icon:  <Activity className="h-4 w-4" />,
    },
    {
      value: 'schedule',
      label: t('scheme.tabs.schedule'),
      icon:  <Calendar className="h-4 w-4" />,
    },
    ...(can('canViewAnalytics')
      ? [{
          value: 'analytics',
          label: t('scheme.tabs.analytics'),
          icon:  <BarChart3 className="h-4 w-4" />,
        }]
      : []),
  ]

  const statusVariants: Record<string, string> = {
    active:   'active',
    draft:    'default',
    paused:   'warning',
    expired:  'error',
    archived: 'inactive',
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(amount)

  return (
    <div className="space-y-0">
      <div className="border-b border-border-secondary bg-bg-secondary">
        <div className="space-y-3 px-4 py-3">

          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="gap-2 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('scheme.common.backToList')}
            </Button>

            {can('canManageSchemes') && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSettingsClick}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Scheme Info */}
          <div className="flex items-start gap-3">
            <Avatar
              name={scheme.schemeName}
              size="lg"
              status={scheme.validity?.isActive ? 'online' : 'offline'}
            />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="space-y-1">
                <h1 className="truncate text-lg font-bold text-text-primary">
                  {scheme.schemeName}
                </h1>
                <p className="font-mono text-xs text-text-tertiary">
                  {scheme.schemeCode}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                  variant={statusVariants[scheme.status] as any}
                  size="sm"
                >
                  {scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)}
                </Badge>
                <Badge variant="default" size="sm">
                  {scheme.schemeType.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-bg-primary p-2 text-center">
              <p className="text-xs text-text-tertiary">
                {t('scheme.installmentAmount')}
              </p>
              <p className="text-sm font-semibold text-text-primary">
                {formatCurrency(scheme.installments?.installmentAmount || 0)}
              </p>
            </div>
            <div className="rounded-lg bg-bg-primary p-2 text-center">
              <p className="text-xs text-text-tertiary">
                {t('scheme.maturityValue')}
              </p>
              <p className="text-sm font-semibold text-status-success">
                {formatCurrency(scheme.maturity?.totalMaturityValue || 0)}
              </p>
            </div>
            <div className="rounded-lg bg-bg-primary p-2 text-center">
              <p className="text-xs text-text-tertiary">
                {t('scheme.activeEnrollments')}
              </p>
              <p className="text-sm font-semibold text-accent">
                {scheme.statistics?.activeEnrollments || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto px-4">
          <Tabs
            tabs={tabItems}
            value={currentTab}
            onValueChange={handleTabChange}
            variant="underline"
            size="sm"
          />
        </div>
      </div>
    </div>
  )
}