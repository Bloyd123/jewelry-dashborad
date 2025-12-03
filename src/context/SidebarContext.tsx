// ============================================================================
// FILE: context/SidebarContext.tsx
// Sidebar Context - Manage Sidebar State
// ============================================================================

import { createContext, useContext, useState, ReactNode } from 'react'

interface SidebarContextType {
  isOpen: boolean
  isCollapsed: boolean
  toggleSidebar: () => void
  toggleCollapse: () => void
  closeSidebar: () => void
  openSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => setIsOpen(prev => !prev)
  const toggleCollapse = () => setIsCollapsed(prev => !prev)
  const closeSidebar = () => setIsOpen(false)
  const openSidebar = () => setIsOpen(true)

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isCollapsed,
        toggleSidebar,
        toggleCollapse,
        closeSidebar,
        openSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}