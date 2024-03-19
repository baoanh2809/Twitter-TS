export enum UserVerifiStatus {
  Unverified,
  Verified,
  Banned
}

export enum TokenTypes {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export enum MediaType {
  Image,
  Video,
  HLS
}

export enum EncodingStatus {
  Pending, // waiting for encoding
  Processing, // encoding in progress
  Success, // encoding success
  Failed // encoding failed
}

export enum MediaQuery {
  Image = 'image',
  Video = 'video'
}

export enum TweetType {
  Tweet,
  ReTweet,
  Comment,
  QuoteTweet
}

export enum TweetAudience {
  Everyone,
  TwitterCircle
}

export enum PeopleFollow {
  Anyone = '0',
  Following = '1'
}

