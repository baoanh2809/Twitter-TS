import { config } from 'dotenv'
const env = process.env.NODE_ENV

const envFileName = `.env.${env}`
if (!env) {
  console.log('Bạn chưa cài đặt biến môi trường NODE_ENV')
  process.exit(1)
}

if (!envFileName) {
  console.log('Không tìm thấy file cấu hình cho môi trường này')
  process.exit(1)
}

config({
  path: envFileName
})

export const isProduction = env === 'production'

export const envConfig = {
  port: process.env.PORT as string,
  host: process.env.HOST as string,
  dbName: process.env.DB_NAME as string,
  dbUserName: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbTweetsCollection: process.env.DB_TWEETS_COLLECTION as string,
  dbUsersCollection: process.env.DB_USERS_COLLECTION as string,
  dbFlolowersCollection: process.env.DB_FOLLOWERS_COLLECTION as string,
  dbVideoStatusCollection: process.env.DB_VIDEO_STATUS_COLLECTION as string,
  dbRefreshTokenCollection: process.env.DB_REFRESH_TOKEN_COLLECTION as string,
  dbBookmarksCollection: process.env.DB_BOOKMARK_COLLECTION as string,
  dbLikesCollection: process.env.DB_LIKES_COLLECTION as string,
  dbConversationCollection: process.env.DB_CONVERSATIONS_COLLECTION as string,
  dbHashtagsCollection: process.env.DB_HASHTAGS_COLLECTION as string,
  passwordSecret: process.env.PASSWORD_SECRET as string,
  jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN as string,
  jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN as string,
  jwtSecretEmailVerifyToken: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
  jwtSecretPasswordResetToken: process.env.JWT_SECRET_FORGOT_PASSWORD_VERIFY_TOKEN as string,
  refeshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN as string,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN as string,
  emailVerifyTokenExpiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN as string,
  forgotPasswordTokenExpiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRE_IN as string,

  //Google
  googleClientId: process.env.GOOGLE_CLIENT_ID as string,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  googleAuthorizedRedirectURI: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI as string,
  clientRedirectCallback: process.env.CLIENT_REDIRECT_CALLBACK as string,

  //AMZ
  amzAccessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  amzSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  amzRegion: process.env.AWS_REGION as string,

  //S3
  bucketName: process.env.S3_BUCKET_NAME as string,

  //AMZ SES
  sesFromAddress: process.env.SES_FROM_ADDRESS as string,
  clientURL: process.env.CLIENT_URL as string
}
