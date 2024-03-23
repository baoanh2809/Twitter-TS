import { createTweetController } from '@/controllers/tweet.controllers'
import { accessTokenValidator, verifiedUserValidator } from '@/middlewares/users.middlewares'
import { wrapRequestHandler } from '@/utils/handlers'
import { tweetIdValidator, tweetValidate } from '@/middlewares/tweets.middlewares'
import { Router } from 'express'
import { likeTweetController, unlikeTweetController } from '@/controllers/like.controller'

const likeRouter = Router()

// Swagger Like a tweet

/**
 * @swagger
 * paths:
 *  /api/likes:
 *    post:
 *      tags:
 *        - Like
 *      summary: Like a tweet
 *      security:
 *        - BearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                tweet_id:
 *                  type: string
 *                  example: 65bce0cb8c73fe27f8df3a88
 *                  description: Tweet ID
 *      responses:
 *        '200':
 *           description: Like a tweet
 *           content:
 *             application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Tweet likeed successfully
 *                  result:
 *                    $ref: '#/components/schemas/LikeTweetSuccess'
 *        '400':
 *           description: Invalid tweet id
 * components:
 *    schemas:
 *      TweetSuccess:
 *         type: object
 *         properties:
 *            _id:
 *              type: string
 *              format: ObjectId
 *              example: 65fa8c378ab76d93d3877071
 *            tweet_id:
 *              type: string
 *              format: ObjectId
 *              example: 65d707ec9381ca60a5756fe1
 *            user_id:
 *              type: string
 *              format: ObjectId
 *              example: 65d9a97ed5fdd26fc42ebe3f
 *            createdAt:
 *              type: ISO8601
 *              example: 2022-02-24T08:31:59.006Z
 */

likeRouter.post(
  '',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(likeTweetController)
)

/**
 * @swagger
 * paths:
 *    /api/likes/tweets/{tweet_id}:
 *     delete:
 *      tags:
 *       - Like
 *      summary: Delete Like Tweet
 *      description: Delete Like Tweet
 *      operationId: Delete Like Tweet
 *      security:
 *        - BearerAuth: []
 *      parameters:
 *        - in: path
 *          name: tweet_id
 *          required: true
 *          description: Tweet ID
 *      schema:
 *        type: string
 *      responses:
 *         '200':
 *           description: Delete Like Tweet Success
 *           content:
 *             application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      example: "Unlike Tweet successfully"
 */

likeRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unlikeTweetController)
)

export default likeRouter
