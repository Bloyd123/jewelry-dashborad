// 
// FILE: components/sidebar/Sidebar.tsx
// Main Sidebar Component
// 

import { useTranslation } from 'react-i18next' // If using i18n
import { SidebarHeader } from '../layout/sidebar/SidebarHeader'
import { SidebarItem } from '../layout/sidebar/SidebarItem'
import { SidebarCollapse } from '../layout/sidebar/SidebarCollapse'
import { SidebarFooter } from '../layout/sidebar/SidebarFooter'
import { getMenuItems } from '@/config/sidebar-menu'
import { useSidebar } from '@/hooks/useSidebar'
import { useMemo } from 'react'

export const Sidebar = () => {
  const { isCollapsed } = useSidebar()
  const { t, i18n } = useTranslation()

  // const menuItems = getMenuItems(t) // Get translated menu items
  const menuItems = useMemo(() => getMenuItems(t), [t, i18n.language])

  return (
    <aside
      className={`flex h-screen flex-col border-r border-sidebar-border bg-sidebar-bg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} `}
    >
      {/* Header */}
      <SidebarHeader />

      {/* Menu Items */}
      <nav className="scrollbar-hide flex-1 overflow-y-auto py-4">
        {menuItems.map(item =>
          item.items ? (
            <SidebarCollapse key={item.title} item={item} />
          ) : (
            <SidebarItem key={item.title} item={item} />
          )
        )}
      </nav>

      {/* Footer */}
      <SidebarFooter />
    </aside>
  )
}
