import { Router } from 'express'
import * as ctrl from '../controllers/history.controller'
import { protect } from '../middleware/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()
router.use(protect)
router.get('/', asyncHandler(ctrl.listHistory))
router.get('/:roomId', asyncHandler(ctrl.getHistoryDetail))

export default router
