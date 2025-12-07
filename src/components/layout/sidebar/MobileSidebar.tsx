// ============================================================================
// FILE: layout/sidebar/MobileSidebar.tsx
// Mobile Sidebar with Overlay
// ============================================================================

import { Sidebar } from '../../sidebar/Sidebar'
import { useSidebar } from '@/hooks/useSidebar'

export const MobileSidebar = () => {
  const { isOpen, closeSidebar } = useSidebar()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div className="animate-slideInLeft fixed inset-y-0 left-0 z-50 lg:hidden">
        <Sidebar />
      </div>
    </>
  )
}
