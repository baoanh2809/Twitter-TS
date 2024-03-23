import { MediaQuery, PeopleFollow } from '@/constants/enums'
import { Pagination } from '@/models/requests/Tweet.requests'
import { Query } from 'express-serve-static-core'

/**
 * @swagger
 * components:
 *     schemas:
 *        PeopleFollow:
 *           type: number
 *           enum: [Anyone, Following]
 *           example: 1
 *        MediaType:
 *           type: number
 *           enum: [Image, Video, HLS]
 *           example: 1
 */
export interface SearchQuery extends Pagination, Query {
  content: string
  media_type?: MediaQuery
  people_follow?: PeopleFollow
}
