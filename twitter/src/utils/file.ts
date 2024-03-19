import fs from 'fs'
import path from 'path'
import { Request, Response } from 'express'
import { File } from 'formidable'
import { nanoid } from 'nanoid'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '@/constants/dir'

export const initFolder = () => {
  ;[UPLOAD_VIDEO_TEMP_DIR, UPLOAD_IMAGE_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

export const handleUploadImage = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFields: 4,
    keepExtensions: true,
    maxFieldsSize: 300 * 1024,
    maxTotalFileSize: 300 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is Empty') as any)
      }
      resolve(files.image as File[])
    })
  })
}

export const handleUploadMutiImage = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFields: 4,
    keepExtensions: true,
    maxFieldsSize: 300 * 1024,
    maxTotalFileSize: 300 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is Empty') as any)
      }
      resolve(files.image as File[])
    })
  })
}

export const getNameFromFullName = (filename: string) => {
  const namearr = filename.split('.')
  namearr.pop()
  return namearr.join('')
}

export const handleUploadVideo = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const nanoId = (await import('nanoid')).nanoid
  const idName = nanoId()
  const folerPath = path.resolve(UPLOAD_VIDEO_DIR, idName)
  fs.mkdirSync(folerPath)
  const form = formidable({
    uploadDir: folerPath,
    maxFields: 1,
    // keepExtensions: true,
    maxFieldsSize: 300 * 1024,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = (name === 'video' && Boolean(mimetype?.includes('mp4'))) || Boolean(mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('File is not valid') as any)
      }
      return valid
    },
    filename: function () {
      return idName
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('File is Empty') as any)
      }
      const videos = files.video as File[]
      videos.forEach((video) => {
        const ext = getExtension(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + ext)
        video.newFilename = video.newFilename + '.' + ext
        video.filepath = video.filepath + '.' + ext
      })
      resolve(files.video as File[])
    })
  })
}

export const getExtension = (filename: string) => {
  const namearr = filename.split('.')
  return namearr[namearr.length - 1]
}

export const getFiles = (dir: string, files: string[] = []) => {
  const fileList = fs.readdirSync(dir)
  for (const file of fileList) {
    const name = `${dir}/${file}`
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files)
    } else {
      files.push(name)
    }
  }
  return files
}
