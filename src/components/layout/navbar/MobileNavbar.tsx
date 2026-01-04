// FILE: layout/navbar/MobileNavbar.tsx
// Mobile Navbar with Theme Picker

import { Menu, Bell, Palette } from 'lucide-react'
import { useSidebar } from '@/hooks/useSidebar'
import { useState } from 'react'
import { ThemePickerModal } from './ThemePickerModal'
import logo from '@/assets/images/logo.png'
import { APP_CONFIG } from '@/config/app.config'
export const MobileNavbar = () => {
  const { toggleSidebar } = useSidebar()
  const [showThemePicker, setShowThemePicker] = useState(false)

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-border-primary bg-header-primary px-4 lg:hidden">
        {/* Left - Menu */}
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-text-primary transition-colors hover:bg-bg-secondary"
        >
          <Menu size={24} />
        </button>

        {/* Center - Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" style={{ width: 32, height: 32 }} />
          <span className="text-lg font-semibold text-text-primary">
            {APP_CONFIG.NAME}
          </span>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Picker */}
          <button
            onClick={() => setShowThemePicker(true)}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-secondary"
          >
            <Palette size={20} />
          </button>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-secondary">
            <Bell size={20} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-status-error"></span>
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
