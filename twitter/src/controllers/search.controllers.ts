import { MediaQuery } from '@/constants/enums'
import { SearchQuery } from '@/models/requests/Search.requets'
import { TokenPayload } from '@/models/requests/User.requests'
import searchService from '@/services/search.services'
import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export const searchController = async (
  req: Request<ParamsDictionary, any, any, SearchQuery>,
  res: Response,
  next: NextFunction
) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  // const { user_id } = req.decoded_authorization as TokenPayload
  const result = await searchService.search({
    content: req.query.content as string,
    limit,
    page,
    media_type: req.query.media_type as MediaQuery,
    people_follow: req.query.people_follow,
    user_id: req.decoded_authorization?.user_id as string
  })
  res.json({
    message: 'Search success',
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
