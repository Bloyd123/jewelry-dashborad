
// FILE: layout/navbar/LanguageDropdown.tsx
// Language Selection Dropdown Component

import { useRef, useEffect } from 'react'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Language {
  code: string
  name: string
  nativeName: string
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'marathi', nativeName: 'मराठी' },
]

interface LanguageDropdownProps {
  onClose: () => void
}

export const LanguageDropdown = ({ onClose }: LanguageDropdownProps) => {
  const { i18n } = useTranslation()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    onClose()
  }

  return (
    <div
      ref={dropdownRef}
      className="border-border absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border bg-bg-secondary shadow-lg"
    >
      <div className="py-1">
        {languages.map(language => {
          const isSelected = language.code === i18n.language

          return (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex w-full items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-bg-tertiary ${isSelected ? 'bg-accent/10' : ''} `}
            >
              {/* Language Names */}
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-text-primary">
                  {language.name}
                </div>
                <div className="text-xs text-text-secondary">
                  {language.nativeName}
                </div>
              </div>

              {/* Check Icon for Selected */}
              {isSelected && <Check size={18} className="text-accent" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default LanguageDropdown
