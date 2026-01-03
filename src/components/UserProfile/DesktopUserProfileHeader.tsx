// ============================================================================
// FILE: src/pages/UserProfile/DesktopUserProfileHeader.tsx
// Desktop User Profile Header Component
// ============================================================================

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Settings,
  User,
  ChevronLeft,
  Shield,
  Palette,
  Store,
  TrendingUp,
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
import { dummyUser } from '@/pages/user/data'

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface DesktopUserProfileHeaderProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onSettingsClick?: () => void
}

// ============================================================================
// DESKTOP USER PROFILE HEADER COMPONENT
// ============================================================================

export const DesktopUserProfileHeader: React.FC<
  DesktopUserProfileHeaderProps
> = ({
  activeTab = 'personal',
  onTabChange,
  onBackClick,
  onSettingsClick,
}) => {
  const { t } = useTranslation()
  const [currentTab, setCurrentTab] = useState(activeTab)

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    if (onTabChange) {
      onTabChange(tab)
    }
  }

  // Breadcrumb items
  const breadcrumbItems = [
    {
      label: t('userProfile.title'),
      onClick: onBackClick,
    },
    {
      label: dummyUser.fullName,
    },
  ]

  // Tab items
  const tabItems = [
    {
      value: 'personal',
      label: t('userProfile.tabs.personal'),
      icon: <User className="h-4 w-4" />,
    },
    {
      value: 'security',
      label: t('userProfile.tabs.security'),
      icon: <Shield className="h-4 w-4" />,
    },
    {
      value: 'preferences',
      label: t('userProfile.tabs.preferences'),
      icon: <Palette className="h-4 w-4" />,
    },
    {
      value: 'shopAccess',
      label: t('userProfile.tabs.shopAccess'),
      icon: <Store className="h-4 w-4" />,
    },
    {
      value: 'performance',
      label: t('userProfile.tabs.performance'),
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      value: 'activity',
      label: t('userProfile.tabs.activity'),
      icon: <Activity className="h-4 w-4" />,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="border-b border-border-secondary bg-bg-secondary">
        <div className="space-y-4 px-6 py-4">
          {/* Back Button and Breadcrumb */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackClick}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('userProfile.backToDashboard')}
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Breadcrumb items={breadcrumbItems} showHome={true} />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onSettingsClick}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              {t('common.settings')}
            </Button>
          </div>

          <Separator />

          {/* User Details */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* User Avatar */}
              <Avatar
                src={dummyUser.profileImage || undefined}
                name={dummyUser.fullName}
                size="xl"
                status={dummyUser.isActive ? 'online' : 'offline'}
              />

              {/* User Info */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-text-primary">
                      {dummyUser.fullName}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Active Status */}
                    <Badge
                      variant={dummyUser.isActive ? 'active' : 'inactive'}
                      size="sm"
                    >
                      {dummyUser.isActive
                        ? t('common.active')
                        : t('common.inactive')}
                    </Badge>

                    {/* Role Badge */}
                    <Badge variant="default" size="sm">
                      {t(`roles.${dummyUser.role}`)}
                    </Badge>

                    {/* Department Badge */}
                    <Badge variant="outline" size="sm">
                      {t(`departments.${dummyUser.department}`)}
                    </Badge>

                    {/* Email Verified */}
                    {dummyUser.isEmailVerified && (
                      <Badge variant="success" size="sm">
                        {t('userProfile.emailVerified')}
                      </Badge>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-text-tertiary" />
                      <span>{dummyUser.email}</span>
                    </div>

                    {dummyUser.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-text-tertiary" />
                        <span>{dummyUser.phone}</span>
                      </div>
                    )}

                    {dummyUser.designation && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-text-tertiary" />
                        <span>{dummyUser.designation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="flex gap-3">
              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('userProfile.salesTarget')}
                </p>
                <p className="text-lg font-bold text-text-primary">
                  ₹{(dummyUser.salesTarget / 1000).toFixed(0)}K
                </p>
              </div>

              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('userProfile.commission')}
                </p>
                <p className="text-lg font-bold text-accent">
                  {dummyUser.commissionRate}%
                </p>
              </div>

              <div className="rounded-lg border border-border-primary bg-bg-primary p-3 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('userProfile.lastLogin')}
                </p>
                <p className="text-xs font-semibold text-text-primary">
                  {new Date(dummyUser.lastLogin!).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
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

export default DesktopUserProfileHeader