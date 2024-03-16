import { USER_MESSAGES } from '@/constants/messages'
import { ErrorsWithStatus } from '@/models/Errors'
import HTTP_status from '@/constants/httpStatus'
import { verifyToken } from '@/utils/jwt'
import { Request } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'

export const numberEnumToArray = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}

export const verifyAccessToken = async (accessToken: string, req?: Request) => {
  if (!accessToken) {
    throw new ErrorsWithStatus({
      message: USER_MESSAGES.AUTHORIZATION_IS_INVALID,
      status: HTTP_status.UNAUTHORIZED
    })
  }
  try {
    const decoded_authorization = await verifyToken({
      token: accessToken,
      secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    })
    if (req) {
      ;(req as Request).decoded_authorization = decoded_authorization
      return true
    }
    return decoded_authorization
  } catch (err) {
    throw new ErrorsWithStatus({
      message: capitalize((err as JsonWebTokenError).message),
      status: HTTP_status.UNAUTHORIZED
    })
  }
}
