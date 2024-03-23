import { Router } from 'express'
import {
  logginValidate,
  registerValidator,
  accessTokenValidator,
  refreshTokenValidator,
  emailVerifyToken,
  forgotPasswordValidator,
  verifyForgotPasswordToken,
  resetPasswordValidator,
  verifiedUserValidator,
  updateMeValidator,
  followValidator,
  unFollowValidator,
  changePasswordValidator
} from '@/middlewares/users.middlewares'
import {
  loginController,
  logoutController,
  verifyEmailController,
  resendVerifyEmailController,
  forgotPasswordController,
  verifyForgotPasswordController,
  resetPasswordController,
  getMeController,
  updateMeController,
  getProFileController,
  followController,
  unFollowController,
  refreshTokenController
} from '@/controllers/users.controllers'
import { registerController } from '@/controllers/users.controllers'
import { filterMiddleware } from '@/middlewares/common.middlewares'
import { validate } from '@/utils/validation'
import { wrapRequestHandler } from '../utils/handlers'
import { updateMe } from '@/models/requests/User.requests'
import { changePasswordController } from '@/controllers/users.controllers'

const usersRouter = Router()

usersRouter.get('/test', (req, res) => {
  res.json({ message: 'Test router' })
})

/**
 * @swagger
 * paths:
 *   /api/users/verify-email:
 *     post:
 *       tags:
 *         - users
 *       summary: Verify Email User
 *       description: Verify Email User
 *       operationId: VerifyEmail
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *        description: Xác thực Email User
 *        content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EmailVerifyToken"
 *        required: true
 *       responses:
 *         default:
 *           description: Xác thực Email User
 *           content:
 *             application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Email verified success
 */
usersRouter.post('/verify-email', emailVerifyToken, wrapRequestHandler(verifyEmailController))

/**
 * @swagger
 * paths:
 *   /api/users/resend-verify-email:
 *     post:
 *       tags:
 *         - users
 *       summary: Resend Verify Email User
 *       description: Resend Verify Email User
 *       operationId: Resend VerifyEmail
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         default:
 *           description: Xác thực Email User
 *           content:
 *             application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Resend verify email success                     
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))
/**
 * @swagger
 * paths:
 *   /api/users/forgot-password:
 *     post:
 *       tags:
 *         - users
 *       summary: Forgot Password User
 *       description:  Forgot Password User
 *       operationId:  Forgot Password
 *       requestBody:
 *        description: Gửi yêu cầu reset password
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                type: string
 *                example: tranbaoanh@gmail.com
 *       responses:
 *         default:
 *           description: Forgot Password User
 *           content:
 *             application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: CHECK EMAIL FORGOT PASSWORD
 */

usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordToken,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * @swagger
 * paths:
 *   /api/users/me:
 *     get:
 *       tags:
 *         - users
 *       summary: Lấy thông tin user
 *       description: Lấy thông tin user
 *       operationId: getMe
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         default:
 *           description: Lấy thông tin user thành công
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Get my profile success
 *                   result:
 *                     $ref: "#/components/schemas/UserProfile"
 *     patch:
 *       tags:
 *         - users
 *       summary: Thay đổi thông tin user
 *       description: Thay đổi thông tin user
 *       operationId: Update Me
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *        description: Thay đổi thông tin user
 *        content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateMeRequest"
 *        required: true
 *       responses:
 *         default:
 *           description: Thay đổi thông tin user thành công
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Update my profile success
 *                   result:
 *                     $ref: "#/components/schemas/UserProfile"
 */

usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<updateMe>([
    'name',
    'dateofbirth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

/**
 * @swagger
 * paths:
 *   /api/users/{userId}:
 *     get:
 *       tags:
 *         - users
 *       parameters:
 *         - name: userId
 *           in: path
 *           description: ID of order that needs to be fetched
 *           required: true
 *           schema:
 *            type: string
 *            format: MongoId
 *       summary: Lấy thông tin user
 *       description: Lấy thông tin user
 *       operationId: getMe
 *       responses:
 *         '200':
 *           description: Lấy thông tin user thành công
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Get my profile success
 *                   result:
 *                     $ref: "#/components/schemas/UserProfile"
 *         '400':
 *           description: Invalid ID supplied
 *         '404':
 *           description: User not found
 */

usersRouter.get('/:id', wrapRequestHandler(getProFileController))


/**
 * @swagger
 * paths:
 *   /api/users/follows:
 *     post:
 *       tags:
 *         - users
 *       summary: Follow User
 *       description: Follow User
 *       operationId:  Follow User
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *        description: Theo dõi User
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              follower_user_id:
 *                type: string
 *                example: 65d982a893f17ad4f1cf6cb6
 *       responses:
 *         default:
 *           description: Follow User
 *           content:
 *             application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Follow User Success
 */

usersRouter.post(
  '/follows',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

/**
 * @swagger
 * paths:
 *   /api/users/follows/{followId}:
 *     delete:
 *       tags:
 *         - users
 *       summary: Unfollow User
 *       parameters:
 *         - name: followId
 *           in: path
 *           description: ID of order that needs to be fetched
 *           required: true
 *           schema:
 *            type: string
 *            format: MongoId
 *       description: Unfollow User
 *       operationId:  Unfollow User
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         '200':
 *           description: Unfollow User
 *           content:
 *             application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Unfollow User Success
 *         '400':
 *           description: Invalid ID supplied
 *         '404':
 *           description: User not found
 */

usersRouter.delete(
  '/follows/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unFollowValidator,
  wrapRequestHandler(unFollowController)
)

/**
 * @swagger
 * paths:
 *   /api/users/reset-password:
 *     post:
 *       tags:
 *         - users
 *       summary: Reset Password
 *       description: Reset Password
 *       operationId: Reset Password
 *       requestBody:
 *        description: Reset Password User
 *        content:
 *         application/json:
 *           schema:
 *            $ref: "#/components/schemas/resetPassword"
 *       responses:
 *         default:
 *           description:  Reset Password User
 *           content:
 *             application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Reset Password Success                  
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))
/**
 * @swagger
 * paths:
 *  /api/users/login:
 *    post:
 *      tags:
 *        - users
 *      summary: Đăng Nhập
 *      description: Đăng nhập vào hệ thống
 *      operation: login
 *      requestBody:
 *        description: Thông tin đăng nhập
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/LoginBody"
 *        required: true
 *      responses:
 *        "200":
 *          description: Đăng nhập thành công
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Login success
 *                  result:
 *                    $ref: "#/components/schemas/SuccessAuthentication"
 *        "422":
 *          description: Invalid input     
 */
usersRouter.post('/login', logginValidate, wrapRequestHandler(loginController))

/**
 * @swagger
 * paths:
 *  /api/users/register:
 *    post:
 *      tags:
 *        - users
 *      summary: Đăng ký tài khoản user
 *      description: Đăng ký vào hệ thống
 *      operation: register
 *      requestBody:
 *        description: Đăng ký
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/RegisterBody"
 *        required: true
 *      responses:
 *        "200":
 *          description: Đăng Ký thành công
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Register Success
 *                  result:
 *                    $ref: "#/components/schemas/SuccessRegisterAuthentication"
 *        "422":
 *          description: Invalid input     
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
/**
 * @swagger
 * paths:
 *   /api/users/logout:
 *     post:
 *       tags:
 *         - users
 *       summary: LogOut User
 *       description: LogOut User
 *       operationId:  LogOut User
 *       requestBody:
 *         description: LogOut User
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVkOWE5N2VkNWZkZDI2ZmM0MmViZTNmIiwidG9rZW5fdHlwZSI6MCwidmVyaWZ5IjowLCJpYXQiOjE3MTA4NTkxNjEsImV4cCI6MTcxMDk0NTU2MX0.zArMuwEWa9XCP1cKEIk4M_C0P2K7yg6t3RHV8GovvTE
 *         required: true
 *       responses:
 *         '200':
 *           description: LogOut User
 *           content:
 *             application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Logout Success
 *         '401':
 *           description: USER refresh token is not exist
 */

usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * @swagger
 * paths:
 *   /api/users/refresh-token:
 *     post:
 *       tags:
 *         - users
 *       summary: Get New Token
 *       description: Get New Token
 *       operationId:  Get New Token
 *       requestBody:
 *         description: Get New Token
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVkOWE5N2VkNWZkZDI2ZmM0MmViZTNmIiwidG9rZW5fdHlwZSI6MCwidmVyaWZ5IjowLCJpYXQiOjE3MTA4NTkxNjEsImV4cCI6MTcxMDk0NTU2MX0.zArMuwEWa9XCP1cKEIk4M_C0P2K7yg6t3RHV8GovvTE
 *         required: true
 *       responses:
 *         '200':
 *           description: Get New Token
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Refresh token success
 *                   result:
 *                     $ref: "#/components/schemas/SuccessAuthentication"
 *         '401':
 *           description: USER refresh token is not exist
 */

usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * @swagger
 * paths:
 *   /api/users/change-password:
 *     put:
 *       tags:
 *         - users
 *       summary: Change Password User
 *       description: Change Password User
 *       operationId:  Change Password User
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         description: Change Password User
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/ChangePassword"
 *         required: true
 *       responses:
 *         '200':
 *           description: Change Password User
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Change Password User Success
 *         '401':
 *           description: Password invalid
 */

usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default usersRouter
