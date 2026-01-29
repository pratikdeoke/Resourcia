import { z } from 'zod'

export const createResourceSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    capacity: z.number().int().min(0).optional(),
    location: z.string().optional(),
    is_active: z.boolean().optional()
  })
})

export const updateResourceSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    type: z.string().min(1).optional(),
    capacity: z.number().int().min(0).optional(),
    location: z.string().optional(),
    is_active: z.boolean().optional()
  })
})

export const resourceIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
})
