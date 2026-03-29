// FILE: src/components/payment/PaymentForm/PaymentForm.utils.ts

import type { PaymentFormData } from './PaymentForm.types'

export const buildPaymentDetails = (d: Partial<PaymentFormData>) => ({
  cashDetails:
    d.paymentMode === 'cash'
      ? { receivedAmount: d.receivedAmount, returnAmount: d.returnAmount }
      : undefined,
  cardDetails:
    d.paymentMode === 'card'
      ? { cardType: d.cardType, cardNetwork: d.cardNetwork, last4Digits: d.last4Digits, bankName: d.cardBankName, authorizationCode: d.authorizationCode, terminalId: d.terminalId }
      : undefined,
  upiDetails:
    d.paymentMode === 'upi'
      ? { upiId: d.upiId, transactionId: d.upiTransactionId, appName: d.upiApp }
      : undefined,
chequeDetails:
  d.paymentMode === 'cheque'
    ? { chequeNumber: d.chequeNumber!, chequeDate: d.chequeDate!, bankName: d.chequeBankName!, branchName: d.chequeBranchName, ifscCode: d.chequeIfscCode, accountNumber: d.chequeAccountNumber, chequeStatus: 'pending' as const }
    : undefined,
  bankTransferDetails:
    d.paymentMode === 'bank_transfer'
      ? { transactionId: d.transferTransactionId, referenceNumber: d.transferReferenceNumber, fromBank: d.fromBank, fromAccountNumber: d.fromAccountNumber, toBank: d.toBank, toAccountNumber: d.toAccountNumber, ifscCode: d.transferIfscCode, transferType: d.transferType }
      : undefined,
  walletDetails:
    d.paymentMode === 'wallet'
      ? { walletProvider: d.walletProvider, walletNumber: d.walletNumber, transactionId: d.walletTransactionId }
      : undefined,
})