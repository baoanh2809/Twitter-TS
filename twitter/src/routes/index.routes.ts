import express, { Application, Router } from 'express'
import pathsRoutes from '@/constants/paths'
import { UPLOAD_VIDEO_DIR } from '@/constants/dir'
export function routes(app: Application): void {
  const apiV1Router = Router()
  apiV1Router.use(pathsRoutes.user.root, pathsRoutes.user.routes)
  apiV1Router.use(pathsRoutes.oauth.root, pathsRoutes.oauth.routes)
  apiV1Router.use(pathsRoutes.media.root, pathsRoutes.media.routes)
  apiV1Router.use(pathsRoutes.static.root, pathsRoutes.static.routes)
  apiV1Router.use(pathsRoutes.tweet.root, pathsRoutes.tweet.routes)
  apiV1Router.use(pathsRoutes.bookmark.root, pathsRoutes.bookmark.routes)
  apiV1Router.use(pathsRoutes.like.root, pathsRoutes.like.routes)
  apiV1Router.use(pathsRoutes.search.root, pathsRoutes.search.routes)
  apiV1Router.use(pathsRoutes.conversation.root, pathsRoutes.conversation.routes)
  apiV1Router.use('/static/video', express.static(UPLOAD_VIDEO_DIR))
  app.use('/api', apiV1Router)
}
