// FILE: src/components/user/UserDetail/UserDetailHeader.tsx

import React from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MobileUserDetailHeader } from './MobileUserDetailHeader'
import { DesktopUserDetailHeader } from './DesktopUserDetailHeader'
import type { User } from '@/types/user.types'

interface UserDetailHeaderProps {
  user: User
  activeTab?: string
  onTabChange?: (tab: string) => void
  onBackClick?: () => void
}

export const UserDetailHeader: React.FC<UserDetailHeaderProps> = props => {
  const isMobile = useMediaQuery('(max-width: 1024px)')

  return isMobile ? (
    <MobileUserDetailHeader {...props} />
  ) : (
    <DesktopUserDetailHeader {...props} />
  )
}

export default UserDetailHeader