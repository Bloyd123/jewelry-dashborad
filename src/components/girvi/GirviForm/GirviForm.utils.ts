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


export const buildGirviPayload = (d: Partial<GirviFormData>) => ({
  customerId:          d.customerId!,
  items: (d.items || []).map((item) => ({
    itemName:        item.itemName,
    itemType:        item.itemType,
    description:     item.description,
    quantity:        Number(item.quantity) || 1,
    grossWeight:     parseFloat(String(item.grossWeight || 0)),
    lessWeight:      parseFloat(String(item.lessWeight  || 0)),
    tunch:           item.tunch       ? parseFloat(String(item.tunch))       : undefined,
    purity:          item.purity,
    ratePerGram:     item.ratePerGram ? parseFloat(String(item.ratePerGram)) : undefined,
    userGivenValue:  item.userGivenValue ? parseFloat(String(item.userGivenValue)) : undefined,
    condition:       item.condition,
  })),
  principalAmount:     parseFloat(String(d.principalAmount || 0)),
  loanToValueRatio:    d.loanToValueRatio ? parseFloat(String(d.loanToValueRatio)) : undefined,
  interestRate:        parseFloat(String(d.interestRate || 0)),
  interestType:        d.interestType        || 'simple',
  calculationBasis:    d.calculationBasis    || 'monthly',
  girviDate:           d.girviDate!,
  dueDate:             d.dueDate,
  gracePeriodDays:     d.gracePeriodDays ? Number(d.gracePeriodDays) : undefined,
  paymentMode:         d.paymentMode || 'cash',
  transactionReference: d.transactionReference,
  girviSlipNumber:     d.girviSlipNumber,
  witnessName:         d.witnessName,
  notes:               d.notes,
  internalNotes:       d.internalNotes,
})

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