import { JwtPayload } from 'jsonwebtoken'
import { TokenTypes, UserVerifiStatus } from '@/constants/enums'
import { emailVerifyToken } from '../../middlewares/users.middlewares'
import { ParamsDictionary } from 'express-serve-static-core'

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginBody:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: tranbaoanh@gmail.com
 *         password:
 *           type: string
 *           example: Baoanh123
 *     UserProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: MongoId
 *           example: 65d9a97ed5fdd26fc42ebe3f
 *         name:
 *           type: string
 *           example: BaoAnh
 *         email:
 *           type: string
 *           format: email
 *           example: tranbaoanh@gmail.com
 *         dateofbirth:
 *           type: string
 *           format: ISO8601
 *           example: 2023-08-07T14:06:06.059Z
 *         created_at:
 *           type: string
 *           format: ISO8601
 *           example: 2024-02-24T08:31:59.006Z
 *         updated_at:
 *           type: string
 *           format: ISO8601
 *           example: 2024-02-24T08:31:59.006Z
 *         verify:
 *           $ref: "#/components/schemas/UserVerifyStatus"
 *         twitter_circle:
 *           type: array
 *           items:
 *             type: string
 *             format: MongoId
 *           example: ["65d9a97ed5fdd26fc42ebe3f", "65d9a97ed5fdd26fc42ebe42"]
 *         bio:
 *           type: string
 *           example: This is my bio
 *         location:
 *           type: string
 *           example: "TpHCM"
 *         website:
 *           type: string
 *           example: "example.com"
 *         username:
 *           type: string
 *           example: "John"
 *         avatar:
 *           type: string
 *           example: "http:localhost:4000/images/avatar/john.jpg"
 *         cover_photo:
 *           type: string
 *           example: "http:localhost:4000/images/avatar/john.jpg"
 *     UserVerifyStatus:
 *       type: number
 *       enum: [Unverified, Verified, Banned]
 *       example: 1
 *     SuccessAuthentication:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVkOWE5N2VkNWZkZDI2ZmM0MmViZTNmIiwidG9rZW5fdHlwZSI6MCwidmVyaWZ5IjowLCJpYXQiOjE3MTAwNTgxNjcsImV4cCI6MTcxMDE0NDU2N30.jJlZUlDsxvt3SxvlZNEbedTnOiJLhOaRkobg7N0tz_I
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVkOWE9N2VkNWZkZDI2ZmM0MmViZTNmIiwidG9rZW5fdHlwZSI6MSwidmVyaWZ5IjowLCJpYXQiOjE3MTAwNTgxNjcsImV4cCI6MTcxMjY1MDE2N30.DMv93C7ohpdwoAvmHyFfXyaE3a3b97EMWNmouvZCICQ
 */

export interface UpdateMeRequest {
  name?: string
  dateofbirth?: string
  bio?: string
  location?: string
  website?: string
  user_name?: string
  avatar?: string
  cover_photo?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword?: string
  dateofbirth: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenTypes
}

export interface LogoutRefreshBody {
  refreshToken: string
}

export interface emailVerifyToken {
  email_verify_token?: string
}

export interface forgotPassword {
  email: string
}

export interface verifyForgotPassword {
  forgotPasswordToken: string
}

export interface resetPassword {
  password: string
  confirmPassword: string
  forgotPasswordToken: string
}

export interface updateMe {
  name?: string
  dateofbirth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface getProfile {
  id: string
}

export interface followUser {
  follower_user_id: string
}

export interface unFollow extends ParamsDictionary {
  user_id: string
}

export interface changePassword {
  old_password: string
  new_password: string
  confirm_new_password: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenTypes
  verify: UserVerifiStatus
  exp: number
  iat: number
}

export interface RefreshTokenBody {
  refreshToken: string
}
