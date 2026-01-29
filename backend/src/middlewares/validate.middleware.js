import { ZodError } from 'zod'

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      })
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: err.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message
          }))
        })
      }

      console.error(err)
      return res.status(400).json({
        success: false,
        message: err.message || 'Validation error'
      })
    }
  }
}