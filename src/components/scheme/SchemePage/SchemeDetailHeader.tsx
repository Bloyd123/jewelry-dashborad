// FILE: src/components/scheme/SchemePage/SchemeDetailHeader.tsx

import React from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { DesktopSchemeDetailHeader } from './DesktopSchemeDetailHeader'
import { MobileSchemeDetailHeader }  from './MobileSchemeDetailHeader'
import type { Scheme } from '@/types/scheme.types'

interface SchemeDetailHeaderProps {
  scheme:           Scheme
  activeTab?:       string
  onTabChange?:     (tab: string) => void
  onBackClick?:     () => void
  onSettingsClick?: () => void
}

export const SchemeDetailHeader: React.FC<SchemeDetailHeaderProps> = props => {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  return isMobile
    ? <MobileSchemeDetailHeader  {...props} />
    : <DesktopSchemeDetailHeader {...props} />
}