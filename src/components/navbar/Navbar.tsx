// ============================================================================
// FILE: components/navbar/Navbar.tsx
// Main Navbar Component (Responsive)
// ============================================================================

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { DesktopNavbar } from './DesktopNavbar'
import { MobileNavbar } from './MobileNavbar'

export const Navbar = () => {
  const isMobile = useMediaQuery('(max-width: 1024px)')

  return isMobile ? <MobileNavbar /> : <DesktopNavbar />
}