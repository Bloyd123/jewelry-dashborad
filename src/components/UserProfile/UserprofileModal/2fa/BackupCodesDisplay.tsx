// ============================================================================
// FILE: src/components/auth/2fa/BackupCodesDisplay.tsx
// Backup Codes Display with Download/Copy/Print
// ============================================================================

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Copy, Printer, Check, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

export interface BackupCodesDisplayProps {
  codes: string[]
  usedCodes?: string[]
  showUsedStatus?: boolean
  className?: string
}

// ============================================================================
// COMPONENT
// ============================================================================

export const BackupCodesDisplay: React.FC<BackupCodesDisplayProps> = ({
  codes,
  usedCodes = [],
  showUsedStatus = false,
  className,
}) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleCopy = () => {
    const text = codes.join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const text = [
      '2FA Backup Codes',
      '==================',
      '',
      'Save these codes in a safe place!',
      'Each code can only be used once.',
      '',
      ...codes.map((code, i) => `${i + 1}. ${code}`),
      '',
      `Generated: ${new Date().toLocaleString()}`,
    ].join('\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `2fa-backup-codes-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=600,height=400')
    if (!printWindow) return

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>2FA Backup Codes</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 600px;
              margin: 0 auto;
            }
            h1 {
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .codes {
              font-family: 'Courier New', monospace;
              font-size: 14px;
              line-height: 2;
            }
            .code {
              padding: 8px;
              margin: 4px 0;
              background: #f8f9fa;
              border-left: 3px solid #007bff;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <h1>🔐 Two-Factor Authentication Backup Codes</h1>
          
          <div class="warning">
            <strong>⚠️ Important:</strong><br>
            Save these codes in a safe place! You'll need them to access your account if you lose your phone.
            Each code can only be used once.
          </div>

          <div class="codes">
            ${codes.map((code, i) => `<div class="code">${i + 1}. ${code}</div>`).join('')}
          </div>

          <div class="footer">
            Generated: ${new Date().toLocaleString()}<br>
            Keep these codes private and secure.
          </div>
        </body>
      </html>
    `

    printWindow.document.write(content)
    printWindow.document.close()
    printWindow.print()
  }

  const isCodeUsed = (code: string) => {
    return showUsedStatus && usedCodes.includes(code)
  }

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className={cn('space-y-4', className)}>
      {/* Title */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-text-primary">
          {t('auth.2fa.backupCodes')}
        </h4>
        {showUsedStatus && (
          <span className="text-xs text-text-tertiary">
            {codes.length - usedCodes.length} {t('auth.2fa.remaining')}
          </span>
        )}
      </div>

      {/* Codes Grid */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-4">
        <div className="grid grid-cols-2 gap-2">
          {codes.map((code, index) => {
            const used = isCodeUsed(code)
            return (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-2 rounded px-3 py-2 font-mono text-sm',
                  used
                    ? 'bg-bg-tertiary text-text-tertiary line-through'
                    : 'bg-bg-primary text-text-primary'
                )}
              >
                {used ? (
                  <CheckCircle className="h-3 w-3 shrink-0 text-status-success" />
                ) : (
                  <span className="w-3 shrink-0 text-xs text-text-tertiary">
                    {index + 1}.
                  </span>
                )}
                <span>{code}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="flex-1"
        >
          <Download className="h-4 w-4" />
          {t('auth.2fa.downloadCodes')}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex-1"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-status-success" />
              {t('common.copied')}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              {t('auth.2fa.copyCodes')}
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="flex-1"
        >
          <Printer className="h-4 w-4" />
          {t('auth.2fa.printCodes')}
        </Button>
      </div>

      {/* Helper text */}
      <div className="rounded-lg bg-bg-tertiary px-3 py-2 text-xs text-text-secondary">
        💡 {t('auth.2fa.backupCodesHint')}
      </div>
    </div>
  )
}