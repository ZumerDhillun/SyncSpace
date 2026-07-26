import { Router } from 'express'
import * as ctrl from '../controllers/auth.controller'
import { protect } from '../middleware/auth.middleware'
import { authRateLimiter } from '../middleware/rateLimit.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

router.post('/register', authRateLimiter, asyncHandler(ctrl.register))
router.post('/login', authRateLimiter, asyncHandler(ctrl.login))
router.get('/me', protect, asyncHandler(ctrl.me))
router.put('/profile', protect, asyncHandler(ctrl.updateProfile))
router.put('/password', protect, asyncHandler(ctrl.updatePassword))
router.delete('/account', protect, asyncHandler(ctrl.deleteAccount))

export default router
