// ============================================================================
// FILE: layouts/MainContent/MainContent.tsx
// Dashboard Layout with Sidebar + Navbar (FIXED)
// ============================================================================

import { Outlet } from 'react-router-dom'
import { Sidebar, MobileSidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { useMediaQuery } from '@/hooks/useMediaQuery'

import { useSidebar } from '@/hooks/useSidebar'

export const MainContent = () => {
  const { isCollapsed } = useSidebar()
  const isMobile = useMediaQuery('(max-width: 1024px)')

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      {/* Sidebar - Fixed Position */}
      <div className="fixed top-0 left-0 h-screen z-30">
        {isMobile ? <MobileSidebar /> : <Sidebar />}
      </div>

      {/* Main Content Area - With Dynamic Margin */}
      <div 
        className={`
          flex-1 flex flex-col overflow-hidden transition-all duration-300
          ${isMobile ? 'ml-0' : (isCollapsed ? 'ml-20' : 'ml-64')}
        `}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page Content - Outlet renders child routes */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

