// FILE: layout/sidebar/SidebarCollapse.tsx
// Collapsible Sidebar Menu Item (With children)

import { useState, useEffect, useRef } from 'react'
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
  const parentRef = useRef<HTMLDivElement>(null)

  // Check if any child is active
  const isAnyChildActive = item.items?.some(
    subItem =>
      location.pathname === subItem.url ||
      location.pathname.startsWith(subItem.url + '/')
  )

  const [isOpen, setIsOpen] = useState(isAnyChildActive || false)

  useEffect(() => {
    if (isAnyChildActive) {
      setIsOpen(true)
      // Scroll active item into view
      setTimeout(() => {
        parentRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }, 100)
    }
  }, [isAnyChildActive])

  const toggleOpen = () => setIsOpen(prev => !prev)

  return (
    <div ref={parentRef}>
      {/* Parent Item */}
      <button
        onClick={toggleOpen}
        className={`group relative flex w-full items-center justify-between gap-3 px-4 py-3 transition-all duration-200 hover:bg-sidebar-hover hover:text-accent active:scale-95 ${
          isAnyChildActive
            ? 'bg-sidebar-hover font-medium text-accent' // ✅ Same as hover
            : 'text-sidebar-text'
        } ${isCollapsed ? 'justify-center' : ''} `}
      >
        <div className="flex items-center gap-3">
          <Icon
            size={20}
            className="shrink-0 transition-transform duration-200 group-hover:scale-110"
          />
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
          <span className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {item.title}
          </span>
        )}
      </button>

      {/* Children Items */}
      {!isCollapsed && isOpen && item.items && (
        <div className="bg-sidebar-bg/50">
          {item.items.map(subItem => {
            const SubIcon = subItem.icon

            return (
              <NavLink
                key={subItem.url}
                to={`${subItem.url}`}
                className={({ isActive }) =>
                  `group flex items-center gap-3 py-2.5 pl-12 pr-4 text-sm text-sidebar-muted transition-all duration-200 hover:bg-sidebar-hover hover:text-accent active:scale-[0.98] ${
                    isActive
                      ? 'bg-accent/10 border-l-4 border-accent font-medium text-accent'
                      : 'border-l-4 border-transparent'
                  } `
                }
              >
                {SubIcon ? (
                  <SubIcon
                    size={16}
                    className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                  />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current transition-transform duration-200 group-hover:scale-150" />
                )}
                <span className="truncate">{subItem.title}</span>
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}
