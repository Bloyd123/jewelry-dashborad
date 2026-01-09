// FILE: src/pages/UserProfile/UserProfileHeader.tsx
// Responsive User Profile Header (Main Component)

import React from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MobileUserProfileHeader } from './MobileUserProfileHeader'
import { DesktopUserProfileHeader } from './DesktopUserProfileHeader'

// COMPONENT PROPS

interface UserProfileHeaderProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
  onSettingsClick?: () => void
}

// RESPONSIVE USER PROFILE HEADER COMPONENT

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = props => {
  const isMobile = useMediaQuery('(max-width: 1024px)')

  return isMobile ? (
    <MobileUserProfileHeader {...props} />
  ) : (
    <DesktopUserProfileHeader {...props} />
  )
}

export default UserProfileHeader
