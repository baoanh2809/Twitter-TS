import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '@/models/requests/User.requests'
import bookmarkService from '@/services/bookmarks.services'
import { BookmarkTweetReqBody } from '@/models/requests/BookMark.requets'

export const bookMarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.bookMarkTweet(user_id, req.body.tweet_id)
  return res.json({
    message: 'Tweet bookmarked successfully',
    result
  })
}

export const unBookMarkTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.unBookMarkTweet(user_id, req.params.tweet_id)
  return res.json({
    message: 'Tweet unbookmarked successfully',
    result
  })
}
