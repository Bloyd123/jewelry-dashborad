// FILE: layout/navbar/DesktopNavbar.tsx
// Desktop Navbar with Theme Picker Modal

import {
  Bell,
  Search,
  Settings,
  User,
  Moon,
  Sun,
  Palette,
  Languages,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { dummyUser } from '@/pages/user/data'
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
  const navigate = useNavigate()

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-border-primary bg-header-primary px-6">
        {/* Left Section - Search */}
        <div className="flex flex-1 items-center gap-4">
          {showSearch ? (
            <div className="flex max-w-md flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-lg border border-border-primary bg-bg-secondary py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                  autoFocus
                  onBlur={() => setShowSearch(false)}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 rounded-lg border border-border-primary bg-bg-secondary px-4 py-2 text-text-secondary transition-colors hover:bg-bg-tertiary"
            >
              <Search size={18} />
              <span className="text-sm">Search...</span>
              <kbd className="rounded border border-border-primary bg-bg-primary px-2 py-0.5 text-xs">
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
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-secondary hover:text-accent"
            title="Quick theme toggle"
          >
            {mode === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          {/* Theme Picker (Open Modal) */}
          <button
            onClick={() => setShowThemePicker(true)} // ✅ Open modal
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-secondary hover:text-accent"
            title="Choose theme"
          >
            <Palette size={20} />
          </button>
          {/* Language Switcher */} {/* ✅ ADD THIS WHOLE SECTION */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-secondary hover:text-accent"
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
          <button className="relative rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-secondary hover:text-accent">
            <Bell size={20} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-status-error"></span>
          </button>
          {/* Settings */}
          <button className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-secondary hover:text-accent">
            <Settings size={20} />
          </button>
          {/* Divider */}
          <div className="mx-2 h-6 w-px bg-border-primary"></div>
          {/* User Profile */}
          <button
            onClick={() => navigate('/userprofile')}
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-bg-secondary"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
              <User size={16} />
            </div>
            <div className="hidden text-left xl:block">
              <p className="text-sm font-medium text-text-primary">
                {dummyUser.fullName}
              </p>
              {/* <p className="text-xs text-text-tertiary">Admin</p> */}
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
