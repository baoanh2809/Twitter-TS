import { createTweetController } from '@/controllers/tweet.controllers'
import { accessTokenValidator, verifiedUserValidator } from '@/middlewares/users.middlewares'
import { wrapRequestHandler } from '@/utils/handlers'
import { tweetIdValidator, tweetValidate } from '@/middlewares/tweets.middlewares'
import { Router } from 'express'
import { bookMarkTweetController, unBookMarkTweetController } from '@/controllers/bookmark.controllers'

const bookMarkRouter = Router()

/**
 * @swagger
 * paths:
 *  /api/bookmarks:
 *    post:
 *      tags:
 *        - BookMark
 *      summary: Bookmarked a tweet
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
 *           description: bookmarks a tweet
 *           content:
 *             application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Tweet bookmarked successfully
 *                  result:
 *                    $ref: '#/components/schemas/TweetSuccess'
 *        '400':
 *           description: Invalid tweet id
 */

bookMarkRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(bookMarkTweetController)
)

/**
 * @swagger
 * paths:
 *    /api/bookmarks/tweets/{tweet_id}:
 *     delete:
 *      tags:
 *       - BookMark
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
 *           description: Delete BookMark Tweet Success
 *           content:
 *             application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      example: "UnBookMark Tweet successfully"
 */

bookMarkRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unBookMarkTweetController)
)

export default bookMarkRouter
