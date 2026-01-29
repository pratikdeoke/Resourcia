import { z } from 'zod'

export const createOrgSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    domain: z.string().optional(),
    timezone: z.string().min(1)
  })
})

export const updateOrgSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    domain: z.string().optional(),
    timezone: z.string().optional(),
    google_calendar_id: z.string().optional()
  })
})

export const orgIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
})
