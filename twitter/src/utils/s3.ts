import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import fs from 'fs'
import { Response } from 'express'
import path from 'path'
import { envConfig } from '@/constants/config'
import HTTP from '@/constants/httpStatus'

console.log(envConfig.amzSecretAccessKey)

const s3 = new S3({
  region: envConfig.amzRegion,
  credentials: {
    secretAccessKey: envConfig.amzSecretAccessKey,
    accessKeyId: envConfig.amzAccessKeyId
  }
})
// const file = fs.readFileSync(path.resolve('uploads/c14ea6547180a71f6ce5ddc00.jpg'))
export const uploadFileToS3 = ({
  filename,
  filepath,
  contentType
}: {
  filename: string
  filepath: string
  contentType: string
}) => {
  const parralUpload3 = new Upload({
    client: s3,
    params: {
      Bucket: envConfig.bucketName,
      Key: filename,
      Body: fs.readFileSync(filepath),
      ContentType: contentType
    },
    tags: [],
    queueSize: 4,
    partSize: 1024 * 1024 * 5,
    leavePartsOnError: false
  })
  return parralUpload3.done()
}

export const sendFileFromS3 = async (res: Response, filepath: string) => {
  try {
    const data = await s3.getObject({
      Bucket: envConfig.bucketName,
      Key: filepath
    })
    ;(data.Body as any).pipe(res)
  } catch (err) {
    res.status(HTTP.NOT_FOUND).send('Not founf')
  }
}
