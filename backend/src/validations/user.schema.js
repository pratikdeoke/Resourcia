import { z } from 'zod'

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
})
