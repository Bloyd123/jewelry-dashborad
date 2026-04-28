// FILE: src/types/bugReport.types.ts

export type BugCategory =
  | 'ui'
  | 'functional'
  | 'performance'
  | 'data'
  | 'crash'
  | 'security'
  | 'other'

export type BugSeverity = 'critical' | 'high' | 'medium' | 'low'

export type BugPriority = 'urgent' | 'high' | 'normal' | 'low'

export interface BugScreenshot {
  url: string
  caption?: string
}

export interface BugReport {
  _id: string
  ticketNumber: string
  title: string
  description: string
  category: BugCategory
  severity: BugSeverity
  priority: BugPriority
  stepsToReproduce?: string
  expectedBehavior?: string
  actualBehavior?: string
  pageUrl?: string
  moduleName?: string
  appVersion?: string
  screenshots?: BugScreenshot[]
  reportedBy?: string | null
  reporterName: string
  reporterEmail?: string
  reporterRole?: string
  organizationId?: string | null
  shopId?: string | null
  telegramSent?: boolean
  emailSent?: boolean
  notifiedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBugReportInput {
  title: string
  description: string
  category?: string
  severity?: string
  priority?: string
  stepsToReproduce?: string
  expectedBehavior?: string
  actualBehavior?: string
  pageUrl?: string
  moduleName?: string
  appVersion?: string
  reporterName?: string
  reporterEmail?: string
  reporterRole?: string
  screenshots?: {           // 👈 yeh add hua
    url: string
    filename: string
    fileId: string
  }[]
}

export interface CreateBugReportResponse {
  success: boolean
  message: string
  data: {
    bug: BugReport
  }
}