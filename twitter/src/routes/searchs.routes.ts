import { Router } from 'express'
import { searchController } from '@/controllers/search.controllers'
import { accessTokenValidator, verifiedUserValidator } from '@/middlewares/users.middlewares'
import { searchValidator } from '@/middlewares/search.middlewares'
import { paginationValidator } from '@/middlewares/tweets.middlewares'
const searchRouter = Router()

/**
 * @swagger
 * paths:
 *    /api/search:
 *      get:
 *        tags:
 *          - Search
 *        summary: Search Tweets
 *        description: Search Tweets
 *        security:
 *          - BearerAuth: []
 *        parameters:
 *          - in: query
 *            name: content
 *            description: content to search
 *            required: true
 *            schema:
 *              type: string
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
 *          - in: query
 *            name: media_type
 *            required: false
 *            description: media type to search (image or video)
 *            schema:
 *              type: string
 *              example: image
 *          - in: query
 *            name: people_follow
 *            required: false
 *            default: 0
 *            description: Set 1 to get tweets from people you follow or 0 to get all tweets
 *            schema:
 *              type: integer
 *              default: 1
 *        responses:
 *            '200':
 *              description: Get New Feeds successfully
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      message:
 *                          type: string
 *                          example: "Get New Feeds Successfully"
 *                      result:
 *                          type: object
 *                          properties:
 *                            tweets:
 *                              $ref: "#/components/schemas/GetNewFeeds"
 *                            limit:
 *                              type: integer
 *                              example: 10
 *                            page:
 *                              type: integer
 *                              example: 1
 *                            total_page:
 *                              type: integer
 *                              example: 1
 *            '404':
 *              description: Tweet not found
 */

searchRouter.get(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  searchValidator,
  paginationValidator,
  searchController
)

export default searchRouter
