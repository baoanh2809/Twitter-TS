import { UPLOAD_IMAGE_DIR } from '@/constants/dir'
import { handleUploadImage, getNameFromFullName, handleUploadVideo } from '../utils/file'
import { Request } from 'express'
import sharp from 'sharp'
import fspromises from 'fs/promises'
import { isProduction } from '@/constants/config'
import { uploadFileToS3 } from '@/utils/s3'
import path from 'path'
import { MediaType } from '@/constants/enums'
import { Media } from '@/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '@/utils/videos'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
class MediaService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (item) => {
        const newName = getNameFromFullName(item.newFilename)
        const newFullName = `${newName}.jpeg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpeg`)
        await sharp(item.filepath).jpeg().toFile(newPath)
        const s3Result = await uploadFileToS3({
          filename: newFullName,
          filepath: newPath,
          contentType: this.getContentType(newPath)
        })
        Promise.all([fspromises.unlink(item.filepath), fspromises.unlink(newPath)])
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
    const result: Media[] = files.map((item) => {
      return {
        url: isProduction
          ? `${process.env.HOST}/api/static/video/${item.newFilename}`
          : `http://localhost:${process.env.PORT}/api/static/video/${item.newFilename}`,
        type: MediaType.Video
      }
    })
    return result
  }

  async uploadVideoHLS(req: Request) {
    const files = await handleUploadVideo(req)

    const result: Media[] = await Promise.all(
      files.map(async (item) => {
        await encodeHLSWithMultipleVideoStreams(item.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/api/static/video/${item.newFilename}`
            : `http://localhost:${process.env.PORT}/api/static/video/${item.newFilename}`,
          type: MediaType.Video
        }
      })
    )
    return result
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
