// ============================================================================
// FILE: layout/sidebar/SidebarHeader.tsx
// Sidebar Header - Logo & Brand
// ============================================================================

import { useSidebar } from '@/hooks/useSidebar'
import { Menu, X } from 'lucide-react'
import logo from "@/assets/images/logo.png"
import { APP_CONFIG } from '@/config/app.config'

export const SidebarHeader = () => {
  const { isCollapsed, toggleCollapse } = useSidebar()

  return (
    <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
      {/* Logo & Brand */}
      {!isCollapsed && (
        <div className="flex items-center gap-3">
           <img
        src={logo}
        alt="Logo"
        style={{ width: 32, height: 32 }}
      />
          <span className="text-lg font-semibold text-sidebar-text">
            {APP_CONFIG.NAME}
          </span>
        </div>
      )}

      {/* Collapse Button */}
      <button
        onClick={toggleCollapse}
        className="p-2 rounded-md hover:bg-sidebar-hover text-sidebar-text transition-colors"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
      </button>
    </div>
  )
}