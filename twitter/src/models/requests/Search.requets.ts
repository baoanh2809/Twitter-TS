import { MediaQuery, PeopleFollow } from '@/constants/enums'
import { Pagination } from '@/models/requests/Tweet.requests'
import { Query } from 'express-serve-static-core';

export interface SearchQuery extends Pagination, Query {
  content: string
  media_type?: MediaQuery
  people_follow?: PeopleFollow
}
