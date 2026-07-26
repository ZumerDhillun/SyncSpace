import { Router } from 'express'
import { hint } from '../controllers/ai.controller'
import { protect } from '../middleware/auth.middleware'
import { hintRateLimiter } from '../middleware/rateLimit.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()
router.post('/hint', protect, hintRateLimiter, asyncHandler(hint))

export default router
