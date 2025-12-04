// ============================================================================
// FILE: layout/sidebar/SidebarFooter.tsx
// Sidebar Footer - User Info, Settings, Logout
// ============================================================================

import { Settings, LogOut, User } from 'lucide-react'
import { useSidebar } from '@/hooks/useSidebar'

export const SidebarFooter = () => {
  const { isCollapsed } = useSidebar()

  return (
    <div className="mt-auto border-t border-sidebar-border p-4">
      {!isCollapsed ? (
        <div className="space-y-2">
          {/* User Info */}
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-text truncate">
                John Doe
              </p>
              <p className="text-xs text-sidebar-muted truncate">
                john@example.com
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-sidebar-text hover:bg-sidebar-hover rounded-md transition-colors">
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-sidebar-text hover:bg-sidebar-hover rounded-md transition-colors">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      ) : (
        // Collapsed state
        <div className="flex flex-col gap-2">
          <button className="p-2 text-sidebar-text hover:bg-sidebar-hover rounded-md transition-colors">
            <User size={20} />
          </button>
          <button className="p-2 text-sidebar-text hover:bg-sidebar-hover rounded-md transition-colors">
            <Settings size={20} />
          </button>
          <button className="p-2 text-sidebar-text hover:bg-sidebar-hover rounded-md transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      )}
    </div>
  )
}