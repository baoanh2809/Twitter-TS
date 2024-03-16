import { serveImageController, serveVideoStreamController } from '@/controllers/media.controllers'
import { Router } from 'express'

const staticRouter = Router()

staticRouter.get('/image/:name', serveImageController)
staticRouter.get('/video-stream/:name', serveVideoStreamController)
export default staticRouter
