import usersRouter from '@/routes/users.routes'
import oAuthRouter from '@/routes/oauths.routes'
import mediaRouter from '@/routes/media.routes'
import staticRouter from '@/routes/static.routes'
import tweetRouter from '@/routes/tweets.routes'
import bookMarkRouter from '@/routes/bookmarks.routes'
import likeRouter from '@/routes/likes.routes'
import searchRouter from '@/routes/searchs.routes'
import conversationsRouter from '@/routes/conversations.routes'
export const pathsRoutes = {
  user: {
    root: '/users',
    routes: usersRouter
  },
  oauth: {
    root: '/',
    routes: oAuthRouter
  },
  media: {
    root: '/medias',
    routes: mediaRouter
  },
  static: {
    root: '/static',
    routes: staticRouter
  },
  tweet: {
    root: '/tweets',
    routes: tweetRouter
  },
  bookmark: {
    root: '/bookmarks',
    routes: bookMarkRouter
  },
  like: {
    root: '/likes',
    routes: likeRouter
  },
  search: {
    root: '/search',
    routes: searchRouter
  },
  conversation: {
    root: '/conversations',
    routes: conversationsRouter
  }
}

export default pathsRoutes
