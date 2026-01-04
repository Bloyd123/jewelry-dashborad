// ============================================================================
// FILE: src/pages/UserProfile/MobileUserProfileHeader.tsx
// Mobile User Profile Header Component
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { Tabs } from '@/components/ui/navigation/Tabs/Tabs'
import { Avatar } from '@/components/ui/data-display/Avatar/Avatar'
import { dummyUser } from '@/pages/user/data'

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface MobileUserProfileHeaderProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onSettingsClick?: () => void
}

// ============================================================================
// MOBILE USER PROFILE HEADER COMPONENT
// ============================================================================

export const MobileUserProfileHeader: React.FC<
  MobileUserProfileHeaderProps
> = ({ activeTab = 'personal', onTabChange, onBackClick, onSettingsClick }) => {
  const { t } = useTranslation()
  const [currentTab, setCurrentTab] = useState(activeTab)

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    if (onTabChange) {
      onTabChange(tab)
    }
  }

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
    <div className="space-y-0">
      {/* Header Section */}
      <div className="border-b border-border-secondary bg-bg-secondary">
        <div className="space-y-3 px-4 py-3">
          {/* Back Button and Settings */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="gap-2 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('common.back')}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onSettingsClick}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* User Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              {/* User Avatar */}
              <Avatar
                src={dummyUser.profileImage || undefined}
                name={dummyUser.fullName}
                size="lg"
                status={dummyUser.isActive ? 'online' : 'offline'}
              />

              {/* User Info */}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="space-y-1">
                  <h1 className="truncate text-lg font-bold text-text-primary">
                    {dummyUser.fullName}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-text-tertiary">
                    <span className="truncate">{dummyUser.email}</span>
                    {dummyUser.phone && (
                      <>
                        <span>•</span>
                        <span>{dummyUser.phone}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Badges - Mobile Compact */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant={dummyUser.isActive ? 'active' : 'inactive'}
                    size="sm"
                  >
                    {dummyUser.isActive
                      ? t('common.active')
                      : t('common.inactive')}
                  </Badge>

                  <Badge variant="default" size="sm">
                    {t(`roles.${dummyUser.role}`)}
                  </Badge>

                  <Badge variant="outline" size="sm">
                    {t(`departments.${dummyUser.department}`)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Stats - Mobile Card */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-bg-primary p-2 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('userProfile.target')}
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  ₹{(dummyUser.salesTarget / 1000).toFixed(0)}K
                </p>
              </div>

              <div className="rounded-lg bg-bg-primary p-2 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('userProfile.commission')}
                </p>
                <p className="text-sm font-semibold text-accent">
                  {dummyUser.commissionRate}%
                </p>
              </div>

              <div className="rounded-lg bg-bg-primary p-2 text-center">
                <p className="text-xs text-text-tertiary">
                  {t('userProfile.role')}
                </p>
                <p className="truncate text-xs font-semibold text-text-primary">
                  {dummyUser.designation || t(`roles.${dummyUser.role}`)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Mobile Scrollable */}
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

export default MobileUserProfileHeader
