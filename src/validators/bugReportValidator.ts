// FILE: src/validators/bugReportValidator.ts

import { z } from 'zod'

export const bugReportSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .max(200, 'validation.maxLength200'),

  description: z
    .string()
    .trim()
    .min(1, 'validation.required')
    .max(5000, 'validation.maxLength5000'),

  category: z
    .enum(['ui', 'functional', 'performance', 'data', 'crash', 'security', 'other'])
    .optional(),

  severity: z
    .enum(['critical', 'high', 'medium', 'low'])
    .optional(),

  priority: z
    .enum(['urgent', 'high', 'normal', 'low'])
    .optional(),

  stepsToReproduce: z
    .string()
    .trim()
    .max(2000, 'validation.maxLength2000')
    .optional()
    .or(z.literal('')),

  expectedBehavior: z
    .string()
    .trim()
    .max(1000, 'validation.maxLength1000')
    .optional()
    .or(z.literal('')),

  actualBehavior: z
    .string()
    .trim()
    .max(1000, 'validation.maxLength1000')
    .optional()
    .or(z.literal('')),

  pageUrl: z.string().trim().optional().or(z.literal('')),

  moduleName: z.string().trim().optional().or(z.literal('')),

  appVersion: z.string().trim().optional().or(z.literal('')),

  reporterName: z.string().trim().optional(),

  reporterEmail: z
    .string()
    .trim()
    .email('validation.invalidEmail')
    .optional()
    .or(z.literal('')),

  screenshots: z
    .array(
      z.object({
        url: z.string().min(1, 'validation.required'),
        caption: z.string().optional(),
      })
    )
    .max(5, 'validation.maxScreenshots')
    .optional(),
})

export type BugReportFormData = z.infer<typeof bugReportSchema>