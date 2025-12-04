// ============================================================================
// FILE: layout/navbar/ThemePickerModal.tsx
// Theme Picker Modal Component
// ============================================================================

import { X, Check } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setTheme } from '@/store/slices/uiSlice'
import { themes, type ThemeName } from '@/themes/presets'
import { useEffect } from 'react'

import {  Moon, Sun } from 'lucide-react'
interface ThemePickerModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ThemeInfo {
  name: ThemeName
  label: string
  description: string
}

const themeList: ThemeInfo[] = [
  { name: 'default', label: 'Default', description: 'Light with orange accent' },
  { name: 'defaultDark', label: 'Default Dark', description: 'Dark with orange accent' },
  { name: 'legacy', label: 'Legacy', description: 'Classic gold theme' },
  { name: 'light', label: 'Night', description: 'Dark blue-gray with emerald' },
  { name: 'light2', label: 'Sunshine', description: 'Warm yellow theme' },
  { name: 'light3', label: 'Purple Night', description: 'Deep indigo and purple' },
  { name: 'light4', label: 'Ocean', description: 'Clean blue theme' },
  { name: 'light5', label: 'Forest', description: 'Teal dark theme' },
]

export const ThemePickerModal = ({ isOpen, onClose }: ThemePickerModalProps) => {
  const dispatch = useAppDispatch()
  const { themeName } = useAppSelector(state => state.ui)

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleThemeChange = (name: ThemeName) => {
    dispatch(setTheme(name))
    // Don't close immediately - let user see the change
    setTimeout(onClose, 300)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-bg-secondary rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Choose Theme</h2>
              <p className="text-sm text-text-secondary mt-1">
                Select your preferred color theme
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Theme Grid */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {themeList.map(({ name, label, description }) => {
                const theme = themes[name]
                const isActive = themeName === name

                return (
                  <button
                    key={name}
                    onClick={() => handleThemeChange(name)}
                    className={`
                      relative rounded-lg border-2 p-4 text-left transition-all duration-200
                      hover:scale-105 hover:shadow-lg
                      ${
                        isActive
                          ? 'border-accent shadow-lg ring-2 ring-accent/20'
                          : 'border-border-primary hover:border-accent/50'
                      }
                    `}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Theme Preview */}
                    <div className="space-y-2 mb-3">
                      {/* Header Preview */}
                      <div
                        className="h-8 rounded flex items-center px-3 shadow-sm"
                        style={{ backgroundColor: theme.colors.header.primary }}
                      >
                        <div
                          className="w-16 h-2 rounded-full"
                          style={{ backgroundColor: theme.colors.header.secondary }}
                        />
                      </div>

                      {/* Body Preview */}
                      <div
                        className="h-20 rounded p-2 space-y-1 shadow-sm"
                        style={{ backgroundColor: theme.colors.background.primary }}
                      >
                        <div
                          className="h-full rounded p-2 space-y-1"
                          style={{ backgroundColor: theme.colors.background.secondary }}
                        >
                          <div
                            className="w-full h-2 rounded"
                            style={{ backgroundColor: theme.colors.text.primary, opacity: 0.8 }}
                          />
                          <div
                            className="w-3/4 h-2 rounded"
                            style={{ backgroundColor: theme.colors.text.secondary, opacity: 0.6 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Theme Info */}
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">{label}</h3>
                      <p className="text-xs text-text-tertiary">{description}</p>
                    </div>

                    {/* Mode Badge */}
                    <div className="mt-3">
                      <span
                        className={`
                          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${
                            theme.mode === 'dark'
                              ? 'bg-gray-800 text-gray-200'
                              : 'bg-gray-200 text-gray-800'
                          }
                        `}
                      >
                         {theme.mode === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border-primary bg-bg-primary">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-text-secondary">
                <span>
                  <strong>Current:</strong> {themes[themeName].name}
                </span>
                <span>
                  <strong>Mode:</strong> {themes[themeName].mode}
                </span>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}