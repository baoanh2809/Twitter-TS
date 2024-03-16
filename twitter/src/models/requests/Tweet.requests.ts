import { TweetAudience, TweetType } from '@/constants/enums'
import { Media } from '@/models/Other'
import { ParamsDictionary, Query } from 'express-serve-static-core'

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

export interface Pagination {
  limit: string
  page: string
}