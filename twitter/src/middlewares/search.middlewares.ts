import { MediaQuery, PeopleFollow } from '@/constants/enums'
import { validate } from '@/utils/validation'
import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'

export const searchValidator = validate(
  checkSchema(
    {
      content: {
        isString: {
          errorMessage: 'Content must be string'
        }
      },
      media_type: {
        optional: true,
        isIn: {
          options: [Object.values(MediaQuery)]
        },
        errorMessage: `Media type must be one of ${Object.values(MediaQuery)}`
      },
      people_follow: {
        optional: true,
        isIn: {
          options: [Object.values(PeopleFollow)]
        },
        errorMessage: 'People follow must be 0 or 1'
      }
    },
    ['query']
  )
)
