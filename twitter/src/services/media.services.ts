import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '@/constants/dir'
import { handleUploadImage, getNameFromFullName, handleUploadVideo, getFiles } from '../utils/file'
import { Request } from 'express'
import sharp from 'sharp'
import fspromises from 'fs/promises'
import { isProduction } from '@/constants/config'
import { uploadFileToS3 } from '@/utils/s3'
import path from 'path'
import { EncodingStatus, MediaType } from '@/constants/enums'
import { Media } from '@/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '@/utils/videos'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import databaseService from '@/services/database.services'
import VideoStatus from '@/models/schemas/videosStatus.Schema'
import mime from 'mime-types'
import { rimrafSync } from 'rimraf'
class Queue {
  items: string[]
  encodeing: boolean
  constructor() {
    this.items = []
    this.encodeing = false
  }
  async enqueue(item: string) {
    this.items.push(item)
    const idName = path.basename(path.dirname(item))
    await databaseService.videoStatus.insertOne(new VideoStatus({ name: idName, status: EncodingStatus.Pending }))
    this.processEncode()
  }
  async processEncode() {
    if (this.encodeing) return
    if (this.items.length > 0) {
      this.encodeing = true
      const videoPath = this.items[0]
      const idName = path.basename(path.dirname(videoPath))
      console.log(idName)
      await databaseService.videoStatus.updateOne(
        {
          name: idName
        },
        {
          $set: {
            status: EncodingStatus.Processing
          },
          $currentDate: {
            updatedAt: true
          }
        }
      )
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        const files = getFiles(path.resolve(UPLOAD_VIDEO_DIR, idName))
        await Promise.all(
          files.map((filepath) => {
            const fileName = 'video-hls' + filepath.replace(path.resolve(UPLOAD_VIDEO_DIR), '').replace(/\\/g, '/')
            return uploadFileToS3({
              filename: fileName,
              filepath: filepath,
              contentType: mime.lookup(filepath) as string
            })
          })
        )
        rimrafSync(path.resolve(UPLOAD_VIDEO_DIR, idName))
        await databaseService.videoStatus.updateOne(
          {
            name: idName
          },
          {
            $set: {
              status: EncodingStatus.Success
            },
            $currentDate: {
              updatedAt: true
            }
          }
        )
        console.log('Encode success')
      } catch (e) {
        console.log(`Encode ${videoPath} failed`)
        await databaseService.videoStatus
          .updateOne(
            {
              name: idName
            },
            {
              $set: {
                status: EncodingStatus.Failed
              },
              $currentDate: {
                updatedAt: true
              }
            }
          )
          .catch((err) => {
            console.error('Update status failed', err)
          })
        console.error(e)
      }
      this.encodeing = false
      this.processEncode()
    } else {
      console.log('Encode video queue is empty')
    }
  }
}

const queue = new Queue()

class MediaService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (item) => {
        const newName = getNameFromFullName(item.newFilename)
        const newFullName = `${newName}.jpeg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullName)
        await sharp(item.filepath).jpeg().toFile(newPath)
        const s3Result = await uploadFileToS3({
          filename: 'images/' + newFullName,
          filepath: newPath,
          contentType: this.getContentType(newPath)
        })
        await fspromises.unlink(newPath)
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (item) => {
        const s3Result = await uploadFileToS3({
          filename: 'videos/' + item.newFilename,
          filepath: item.filepath,
          contentType: 'video/mp4'
        })
        fspromises.unlink(item.filepath)
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Video
        }
      })
    )
    return result
  }

  async uploadVideoHLS(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (item) => {
        const newName = getNameFromFullName(item.newFilename)
        queue.enqueue(item.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/api/static/video-hls/${newName}/master.m3u8`
            : `http://localhost:${process.env.PORT}/api/static/video-hls/${newName}/master.m3u8`,
          type: MediaType.HLS
        }
      })
    )
    return result
  }

  async getVideoStatus(id: string) {
    const videoStatus = await databaseService.videoStatus.findOne({ name: id })
    return videoStatus
  }

  getContentType(filePath: string): string {
    const extension = path.extname(filePath).toLowerCase()
    switch (extension) {
      case '.jpeg':
      case '.jpg':
        return 'image/jpeg'
      case '.png':
        return 'image/png'
      default:
        return 'application/octet-stream'
    }
  }
}

const mediasService = new MediaService()

export default mediasService
