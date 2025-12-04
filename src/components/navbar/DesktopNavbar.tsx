// ============================================================================
// FILE: components/navbar/DesktopNavbar.tsx
// Desktop Navbar with Theme Picker Modal
// ============================================================================

import { Bell, Search, Settings, User, Moon, Sun, Palette, Languages } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useAppDispatch } from '@/store/hooks'
import { cycleTheme } from '@/store/slices/uiSlice'
import { useState } from 'react'
import { ThemePickerModal } from './ThemePickerModal'
import { LanguageDropdown } from './LanguageDropdown'
export const DesktopNavbar = () => {
  const { mode } = useTheme()
  const dispatch = useAppDispatch()
  const [showSearch, setShowSearch] = useState(false)
  const [showThemePicker, setShowThemePicker] = useState(false) 
  const [showLanguageMenu, setShowLanguageMenu] = useState(false) 

  const handleThemeCycle = () => {
    dispatch(cycleTheme())
  }

  return (
    <>
      <header className="h-16 bg-header-primary border-b border-border-primary px-6 flex items-center justify-between">
        {/* Left Section - Search */}
        <div className="flex items-center gap-4 flex-1">
          {showSearch ? (
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                  autoFocus
                  onBlur={() => setShowSearch(false)}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-4 py-2 bg-bg-secondary hover:bg-bg-tertiary border border-border-primary rounded-lg text-text-secondary transition-colors"
            >
              <Search size={18} />
              <span className="text-sm">Search...</span>
              <kbd className="px-2 py-0.5 text-xs bg-bg-primary border border-border-primary rounded">
                Ctrl K
              </kbd>
            </button>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Quick Toggle (Cycle) */}
          <button
            onClick={handleThemeCycle}
            className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-accent transition-colors"
            title="Quick theme toggle"
          >
            {mode === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Theme Picker (Open Modal) */}
          <button
            onClick={() => setShowThemePicker(true)} // ✅ Open modal
            className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-accent transition-colors"
            title="Choose theme"
          >
            <Palette size={20} />
          </button>
{/* Language Switcher */}  {/* ✅ ADD THIS WHOLE SECTION */}
<div className="relative">
  <button
    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
    className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-accent transition-colors"
    title="Change language"
  >
    <Languages size={20} />
  </button>
  
  {/* Language Dropdown */}
  {showLanguageMenu && (
    <LanguageDropdown onClose={() => setShowLanguageMenu(false)} />
  )}
</div>
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-accent transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-status-error rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-accent transition-colors">
            <Settings size={20} />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-border-primary mx-2"></div>

          {/* User Profile */}
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-secondary transition-colors">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-sm font-medium text-text-primary">John Doe</p>
              <p className="text-xs text-text-tertiary">Admin</p>
            </div>
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