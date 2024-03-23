import { TweetAudience, TweetType } from '@/constants/enums'
import { Media } from '@/models/Other'
import { ParamsDictionary, Query } from 'express-serve-static-core'

/**
 * @swagger
 * components:
 *  schemas:
 *    Audience:
 *      type: number
 *      enum: [Everyone, TwitterCircle]
 *    Type:
 *      type: number
 *      enum: [Tweet, ReTweet, Comment, QuoteTweet]
 *    TweetBody:
 *      type: object
 *      properties:
 *        audience:
 *          $ref: '#/components/schemas/Audience'
 *        type:
 *          description: 'Có thể có hoặc không'
 *          $ref: '#/components/schemas/Type'
 *        content:
 *          type: string
 *          example: 'This is a tweet'
 *        medias:
 *          type: array
 *          fileName:
 *            type: string
 *            format: binary
 *        parent_id:
 *          type: string
 *          description: 'Có thể có hoặc không'
 *          example: '60f3e3e3e3e3e3e3e3e3e3e3'
 *        hashtags:
 *          type: string
 *          example: '["#hashtag1", "#hashtag2"]'
 *        mentions:
 *          type: string
 *          example: ["65d706996f69b097964def81", "65d706996f69b012353dek32"]
 *    PostTweetSucess:
 *      type: object
 *      properties:
 *        _id:
 *           type: string
 *           format: MongoID
 *           example: '65fada2481786c414cb45039'
 *        user_id:
 *           type: string
 *           format: MongoID
 *           example: '65fada2481786c414cb45039'
 *        audience:
 *           $ref: '#/components/schemas/Audience'
 *        type:
 *           $ref: '#/components/schemas/Type'
 *        content:
 *           type: string
 *           example: 'This is a tweet'
 *        medias:
 *           $ref: '#/components/schemas/MediaImageResult'
 *        parent_id:
 *           type: string
 *           example: '60f3e3e3e3e3e3e3e3e3e3e3'
 *        hashtags:
 *           type: string
 *           example: '["#hashtag1", "#hashtag2"]'
 *        mentions:
 *           type: string
 *           example: ["65d706996f69b097964def81", "65d706996f69b012353dek32"]
 *        guest_views:
 *           type: number
 *           example: 25
 *        user_views:
 *           type: number
 *           example: 20
 *        updated_at:
 *           type: ISO8601
 *           example: '2021-08-20T07:00:00.000Z'
 *        created_at:
 *          type: ISO8601
 *          example: '2021-07-20T07:00:00.000Z'
 *    GetTweetSucess:
 *      type: object
 *      properties:
 *        _id:
 *           type: string
 *           format: MongoID
 *           example: '65fada2481786c414cb45039'
 *        user_id:
 *           type: string
 *           format: MongoID
 *           example: '65fada2481786c414cb45039'
 *        audience:
 *           $ref: '#/components/schemas/Audience'
 *        type:
 *           $ref: '#/components/schemas/Type'
 *        content:
 *           type: string
 *           example: 'This is a tweet'
 *        medias:
 *           $ref: '#/components/schemas/MediaImageResult'
 *        parent_id:
 *           type: string
 *           example: '60f3e3e3e3e3e3e3e3e3e3e3'
 *        hashtags:
 *           type: string
 *           example: '["#hashtag1", "#hashtag2"]'
 *        mentions:
 *           type: string
 *           example: ["65d706996f69b097964def81", "65d706996f69b012353dek32"]
 *        guest_views:
 *           type: number
 *           example: 25
 *        user_views:
 *           type: number
 *           example: 20
 *        updated_at:
 *           type: ISO8601
 *           example: '2021-08-20T07:00:00.000Z'
 *        created_at:
 *          type: ISO8601
 *          example: '2021-07-20T07:00:00.000Z'
 *        bookmarks:
 *          type: number
 *          example: 10
 *        like:
 *          type: number
 *          example: 20
 *        retweet_count:
 *          type: number
 *          example: 30
 *        comments_count:
 *          type: number
 *          example: 40
 *        quote_count:
 *          type: number
 *          example: 50
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     GetNewFeeds:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65d982cf5df95b3ba0df941f
 *         user_id:
 *           type: string
 *           example: 65d982ce5df95b3ba0df9401
 *         type:
 *           type: integer
 *           example: 0
 *         content:
 *           type: string
 *           example: Cariosus averto modi sponte acidus...
 *         audience:
 *           type: integer
 *           example: 0
 *         parent_id:
 *           type: string
 *           example: 65d982cf5df95b3ba0df9410
 *         hashtags:
 *           type: string
 *           example: ["#hashtag1", "#hashtag2"]
 *         mentions:
 *           type: string
 *           example: ["65d706996f69b097964def81"]
 *         medias:
 *           type: string[]
 *           example: [{type:0 , url: "https://loremflickr.com/640/480"}]
 *         guest_views:
 *           type: integer
 *           example: 25
 *         user_views:
 *           type: integer
 *           example: 30
 *         created_at:
 *           type: ISO8601
 *           example: 2021-07-20T07:00:00.000Z
 *         updated_at:
 *           type: ISO8601
 *           example: 2021-07-20T07:00:00.000Z
 *         user:
 *           $ref: '#/components/schemas/UserProfile'
 */
export interface TweetRequestBody {
  audience: TweetAudience
  content: string
  medias: Media[]
  parent_id?: any
  hashtags: string[]
  mentions: string[]
  type?: TweetType
}

export interface TweetParam extends ParamsDictionary {
  tweet_id: string
}

export interface TweetQuery extends Pagination, Query {
  tweet_type: string
}

/**
 * @swagger
 * components:
 *    schemas:
 *      Pagination:
 *        type: object
 *        properties:
 *          limit:
 *            type: string
 *            example: '10'
 *          page:
 *            type: string
 *            example: '1'
 */

export interface Pagination {
  limit: string
  page: string
}
