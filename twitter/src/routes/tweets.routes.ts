import {
  createTweetController,
  getTweetController,
  getTweetChildrenController,
  getNewFeedsController
} from '@/controllers/tweet.controllers'
import { accessTokenValidator, isUserLoggedInValidator, verifiedUserValidator } from '@/middlewares/users.middlewares'
import { wrapRequestHandler } from '@/utils/handlers'
import {
  audienceValidator,
  getTweetChildrenValidator,
  paginationValidator,
  tweetIdValidator,
  tweetValidate
} from '@/middlewares/tweets.middlewares'
import { Router } from 'express'

const tweetRouter = Router()

/**
 * @swagger
 * paths:
 *    /api/tweets:
 *      post:
 *        tags:
 *          - Tweets
 *        summary: Create a new tweet
 *        description: Create a new tweet
 *        security:
 *          - BearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TweetBody'
 *        responses:
 *          '200':
 *            description: Create Tweet Success
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                     message:
 *                        type: string
 *                        example: "Tweet created successfully"
 *                     result:
 *                        $ref: "#/components/schemas/PostTweetSucess"
 *      get:
 *        tags:
 *        - Tweets
 *        summary: Get New Feeds
 *        description: Get New Feeds
 *        security:
 *          - BearerAuth: []
 *        parameters:
 *          - in: query
 *            name: page
 *            required: false
 *            description: Page number for paginated results
 *            schema:
 *              type: integer
 *          - in: query
 *            name: limit
 *            required: false
 *            description: Maximum number of tweets to return per page
 *            schema:
 *              type: integer
 *              default: 10
 *        responses:
 *          '200':
 *            description: Get New Feeds successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                     message:
 *                        type: string
 *                        example: "Get New Feeds Successfully"
 *                     result:
 *                        type: object
 *                        properties:
 *                          tweets:
 *                            $ref: "#/components/schemas/GetTweetSucess"
 *                          limit:
 *                            type: integer
 *                            example: 10
 *                          page:
 *                            type: integer
 *                            example: 1
 *                          total_page:
 *                            type: integer
 *                            example: 1
 *          '404':
 *            description: Tweet not found
 */

tweetRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetValidate,
  wrapRequestHandler(createTweetController)
)

/**
 * @swagger
 * paths:
 *    /api/tweets/{tweet_id}:
 *      get:
 *        tags:
 *          - Tweets
 *        summary: Get Tweet
 *        description: Get Tweet
 *        security:
 *          - BearerAuth: []
 *        parameters:
 *          - name: tweet_id
 *            in: path
 *            description: ID of Tweet that needs to be fetched
 *            required: true
 *            schema:
 *              type: string
 *              format: MongoId
 *        responses:
 *          '200':
 *            description: Get Tweet Success
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                     message:
 *                        type: string
 *                        example: "Get Tweet successfully"
 *                     result:
 *                        $ref: "#/components/schemas/GetTweetSucess"
 *          '404':
 *            description: Tweet not public
 */

tweetRouter.get(
  '/:tweet_id',
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetController)
)

/**
 * @swagger
 * paths:
 *    /api/tweets/{tweet_id}/children:
 *      get:
 *        tags:
 *          - Tweets
 *        summary: Get Tweet
 *        description: Get Tweet
 *        security:
 *          - BearerAuth: []
 *        parameters:
 *          - name: tweet_id
 *            in: path
 *            description: ID of Tweet that needs to be fetched
 *            required: true
 *            schema:
 *              type: string
 *              format: MongoId
 *          - in: query
 *            name: page
 *            required: false
 *            description: Page number for paginated results
 *            schema:
 *              type: integer
 *              default: 1
 *          - in: query
 *            name: limit
 *            required: false
 *            description: Maximum number of tweets to return per page
 *            schema:
 *              type: integer
 *              default: 10
 *          - in: query
 *            name: tweet_type
 *            required: true
 *            description: Type of tweet
 *            schema:
 *              type: integer
 *              default: 3
 *        responses:
 *          '200':
 *            description: get Tweet children successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                     message:
 *                        type: string
 *                        example: "get Tweet Children Successfully"
 *                     result:
 *                        type: object
 *                        properties:
 *                          tweets:
 *                            $ref: "#/components/schemas/GetTweetSucess"
 *                          tweet_type:
 *                            $ref: "#/components/schemas/Type"
 *                          limit:
 *                            type: integer
 *                            example: 10
 *                          page:
 *                            type: integer
 *                            example: 1
 *                          total_page:
 *                            type: integer
 *                            example: 1
 *          '404':
 *            description: Tweet not found
 */

tweetRouter.get(
  '/:tweet_id/children',
  tweetIdValidator,
  paginationValidator,
  getTweetChildrenValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetChildrenController)
)

tweetRouter.get(
  '/',
  paginationValidator,
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getNewFeedsController)
)

export default tweetRouter
