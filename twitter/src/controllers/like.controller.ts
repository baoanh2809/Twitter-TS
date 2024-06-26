import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '@/models/requests/User.requests'
import likeService from '@/services/likes.services'
import { LikeTweetReqBody } from '@/models/requests/Like.Requests'

export const likeTweetController = async (req: Request<ParamsDictionary, any, LikeTweetReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeService.likeTweet(user_id, req.body.tweet_id)
  return res.json({
    message: 'Tweet likeed successfully',
    result
  })
}

export const unlikeTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeService.unlikeTweet(user_id, req.params.tweet_id)
  return res.json({
    message: 'Tweet unlikeed successfully',
    result
  })
}
