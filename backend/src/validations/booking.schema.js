import { z } from 'zod'

const utcDateTime = z.string().refine(
  (val) => !Number.isNaN(Date.parse(val)),
  { message: 'Invalid UTC datetime format' }
)

const isFutureOrNow = (date) => {
  return new Date(date).getTime() >= Date.now()
}

export const createBookingSchema = z.object({
  body: z.object({
    resourceId: z.string().uuid(),
    title: z.string().min(1),
    description: z.string().optional(),
    startTime: utcDateTime,
    endTime: utcDateTime
  }).superRefine((data, ctx) => {
    if (!data.startTime || !data.endTime) return;

    const start = new Date(data.startTime).getTime();
    const end = new Date(data.endTime).getTime();

    if (isNaN(start) || isNaN(end)) {
      ctx.addIssue({
        path: ['startTime'],
        message: 'Invalid datetime',
        code: z.ZodIssueCode.custom
      })
      return;
    }

    if (start >= end) {
      ctx.addIssue({
        path: ['endTime'],
        message: 'startTime must be before endTime',
        code: z.ZodIssueCode.custom
      })
    }

    if (start < Date.now()) {
      ctx.addIssue({
        path: ['startTime'],
        message: 'startTime must be in the future (UTC)',
        code: z.ZodIssueCode.custom
      })
    }
  })
})


export const updateBookingSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    startTime: utcDateTime.optional(),
    endTime: utcDateTime.optional()
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return new Date(data.startTime) < new Date(data.endTime)
      }
      return true
    },
    {
      message: 'startTime must be before endTime',
      path: ['endTime']
    }
  )
  .refine(
    (data) => {
      if (data.startTime) {
        return new Date(data.startTime).getTime() >= Date.now()
      }
      return true
    },
    {
      message: 'startTime must be in the future (UTC)',
      path: ['startTime']
    }
  )
})

export const bookingIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
})

export const bookingQuerySchema = z.object({
  query: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED']).optional(),
    resourceId: z.string().uuid().optional()
  })
})
