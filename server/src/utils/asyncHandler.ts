import { Request, Response, NextFunction, RequestHandler } from 'express'

// Express 4 doesn't auto-catch rejected promises from async handlers — this
// wrapper forwards any thrown/rejected error to the errorHandler middleware.
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
