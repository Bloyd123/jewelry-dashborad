// FILE: layout/navbar/ThemePickerModal.tsx
// Theme Picker Modal Component

import { X, Check } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setTheme } from '@/store/slices/uiSlice'
import { themes, type ThemeName } from '@/themes/presets'
import { useEffect } from 'react'

import { Moon, Sun } from 'lucide-react'
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
  {
    name: 'default',
    label: 'Default',
    description: 'Light with orange accent',
  },
  {
    name: 'defaultDark',
    label: 'Default Dark',
    description: 'Dark with orange accent',
  },
  { name: 'legacy', label: 'Legacy', description: 'Classic gold theme' },
  { name: 'light', label: 'Night', description: 'Dark blue-gray with emerald' },
  { name: 'light2', label: 'Sunshine', description: 'Warm yellow theme' },
  {
    name: 'light3',
    label: 'Purple Night',
    description: 'Deep indigo and purple',
  },
  { name: 'light4', label: 'Ocean', description: 'Clean blue theme' },
  { name: 'light5', label: 'Forest', description: 'Teal dark theme' },
]

export const ThemePickerModal = ({
  isOpen,
  onClose,
}: ThemePickerModalProps) => {
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
        className="animate-fadeIn fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="animate-slideUp pointer-events-auto max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-bg-secondary shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-primary px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                Choose Theme
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Select your preferred color theme
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
            >
              <X size={20} />
            </button>
          </div>

          {/* Theme Grid */}
          <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {themeList.map(({ name, label, description }) => {
                const theme = themes[name]
                const isActive = themeName === name

                return (
                  <button
                    key={name}
                    onClick={() => handleThemeChange(name)}
                    className={`relative rounded-lg border-2 p-4 text-left transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                      isActive
                        ? 'ring-accent/20 border-accent shadow-lg ring-2'
                        : 'hover:border-accent/50 border-border-primary'
                    } `}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent shadow-md">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}

                    {/* Theme Preview */}
                    <div className="mb-3 space-y-2">
                      {/* Header Preview */}
                      <div
                        className="flex h-8 items-center rounded px-3 shadow-sm"
                        style={{ backgroundColor: theme.colors.header.primary }}
                      >
                        <div
                          className="h-2 w-16 rounded-full"
                          style={{
                            backgroundColor: theme.colors.header.secondary,
                          }}
                        />
                      </div>

                      {/* Body Preview */}
                      <div
                        className="h-20 space-y-1 rounded p-2 shadow-sm"
                        style={{
                          backgroundColor: theme.colors.background.primary,
                        }}
                      >
                        <div
                          className="h-full space-y-1 rounded p-2"
                          style={{
                            backgroundColor: theme.colors.background.secondary,
                          }}
                        >
                          <div
                            className="h-2 w-full rounded"
                            style={{
                              backgroundColor: theme.colors.text.primary,
                              opacity: 0.8,
                            }}
                          />
                          <div
                            className="h-2 w-3/4 rounded"
                            style={{
                              backgroundColor: theme.colors.text.secondary,
                              opacity: 0.6,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Theme Info */}
                    <div>
                      <h3 className="mb-1 font-semibold text-text-primary">
                        {label}
                      </h3>
                      <p className="text-xs text-text-tertiary">
                        {description}
                      </p>
                    </div>

                    {/* Mode Badge */}
                    <div className="mt-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          theme.mode === 'dark'
                            ? 'bg-gray-800 text-gray-200'
                            : 'bg-gray-200 text-gray-800'
                        } `}
                      >
                        {theme.mode === 'dark' ? (
                          <Moon size={20} />
                        ) : (
                          <Sun size={20} />
                        )}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border-primary bg-bg-primary px-6 py-4">
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
                className="hover:bg-accent/90 rounded-lg bg-accent px-4 py-2 text-white transition-colors"
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
