// ============================================================================
// FILE: layout/sidebar/SidebarItem.tsx
// Single Sidebar Menu Item (No children)
// ============================================================================

import { NavLink } from 'react-router-dom'
import type { MenuItem } from '@/types/menu'
import { useSidebar } from '@/hooks/useSidebar'

interface SidebarItemProps {
  item: MenuItem
}

export const SidebarItem = ({ item }: SidebarItemProps) => {
  const { isCollapsed } = useSidebar()
  const Icon = item.icon

  if (!item.url) return null

  return (
    <NavLink
      to={`/${item.url}`}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 text-sidebar-text 
        transition-all duration-200 group
        hover:bg-sidebar-hover hover:text-accent
        ${isActive 
          ? 'bg-sidebar-active/10 text-accent border-l-4 border-accent' 
          : 'border-l-4 border-transparent'
        }
        ${isCollapsed ? 'justify-center' : ''}
        `
      }
    >
      {/* Icon */}
      <Icon size={20} className="shrink-0" />

      {/* Label - Hidden when collapsed */}
      {!isCollapsed && (
        <span className="text-sm font-medium truncate">{item.title}</span>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
          {item.title}
        </span>
      )}
    </NavLink>
  )
}