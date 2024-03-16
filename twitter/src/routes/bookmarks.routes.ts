import { createTweetController } from '@/controllers/tweet.controllers'
import { accessTokenValidator, verifiedUserValidator } from '@/middlewares/users.middlewares'
import { wrapRequestHandler } from '@/utils/handlers'
import { tweetIdValidator, tweetValidate } from '@/middlewares/tweets.middlewares'
import { Router } from 'express'
import { bookMarkTweetController, unBookMarkTweetController } from '@/controllers/bookmark.controllers'

const bookMarkRouter = Router()

bookMarkRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(bookMarkTweetController)
)
bookMarkRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unBookMarkTweetController)
)

export default bookMarkRouter
