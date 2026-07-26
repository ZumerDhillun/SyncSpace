import { Router } from 'express'
import * as ctrl from '../controllers/rooms.controller'
import { protect } from '../middleware/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

router.use(protect)
router.post('/create', asyncHandler(ctrl.createRoom))
router.get('/my-rooms', asyncHandler(ctrl.myRooms))
router.get('/:roomId', asyncHandler(ctrl.getRoom))
router.post('/:roomId/join', asyncHandler(ctrl.joinRoom))
router.post('/:roomId/leave', asyncHandler(ctrl.leaveRoom))
router.post('/:roomId/close', asyncHandler(ctrl.closeRoom))
router.delete('/:roomId', asyncHandler(ctrl.deleteRoom))

export default router
