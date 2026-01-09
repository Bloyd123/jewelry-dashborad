// ============================================================================
// FILE: src/components/auth/2fa/index.ts
// Barrel Export for All 2FA Components
// ============================================================================

// Enable 2FA Modal (with sub-steps)
export { Enable2FAModal } from './Enable2FAModal'
export type { Enable2FAModalProps } from './Enable2FAModal'

// Individual steps (if needed separately)
export {
  Step1Introduction,
  Step2QRCode,
  Step3VerifyCode,
  Step4BackupCodes,
} from './Enable2FAModal'

// Disable 2FA Modal
export { Disable2FAModal } from './Disable2FAModal'
export type { Disable2FAModalProps } from './Disable2FAModal'

// Input Components
export { TwoFactorCodeInput } from './TwoFactorCodeInput'
export type { TwoFactorCodeInputProps } from './TwoFactorCodeInput'

export { BackupCodeInput } from './BackupCodeInput'
export type { BackupCodeInputProps } from './BackupCodeInput'

// Display Components
export { BackupCodesDisplay } from './BackupCodesDisplay'
export type { BackupCodesDisplayProps } from './BackupCodesDisplay'