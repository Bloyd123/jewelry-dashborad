// ============================================================================
// FILE: layout/sidebar/SidebarCollapse.tsx
// Collapsible Sidebar Menu Item (With children)
// ============================================================================

import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import type { MenuItem } from '@/types/menu'
import { useSidebar } from '@/hooks/useSidebar'

interface SidebarCollapseProps {
  item: MenuItem
}

export const SidebarCollapse = ({ item }: SidebarCollapseProps) => {
  const { isCollapsed } = useSidebar()
  const location = useLocation()
  const Icon = item.icon

  // Check if any child is active
  const isAnyChildActive = item.items?.some(subItem =>
    location.pathname.includes(subItem.url)
  )

  const [isOpen, setIsOpen] = useState(isAnyChildActive || false)

  const toggleOpen = () => setIsOpen(prev => !prev)

  return (
    <div>
      {/* Parent Item */}
      <button
        onClick={toggleOpen}
        className={`
          w-full flex items-center justify-between gap-3 px-4 py-3
          text-sidebar-text transition-all duration-200 group
          hover:bg-sidebar-hover hover:text-accent
          ${isAnyChildActive ? 'text-accent' : ''}
          ${isCollapsed ? 'justify-center' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className="shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">{item.title}</span>
          )}
        </div>

        {!isCollapsed && (
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
            {item.title}
          </span>
        )}
      </button>

      {/* Children Items */}
      {!isCollapsed && isOpen && item.items && (
        <div className="bg-sidebar-bg/50">
          {item.items.map(subItem => (
            <NavLink
              key={subItem.url}
              to={`${subItem.url}`}
              className={({ isActive }) =>
                `flex items-center gap-3 pl-12 pr-4 py-2.5 text-sm
                text-sidebar-muted transition-colors duration-200
                hover:bg-sidebar-hover hover:text-accent
                ${isActive ? 'text-accent bg-sidebar-hover' : ''}
                `
              }
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span className="truncate">{subItem.title}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}