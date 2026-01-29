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
    resource_id: z.string().uuid(),
    title: z.string().min(1),
    description: z.string().optional(),
    start_time: utcDateTime,
    end_time: utcDateTime
  })
  .refine(
    (data) => new Date(data.start_time) < new Date(data.end_time),
    {
      message: 'start_time must be before end_time',
      path: ['end_time']
    }
  )
  .refine(
    (data) => isFutureOrNow(data.start_time),
    {
      message: 'start_time must be in the future (UTC)',
      path: ['start_time']
    }
  )
})

export const updateBookingSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    start_time: utcDateTime.optional(),
    end_time: utcDateTime.optional()
  }).refine(
    (data) => {
      if (data.start_time && data.end_time) {
        return new Date(data.start_time) < new Date(data.end_time)
      }
      return true
    },
    {
      message: 'start_time must be before end_time'
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
    resource_id: z.string().uuid().optional()
  })
})
