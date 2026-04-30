// FILE: src/components/user/UserDetail/DesktopUserDetailHeader.tsx

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft,
  User,
  Shield,
  TrendingUp,
  Palette,
  Activity,
  Mail,
  Phone,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Breadcrumb } from '@/components/ui/navigation/Breadcrumb/Breadcrumb'
import { Tabs } from '@/components/ui/navigation/Tabs/Tabs'
import { Separator } from '@/components/ui/layout/Separator/Separator'
import { Avatar } from '@/components/ui/data-display/Avatar/Avatar'
import type { User as UserType } from '@/types/user.types'
import { usePermissionCheck } from '@/hooks/auth/usePermissions'

interface DesktopUserDetailHeaderProps {
  user: UserType
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
}

export const DesktopUserDetailHeader: React.FC<DesktopUserDetailHeaderProps> = ({
  user,
  activeTab = 'personal',
  onTabChange,
  onBackClick,
}) => {
  const { t } = useTranslation()
  const { can } = usePermissionCheck()
  const [currentTab, setCurrentTab] = useState(activeTab)

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  const fullName = user.fullName || `${user.firstName} ${user.lastName || ''}`.trim()

  const breadcrumbItems = [
    { label: t('user.page.title'), onClick: onBackClick },
    { label: fullName },
  ]

  const tabItems = [
    {
      value: 'personal',
      label: t('userProfile.tabs.personal'),
      icon: <User className="h-4 w-4" />,
    },
    {
      value: 'role',
      label: t('user.roleAndPermissions'),
      icon: <Shield className="h-4 w-4" />,
    },
    {
      value: 'sales',
      label: t('user.salesInformation'),
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      value: 'preferences',
      label: t('user.preferences'),
      icon: <Palette className="h-4 w-4" />,
    },
    ...(can('canViewUsers')
      ? [
          {
            value: 'activity',
            label: t('userProfile.tabs.activity'),
            icon: <Activity className="h-4 w-4" />,
          },
        ]
      : []),
  ]

  const roleVariants: Record<string, any> = {
    super_admin: 'vip',
    org_admin: 'warning',
    shop_admin: 'info',
    manager: 'default',
    staff: 'default',
    accountant: 'default',
    viewer: 'inactive',
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-border-secondary bg-bg-secondary">
        <div className="space-y-4 px-6 py-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBackClick} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                {t('user.page.title')}
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Breadcrumb items={breadcrumbItems} showHome={true} />
            </div>
          </div>

          <Separator />

          {/* User Info */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar
                src={user.profileImage || undefined}
                name={fullName}
                size="xl"
                status={user.isActive ? 'online' : 'offline'}
              />

              <div className="space-y-3">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-text-primary">{fullName}</h1>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={user.isActive ? 'active' : 'inactive'} size="sm">
                      {user.isActive ? t('common.active') : t('common.inactive')}
                    </Badge>
                    <Badge variant={roleVariants[user.role] || 'default'} size="sm">
                      {t(`roles.${user.role}`)}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {t(`departments.${user.department}`)}
                    </Badge>
                    {user.isEmailVerified && (
                      <Badge variant="success" size="sm">
                        {t('userProfile.emailVerified')}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-text-tertiary" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-text-tertiary" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.designation && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-text-tertiary" />
                        <span>{user.designation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center">
                <p className="text-xs text-text-tertiary">{t('userProfile.target')}</p>
                <p className="text-lg font-bold text-text-primary">
                  ₹{((user.salesTarget || 0) / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center">
                <p className="text-xs text-text-tertiary">{t('userProfile.commission')}</p>
                <p className="text-lg font-bold text-accent">
                  {user.commissionRate || 0}%
                </p>
              </div>
              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center">
                <p className="text-xs text-text-tertiary">{t('userProfile.lastLogin')}</p>
                <p className="text-xs font-semibold text-text-primary">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <Tabs
            tabs={tabItems}
            value={currentTab}
            onValueChange={handleTabChange}
            variant="underline"
            size="md"
          />
        </div>
      </div>
    </div>
  )
}

export default DesktopUserDetailHeader