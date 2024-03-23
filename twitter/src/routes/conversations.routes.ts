import { Router } from 'express'
import { getConversationsController } from '../controllers/conversation.controller'
import { accessTokenValidator, getConversationsValidator, verifiedUserValidator } from '@/middlewares/users.middlewares'
import { paginationValidator } from '@/middlewares/tweets.middlewares'
import { wrapRequestHandler } from '@/utils/handlers'

const conversationsRouter = Router()

/**
 * @swagger
 * paths:
 *    /api/conversations/receivers/{receiver_id}:
 *       get:
 *          tags:
 *            - Conversations
 *          summary: Get Conversations
 *          description: Get Conversations
 *          parameters:
 *            - in: path
 *              name: receiver_id
 *              required: true
 *              description: receiver_id
 *              schema:
 *                type: string
 *            - in: query
 *              name: page
 *              required: false
 *              description: Page number for paginated results
 *              schema:
 *                type: integer
 *                default: 1
 *            - in: query
 *              name: limit
 *              required: false
 *              description: Maximum number of tweets to return per page
 *              schema:
 *                type: integer
 *                default: 10
 *          security:
 *            - BearerAuth: []
 *          responses:
 *              '200':
 *                description: Get Conversations successfully
 *                content:
 *                  application/json:
 *                    schema:
 *                      type: object
 *                      properties:
 *                        message:
 *                          type: string
 *                          example: "Get Conversations successfully"
 *                        result:
 *                          type: object
 *                          properties:
 *                            conversations:
 *                              $ref: "#/components/schemas/Conversations"
 *                            limit:
 *                              type: integer
 *                              example: 10
 *                            page:
 *                              type: integer
 *                              example: 1
 *                            total_page:
 *                              type: integer
 *                              example: 1
 *              '404':
 *                description: No Conversations found
 */

conversationsRouter.get(
  '/receivers/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  getConversationsValidator,
  wrapRequestHandler(getConversationsController)
)

export default conversationsRouter
