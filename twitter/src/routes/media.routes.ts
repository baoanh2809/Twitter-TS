import { Router } from 'express'
import { accessTokenValidator, verifiedUserValidator } from '@/middlewares/users.middlewares'
import { wrapRequestHandler } from '@/utils/handlers'
import {
  uploadImageController,
  uploadVideoController,
  uploadVideoHLSController,
  videoStatusController
} from '@/controllers/media.controllers'

const mediaRouter = Router()

/**
 * @swagger
 * components:
 *  schemas:
 *    MediaImageResult:
 *      type: object
 *      properties:
 *        url:
 *          type: string
 *          example: https://twitter-ap-southeast-1-clone.s3.ap-southeast-1.amazonaws.com/images/c3d2fe70f2c150bc2778dec00.jpeg
 *        type:
 *          type: integer
 *          example: 0
 *    MediaVideoResult:
 *      type: object
 *      properties:
 *        url:
 *          type: string
 *          example: https://twitter-ap-southeast-1-clone.s3.ap-southeast-1.amazonaws.com/images/c3d2fe70f2c150bc2778dec00.jpeg
 *        type:
 *          type: integer
 *          example: 1
 *    MediaVideoHLSResult:
 *      type: object
 *      properties:
 *        url:
 *          type: string
 *          example: https://twitter-ap-southeast-1-clone.s3.ap-southeast-1.amazonaws.com/images/c3d2fe70f2c150bc2778dec00.jpeg
 *        type:
 *          type: integer
 *          example: 2
 *    GetVideoStatus:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          format: MongoId
 *          example: 65d9a97ed5fdd26fc42ebe42
 *        name:
 *          type: string
 *          examle: s0FdL6dwq4Dt3pnxC1ucc
 *        status:
 *          type: number
 *          enum: [Pending,Processing,Success,Failed]
 *          example: 2
 *        message:
 *          type: string
 *          example: 'Encode Success'
 *        createdAt:
 *           format: ISO8601
 *           example: 2024-03-18T13:55:35.779Z
 *        updatedAt:
 *           format: ISO8601
 *           example: 2024-03-18T13:57:15.779Z
 */

/**
 * @swagger
 * paths:
 *   /api/medias/upload-image:
 *     post:
 *       tags:
 *         - Media
 *       summary: Upload Image
 *       description: Upload Image
 *       operationId:  Upload Image
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *           content:
 *            multipart/form-data:
 *                schema:
 *                  type: object
 *                  properties:
 *                    image:
 *                      type: string
 *                      format: binary
 *     responses:
 *       responses:
 *         '200':
 *           description: Upload HLS Video Success
 *           content:
 *             application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      example: "Upload Image successfully"
 *                    result:
 *                      $ref: "#/components/schemas/MediaImageResult"
 */

mediaRouter.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadImageController)
)

/**
 * @swagger
 * paths:
 *   /api/medias/upload-video:
 *     post:
 *       tags:
 *         - Media
 *       summary: Upload Video
 *       description: Upload Video
 *       operationId:  Upload Video
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *           content:
 *            multipart/form-data:
 *                schema:
 *                  type: object
 *                  properties:
 *                    video:
 *                      type: string
 *                      format: binary
 *       responses:
 *         '200':
 *           description: Upload Video Success
 *           content:
 *             application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      example: "Upload Video successfully"
 *                    result:
 *                      $ref: "#/components/schemas/MediaVideoResult"
 */

mediaRouter.post(
  '/upload-video',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoController)
)

/**
 * @swagger
 * paths:
 *   /api/medias/upload-video-hls:
 *     post:
 *       tags:
 *         - Media
 *       summary: Upload Video HLS
 *       description: Upload Video HLS
 *       operationId:  Upload Video HLS
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *           content:
 *            multipart/form-data:
 *                schema:
 *                  type: object
 *                  properties:
 *                    video:
 *                      type: string
 *                      format: binary
 *       responses:
 *         '200':
 *           description: Upload HLS Video Success
 *           content:
 *             application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      example: "Upload Video HLS successfully"
 *                    result:
 *                      $ref: "#/components/schemas/MediaVideoHLSResult"
 */

mediaRouter.post(
  '/upload-video-hls',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoHLSController)
)

/**
 * @swagger
 * paths:
 *  /api/medias/video-status/{id}:
 *    get:
 *      tags:
 *        - Media
 *      summary: Get Video Status
 *      description: Get Video Status
 *      operationId: Get Video Status
 *      security:
 *        - BearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: Video ID
 *      schema:
 *        type: string
 *      responses:
 *         '200':
 *           description: Get Video Status Success
 *           content:
 *             application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      example: "Get video status successfully"
 *                    result:
 *                      $ref: "#/components/schemas/GetVideoStatus"
 *         '404':
 *            description: Video Not Found
 *         '500':
 *            description: Internal Server Error
 */

mediaRouter.get(
  '/video-status/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(videoStatusController)
)

// mediaRouter.put('/change-image', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(MediaController) )

export default mediaRouter
