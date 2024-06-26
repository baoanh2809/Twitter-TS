import { Pagination, TweetParam, TweetQuery, TweetRequestBody } from '@/models/requests/Tweet.requests'
import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import tweetService from '@/services/tweets.services'
import { TokenPayload } from '@/models/requests/User.requests'
import databaseService from '@/services/database.services'
import { ObjectId } from 'mongodb'
import { TweetType } from '@/constants/enums'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetService.createTweet(user_id, req.body)
  return res.json({
    message: 'Tweet created successfully',
    result
  })
}

export const getTweetController = async (req: Request, res: Response) => {
  const result = await tweetService.increaseViewCount(req.params.tweet_id, req.decoded_authorization?.user_id)
  const tweet = {
    ...req.tweet,
    guest_views: result.guest_views,
    user_views: result.user_views,
    updated_at: result.updated_at
  }
  return res.json({
    message: 'get Tweet successfully',
    result: tweet
  })
}

export const getTweetChildrenController = async (req: Request<TweetParam, any, any, TweetQuery>, res: Response) => {
  const tweet_type = Number(req.query.tweet_type as string) as TweetType
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const { user_id } = req.decoded_authorization as TokenPayload
  const { total, tweets } = await tweetService.getTweetChildren({
    tweet_id: req.params.tweet_id,
    tweet_type,
    limit,
    page,
    user_id
  })
  return res.json({
    message: 'get Tweet children successfully',
    result: {
      tweets: tweets,
      tweet_type,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}

export const getNewFeedsController = async (req: Request<ParamsDictionary, any, any, Pagination>, res: Response) => {
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetService.getNewFeeds({
    user_id,
    limit,
    page
  })
  return res.json({
    message: 'get new feeds successfully',
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
