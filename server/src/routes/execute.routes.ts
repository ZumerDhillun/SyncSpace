import { Router } from 'express'
import { execute } from '../controllers/execute.controller'
import { protect } from '../middleware/auth.middleware'
import { executeRateLimiter } from '../middleware/rateLimit.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()
router.post('/', protect, executeRateLimiter, asyncHandler(execute))

export default router
