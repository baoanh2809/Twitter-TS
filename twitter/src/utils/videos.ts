import { promisify } from 'util'
import { exec as execCallback } from 'child_process'
import path from 'path'

const execAsync = promisify(execCallback)

const MAXIMUM_BITRATE_720P = 5 * 10 ** 6 // 5Mbps
const MAXIMUM_BITRATE_1080P = 8 * 10 ** 6 // 8Mbps
const MAXIMUM_BITRATE_1440P = 16 * 10 ** 6 // 16Mbps

type Resolution = {
  width: number
  height: number
}

type EncodeByResolution = {
  inputPath: string
  isHasAudio: boolean
  resolution: Resolution
  outputSegmentPath: string
  outputPath: string
  bitrate: {
    720: number
    1080: number
    1440: number
    original: number
  }
}

const checkVideoHasAudio = async (filePath: string): Promise<boolean> => {
  const { stdout } = await execAsync(
    `ffprobe -v error -select_streams a:0 -show_entries stream=codec_type -of default=nw=1:nk=1 "${filePath}"`
  )
  return stdout.trim() === 'audio'
}

const getBitrate = async (filePath: string): Promise<number> => {
  const { stdout } = await execAsync(
    `ffprobe -v error -select_streams v:0 -show_entries stream=bit_rate -of default=nw=1:nk=1 "${filePath}"`
  )
  return Number(stdout.trim())
}

const getResolution = async (filePath: string): Promise<Resolution> => {
  const { stdout } = await execAsync(
    `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${filePath}"`
  )
  const resolution = stdout.trim().split('x')
  const [width, height] = resolution
  return {
    width: Number(width),
    height: Number(height)
  }
}

const getWidth = (height: number, resolution: Resolution): number => {
  const width = Math.round((height * resolution.width) / resolution.height)
  return width % 2 === 0 ? width : width + 1
}

const encodeVideo = async (args: string[]) => {
  const command = `ffmpeg ${args.join(' ')}`

  return new Promise((resolve, reject) => {
    execCallback(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`stderr: ${stderr}`)
        reject(new Error('FFmpeg encountered an error'))
      } else {
        resolve(true)
      }
    })
  })
}

const encodeMax720 = async ({
  bitrate,
  inputPath,
  isHasAudio,
  outputPath,
  outputSegmentPath,
  resolution
}: EncodeByResolution) => {
  const args = [
    '-y',
    '-i',
    inputPath,
    '-preset',
    'veryslow',
    '-g',
    '48',
    '-crf',
    '17',
    '-sc_threshold',
    '0',
    '-map',
    '0:0'
  ]
  if (isHasAudio) {
    args.push('-map', '0:1')
  }
  args.push(
    '-s:v:0',
    `${getWidth(720, resolution)}x720`,
    '-c:v:0',
    'libx264',
    '-b:v:0',
    `${bitrate[720]}`,
    '-c:a',
    'copy',
    '-var_stream_map'
  )
  if (isHasAudio) {
    args.push('v:0,a:0')
  } else {
    args.push('v:0')
  }
  args.push(
    '-master_pl_name',
    'master.m3u8',
    '-f',
    'hls',
    '-hls_time',
    '6',
    '-hls_list_size',
    '0',
    '-hls_segment_filename',
    outputSegmentPath,
    outputPath
  )
  console.log(args)
  try {
    await encodeVideo(args)
    console.log('Video encoding successful')
  } catch (error) {
    console.error(error)
  }
  return true
}

const encodeMax1080 = async ({
  bitrate,
  inputPath,
  isHasAudio,
  outputPath,
  outputSegmentPath,
  resolution
}: EncodeByResolution) => {
  const args = [
    '-y',
    '-i',
    inputPath,
    '-preset',
    'veryslow',
    '-g',
    '48',
    '-crf',
    '17',
    '-sc_threshold',
    '0',
    '-map',
    '0:0'
  ]
  if (isHasAudio) {
    args.push('-map', '0:1', '-map', '0:0', '-map', '0:1')
  }
  args.push(
    '-s:v:0',
    `${getWidth(720, resolution)}x720`,
    '-c:v:0',
    'libx264',
    '-b:v:0',
    `${bitrate[720]}`,
    '-s:v:1',
    `${getWidth(1080, resolution)}x1080`,
    '-c:v:1',
    'libx264',
    '-b:v:1',
    `${bitrate[1080]}`,
    '-c:a',
    'copy',
    '-var_stream_map "v:0,a:0 v:1,a:1"'
  )
  args.push(
    '-master_pl_name',
    'master.m3u8',
    '-f',
    'hls',
    '-hls_time',
    '6',
    '-hls_list_size',
    '0',
    '-hls_segment_filename',
    outputSegmentPath,
    outputPath
  )
  try {
    await encodeVideo(args)
    console.log('Video encoding successful')
  } catch (error) {
    console.error(error)
  }
  return true
}

const encodeMax1440 = async ({
  bitrate,
  inputPath,
  isHasAudio,
  outputPath,
  outputSegmentPath,
  resolution
}: EncodeByResolution) => {
  const args = [
    '-y',
    '-i',
    inputPath,
    '-preset',
    'veryslow',
    '-g',
    '48',
    '-crf',
    '17',
    '-sc_threshold',
    '0',
    '-map',
    '0:0'
  ]
  if (isHasAudio) {
    args.push('-map', '0:1', '-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1')
  }
  args.push(
    '-s:v:0',
    `${getWidth(720, resolution)}x720`,
    '-c:v:0',
    'libx264',
    '-b:v:0',
    `${bitrate[720]}`,
    '-s:v:1',
    `${getWidth(1080, resolution)}x1080`,
    '-c:v:1',
    'libx264',
    '-b:v:1',
    `${bitrate[1080]}`,
    '-s:v:2',
    `${getWidth(1440, resolution)}x1440`,
    '-c:v:2',
    'libx264',
    '-b:v:2',
    `${bitrate[1440]}`,
    '-c:a',
    'copy',
    '-var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2"'
  )
  args.push(
    '-master_pl_name',
    'master.m3u8',
    '-f',
    'hls',
    '-hls_time',
    '6',
    '-hls_list_size',
    '0',
    '-hls_segment_filename',
    outputSegmentPath,
    outputPath
  )
  try {
    await encodeVideo(args)
    console.log('Video encoding successful')
  } catch (error) {
    console.error(error)
  }
  return true
}

const encodeMaxOriginal = async ({
  bitrate,
  inputPath,
  isHasAudio,
  outputPath,
  outputSegmentPath,
  resolution
}: EncodeByResolution) => {
  const args = [
    '-y',
    '-i',
    inputPath,
    '-preset',
    'veryslow',
    '-g',
    '48',
    '-crf',
    '17',
    '-sc_threshold',
    '0',
    '-map',
    '0:0'
  ]
  if (isHasAudio) {
    args.push('-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1')
  }
  args.push(
    '-s:v:0',
    `${getWidth(720, resolution)}x720`,
    '-c:v:0',
    'libx264',
    '-b:v:0',
    `${bitrate[720]}`,
    '-s:v:1',
    `${getWidth(1080, resolution)}x1080`,
    '-c:v:1',
    'libx264',
    '-b:v:1',
    `${bitrate[1080]}`,
    '-s:v:2',
    `${resolution.width}x${resolution.height}`,
    '-c:v:2',
    'libx264',
    '-b:v:2',
    `${bitrate.original}`,
    '-c:a',
    'copy',
    '-var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2"'
  )
  args.push(
    '-master_pl_name',
    'master.m3u8',
    '-f',
    'hls',
    '-hls_time',
    '6',
    '-hls_list_size',
    '0',
    '-hls_segment_filename',
    outputSegmentPath,
    outputPath
  )
  try {
    await encodeVideo(args)
    console.log('Video encoding successful')
  } catch (error) {
    console.error(error)
  }
  return true
}

const encodeHLSWithMultipleVideoStreams = async (inputPath: string) => {
  const [bitrate, resolution] = await Promise.all([getBitrate(inputPath), getResolution(inputPath)])
  const parent_folder = path.join(inputPath, '..')
  const outputSegmentPath = path.join(parent_folder, 'v%v/fileSequence%d.ts')
  const outputPath = path.join(parent_folder, 'v%v/prog_index.m3u8')
  const bitrate720 = bitrate > MAXIMUM_BITRATE_720P ? MAXIMUM_BITRATE_720P : bitrate
  const bitrate1080 = bitrate > MAXIMUM_BITRATE_1080P ? MAXIMUM_BITRATE_1080P : bitrate
  const bitrate1440 = bitrate > MAXIMUM_BITRATE_1440P ? MAXIMUM_BITRATE_1440P : bitrate
  const isHasAudio = await checkVideoHasAudio(inputPath)
  let encodeFunc = encodeMax720
  if (resolution.height > 720) {
    encodeFunc = encodeMax1080
  }
  if (resolution.height > 1080) {
    encodeFunc = encodeMax1440
  }
  if (resolution.height > 1440) {
    encodeFunc = encodeMaxOriginal
  }
  await encodeFunc({
    bitrate: {
      720: bitrate720,
      1080: bitrate1080,
      1440: bitrate1440,
      original: bitrate
    },
    inputPath,
    isHasAudio,
    outputPath,
    outputSegmentPath,
    resolution
  })
  return true
}

export {
  checkVideoHasAudio,
  getBitrate,
  getResolution,
  getWidth,
  encodeVideo,
  encodeMax720,
  encodeHLSWithMultipleVideoStreams
}
