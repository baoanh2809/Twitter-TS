import { createTweetController } from '@/controllers/tweet.controllers'
import { accessTokenValidator, verifiedUserValidator } from '@/middlewares/users.middlewares'
import { wrapRequestHandler } from '@/utils/handlers'
import { tweetIdValidator, tweetValidate } from '@/middlewares/tweets.middlewares'
import { Router } from 'express'
import { likeTweetController, unlikeTweetController } from '@/controllers/like.controller'

const likeRouter = Router()

likeRouter.post(
  '',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(likeTweetController)
)
likeRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unlikeTweetController)
)

export default likeRouter
