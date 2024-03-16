import { NextFunction, Request, Response } from 'express'
import path from 'path'
import mediasService from '@/services/media.services'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '@/constants/dir'
import fs from 'fs'
import HTTP from '@/constants/httpStatus'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadImage(req)
  return res.json({
    message: 'Upload image successfully',
    result: url
  })
}

export const serveImageController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
    }
  })
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const files = await mediasService.uploadVideo(req)
  return res.json({
    message: 'Upload video successfully',
    result: files
  })
}

export const uploadVideoHLSController = async (req: Request, res: Response, next: NextFunction) => {
  const files = await mediasService.uploadVideoHLS(req)
  return res.json({
    message: 'Upload video successfully',
    result: files
  })
}

export const serveVideoStreamController = async (req: Request, res: Response, next: NextFunction) => {
  const { range } = req.headers
  if (!range) {
    return res.status(HTTP.BAD_REQUEST).send('Requires Range header')
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  const videoSize = fs.statSync(videoPath).size
  const chunkSize = 3 * 10 ** 6
  const start = Number((range as string).replace(/\D/g, ''))
  const end = Math.min(start + chunkSize, videoSize - 1)
  const contentLength = end - start + 1
  // const mime = (await import('mime')).default
  const contentType = 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end - 1}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP.PARTIAL_CONTENT, headers)
  const videoSteams = fs.createReadStream(videoPath, { start, end })
  videoSteams.pipe(res)
}
