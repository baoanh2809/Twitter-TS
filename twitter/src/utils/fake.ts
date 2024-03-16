import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import { TweetRequestBody } from '@/models/requests/Tweet.requests'
import { TweetAudience, TweetType, UserVerifiStatus } from '@/constants/enums'
import Follower from '@/models/schemas/followers.Schema'
import { RegisterRequest } from '@/models/requests/User.requests'
import User from '@/models/schemas/User.schema'
import databaseService from '@/services/database.services'
import tweetService from '@/services/tweets.services'
import { hashPassword } from '@/utils/crypto'
import { followUser } from '../models/requests/User.requests'

const PASSWORD = 'Baoanh123!'

const MYID = new ObjectId('65bce0cb8c73fe27f8df3a88')

const USER_COUNT = 10

const createRandomUser = () => {
  const user: RegisterRequest = {
    email: faker.internet.email(),
    password: PASSWORD,
    confirmPassword: PASSWORD,
    dateofbirth: faker.date.past().toISOString(),
    name: faker.internet.displayName()
  }
  return user
}

const createRandomTweet = () => {
  const tweet: TweetRequestBody = {
    type: TweetType.Tweet,
    audience: TweetAudience.Everyone,
    content: faker.lorem.paragraph({
      min: 10,
      max: 160
    }),
    medias: [{ type: 0, url: faker.image.url() }],
    parent_id: null,
    hashtags: [],
    mentions: [],
  }
  return tweet
}

const users: RegisterRequest[] = faker.helpers.multiple(createRandomUser, {
  count: USER_COUNT
})

const inserMultipleUsers = async (user: RegisterRequest[]) => {
  console.log('Creating users...')
  const result = await Promise.all(
    user.map(async (user) => {
      const user_id = new ObjectId()
      const insertResult = await databaseService.users.insertOne(
        new User({
          ...user,
          username: `user${user_id.toString()}`,
          password: hashPassword(user.password),
          dateofbirth: new Date(user.dateofbirth),
          verify: UserVerifiStatus.Verified
        })
      )
      return insertResult.insertedId
    })
  )
  console.log(`Created ${result.length} users`)
  return result
}

const followMultipleUsers = async (user_id: ObjectId, followed_user_ids: ObjectId[]) => {
  console.log('Start following users...')
  const result = await Promise.all(
    followed_user_ids.map(async (followed_user_ids) => {
      databaseService.followers.insertOne(
        new Follower({
          user_id,
          follower_user_id: new ObjectId(followed_user_ids)
        })
      )
    })
  )
  console.log(`Followed ${result.length} users`)
}

const insertMultipleTweets = async (ids: ObjectId[]) => {
  console.log('Creating tweets...')
  console.log('Counting...')
  let count = 0
  const result = await Promise.all(
    ids.map(async (id, index) => {
      await Promise.all([
        tweetService.createTweet(id.toString(), createRandomTweet()),
        tweetService.createTweet(id.toString(), createRandomTweet())
      ])
      count += 2
      console.log(`Created ${count} tweets`)
    })
  )
  return result
}

inserMultipleUsers(users).then((ids) => {
  followMultipleUsers(new ObjectId(MYID), ids)
  insertMultipleTweets(ids)
})
