import { Router } from 'express'
import { getConversationsController } from '../controllers/conversation.controller'
import { accessTokenValidator, getConversationsValidator, verifiedUserValidator } from '@/middlewares/users.middlewares'
import { paginationValidator } from '@/middlewares/tweets.middlewares'
import { wrapRequestHandler } from '@/utils/handlers'

const conversationsRouter = Router()

conversationsRouter.get(
  '/receivers/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  getConversationsValidator,
  wrapRequestHandler(getConversationsController)
)

export default conversationsRouter
