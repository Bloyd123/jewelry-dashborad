// ============================================================================
// FILE: layout/navbar/MobileNavbar.tsx
// Mobile Navbar with Theme Picker
// ============================================================================

import { Menu, Bell, Palette } from 'lucide-react'
import { useSidebar } from '@/hooks/useSidebar'
import { useState } from 'react'
import { ThemePickerModal } from './ThemePickerModal'
import logo from "@/assets/images/logo.png"
import { APP_CONFIG } from '@/config/app.config'
export const MobileNavbar = () => {
  const { toggleSidebar } = useSidebar()
  const [showThemePicker, setShowThemePicker] = useState(false)

  return (
    <>
      <header className="h-16 bg-header-primary border-b border-border-primary px-4 flex items-center justify-between lg:hidden">
        {/* Left - Menu */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-bg-secondary text-text-primary transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Center - Logo */}
        <div className="flex items-center gap-2">
                    <img
        src={logo}
        alt="Logo"
        style={{ width: 32, height: 32 }}
      />
          <span className="text-lg font-semibold text-text-primary">{APP_CONFIG.NAME}</span>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Picker */}
          <button 
            onClick={() => setShowThemePicker(true)}
            className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors"
          >
            <Palette size={20} />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-status-error rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Theme Picker Modal */}
      <ThemePickerModal 
        isOpen={showThemePicker} 
        onClose={() => setShowThemePicker(false)} 
      />
    </>
  )
}