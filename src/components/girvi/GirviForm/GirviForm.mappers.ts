// FILE: src/components/girvi/GirviForm/GirviForm.mappers.ts

import type { GirviFormData, GirviItemFormData } from './GirviForm.types'

/**
 * Backend se aaye Girvi document ko GirviFormData mein convert karta hai.
 * Edit aur view mode dono ke liye use karo.
 *
 * Usage:
 *   const mappedData = mapGirviToFormData(girvi)
 *   <GirviForm initialData={mappedData} mode="edit" ... />
 */
export const mapGirviToFormData = (girvi: any): Partial<GirviFormData> => {
  if (!girvi) return {}

  // customerId populated object ho sakta hai (backend .populate() ke baad)
  const customer =
    girvi.customerId && typeof girvi.customerId === 'object'
      ? girvi.customerId
      : null

  const customerId =
    customer?._id ?? girvi.customerId ?? ''

  const customerName = customer
    ? `${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim()
    : girvi.customerName ?? ''

  const customerPhone = customer?.phone ?? girvi.customerPhone ?? ''
  const customerEmail = customer?.email ?? girvi.customerEmail ?? ''

  // Items map karo
const items: GirviItemFormData[] = (girvi.items ?? []).map((item: any) => ({
  _id:            item._id?.toString(),
    itemName:       item.itemName       ?? '',
    itemType:       item.itemType       ?? 'gold',
    description:    item.description    ?? '',
    quantity:       item.quantity       ?? 1,
    grossWeight:    item.grossWeight    ?? 0,
    lessWeight:     item.lessWeight     ?? 0,
    netWeight:      item.netWeight      ?? 0,
    tunch:          item.tunch          ?? undefined,
    purity:         item.purity         ?? '',
    ratePerGram:    item.ratePerGram    ?? undefined,
    approxValue:    item.approxValue    ?? undefined,
    userGivenValue: item.userGivenValue ?? undefined,
    finalValue:     item.finalValue     ?? item.approxValue ?? 0,
    condition:      item.condition      ?? 'good',
  }))

return {
    // Customer
    customerId,
    customerName,
    customerPhone,
    customerEmail,
    _customerMeta: customer ? {
      customerCode: customer.customerCode,
      relationType: customer.relationType,
      relationName: customer.relationName,
      jaati:        customer.jaati,
      address:      customer.address,
    } : undefined,

    // Items
    items: items.length > 0
      ? items
      : [{ itemName: '', itemType: 'gold', quantity: 1, grossWeight: '' as any, lessWeight: 0, condition: 'good' }],

    // Dates
    girviDate:      girvi.girviDate
      ? new Date(girvi.girviDate).toISOString()
      : new Date().toISOString(),
    dueDate:        girvi.dueDate
      ? new Date(girvi.dueDate).toISOString()
      : undefined,
    gracePeriodDays: girvi.gracePeriodDays ?? 0,

    // Financial
    principalAmount:  girvi.principalAmount  ?? '',
    loanToValueRatio: girvi.loanToValueRatio ?? undefined,
    interestRate:     girvi.interestRate     ?? '',
    interestType:     girvi.interestType     ?? 'simple',
    calculationBasis: girvi.calculationBasis ?? 'monthly',

    // Payment
    paymentMode:          girvi.paymentMode          ?? 'cash',
    transactionReference: girvi.transactionReference ?? '',

    // Additional
    girviSlipNumber: girvi.girviSlipNumber ?? '',
    witnessName:     girvi.witnessName     ?? '',
    notes:           girvi.notes           ?? '',
    internalNotes:   girvi.internalNotes   ?? '',
  }
}