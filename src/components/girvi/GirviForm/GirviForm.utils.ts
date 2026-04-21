// FILE: src/components/girvi/GirviForm/GirviForm.utils.ts

import type { GirviItemFormData, GirviFormData } from './GirviForm.types'


export const calcNetWeight = (grossWeight: number, lessWeight: number): number =>
  Math.max(0, grossWeight - lessWeight)

export const calcApproxValue = (
  netWeight: number,
  tunch: number,
  ratePerGram: number
): number =>
  parseFloat((netWeight * (tunch / 100) * ratePerGram).toFixed(2))

export const calcFinalValue = (
  approxValue?: number,
  userGivenValue?: number | string
): number => {
  const userVal = parseFloat(String(userGivenValue || 0))
  return userVal > 0 ? userVal : (approxValue ?? 0)
}

export const recalcItem = (item: GirviItemFormData): GirviItemFormData => {
  const gross = parseFloat(String(item.grossWeight || 0))
  const less  = parseFloat(String(item.lessWeight  || 0))
  const net   = calcNetWeight(gross, less)

  const tunch       = parseFloat(String(item.tunch       || 0))
  const ratePerGram = parseFloat(String(item.ratePerGram || 0))

  const approxValue =
    net > 0 && tunch > 0 && ratePerGram > 0
      ? calcApproxValue(net, tunch, ratePerGram)
      : undefined

  const finalValue = calcFinalValue(approxValue, item.userGivenValue)

  return {
    ...item,
    netWeight:   net,
    approxValue,
    finalValue,
  }
}


export const calcFormTotals = (items: GirviItemFormData[]) => {
  return items.reduce(
    (acc, item) => ({
      totalGrossWeight: acc.totalGrossWeight + parseFloat(String(item.grossWeight || 0)),
      totalNetWeight:   acc.totalNetWeight   + (item.netWeight   ?? 0),
      totalApproxValue: acc.totalApproxValue + (item.finalValue  ?? 0),
    }),
    { totalGrossWeight: 0, totalNetWeight: 0, totalApproxValue: 0 }
  )
}


export const calcLoanToValue = (
  principalAmount: number,
  totalApproxValue: number
): number => {
  if (!totalApproxValue || totalApproxValue === 0) return 0
  return parseFloat(((principalAmount / totalApproxValue) * 100).toFixed(2))
}


export const createBlankItem = (): GirviItemFormData => ({
  itemName:   '',
  itemType:   'gold',
  quantity:   1,
  grossWeight: '' as any,
  lessWeight:  0,
  condition:  'good',
})



export const safeFloat = (val: any, fallback?: number): number | undefined => {
  const n = parseFloat(String(val ?? ''))
  if (isNaN(n)) return fallback
  return n
}

export const safeInt = (val: any, fallback?: number): number | undefined => {
  const n = parseInt(String(val ?? ''))
  if (isNaN(n)) return fallback
  return n
}

export const buildCreateGirviPayload = (d: Partial<GirviFormData>) => ({
  customerId:           d.customerId!,
  items: (d.items || []).map((item) => ({
    itemName:         item.itemName,
    itemType:         item.itemType,
    description:      item.description,
    quantity:         safeInt(item.quantity, 1)!,
    grossWeight:      safeFloat(item.grossWeight, 0)!,
    lessWeight:       safeFloat(item.lessWeight,  0)!,
    tunch:            safeFloat(item.tunch),
    purity:           item.purity,
    ratePerGram:      safeFloat(item.ratePerGram),
    userGivenValue:   safeFloat(item.userGivenValue),
    condition:        item.condition,
  })),
  principalAmount:      safeFloat(d.principalAmount, 0)!,
  loanToValueRatio:     safeFloat(d.loanToValueRatio),
  interestRate:         safeFloat(d.interestRate, 0)!,
  interestType:         d.interestType     || 'simple',
  calculationBasis:     d.calculationBasis || 'monthly',
  girviDate:            d.girviDate!,
  dueDate:              d.dueDate,
  gracePeriodDays:      safeInt(d.gracePeriodDays),
  paymentMode:          d.paymentMode || 'cash',
  transactionReference: d.transactionReference,
  girviSlipNumber:      d.girviSlipNumber,
  witnessName:          d.witnessName,
  notes:                d.notes,
  internalNotes:        d.internalNotes,
})

export const buildUpdateGirviPayload = (d: Partial<GirviFormData>) => ({
  interestRate:      safeFloat(d.interestRate, 0)!,
  interestType:      d.interestType     || 'simple',
  calculationBasis:  d.calculationBasis || 'monthly',
  dueDate:           d.dueDate,
  gracePeriodDays:   safeInt(d.gracePeriodDays),
  girviSlipNumber:   d.girviSlipNumber,
  witnessName:       d.witnessName,
  notes:             d.notes,
  internalNotes:     d.internalNotes,
})

export const buildGirviPayload = buildCreateGirviPayload
const ones  = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const tens  = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

const belowThousand = (n: number): string => {
  if (n === 0) return ''
  if (n < 10) return ones[n]
  if (n < 20) return teens[n - 10]
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
  return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + belowThousand(n % 100) : '')
}

export const numberToWords = (num: number): string => {
  if (!num || num === 0) return ''
  const crore   = Math.floor(num / 10_000_000)
  const lakh    = Math.floor((num % 10_000_000) / 100_000)
  const thousand = Math.floor((num % 100_000) / 1_000)
  const rem     = num % 1_000
  let result = ''
  if (crore)    result += belowThousand(crore)    + ' Crore '
  if (lakh)     result += belowThousand(lakh)     + ' Lakh '
  if (thousand) result += belowThousand(thousand) + ' Thousand '
  if (rem)      result += belowThousand(rem)
  return result.trim() + ' Rupees Only'
}