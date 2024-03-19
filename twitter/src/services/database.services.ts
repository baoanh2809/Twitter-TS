import { MongoClient, Db, Collection } from 'mongodb'
import User from '@/models/schemas/User.schema'
import e from 'express'
import { error } from 'console'
import RefreshToken from '@/models/schemas/refreshToken.schema'
import Follower from '@/models/schemas/followers.Schema'
import Tweet from '@/models/schemas/Tweet.schema'
import Hashtag from '@/models/schemas/hashtags.Schema'
import bookMark from '@/models/schemas/bookmarks.Schema'
import like from '@/models/schemas/likes.Schema'
import Conversation from '@/models/schemas/conversations.Schema'
import { envConfig } from '@/constants/config'
import VideoStatus from '@/models/schemas/videosStatus.Schema'

const uri = `mongodb+srv://${envConfig.dbUserName}:${envConfig.dbPassword}@cluster0.brqve.mongodb.net/`
class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(`${envConfig.dbName}`)
  }
  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }

  async indexUsers() {
    const exist = await this.users.indexExists(['email_1_password_1', 'email_1', 'username_1'])
    if (!exist) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
      this.users.createIndex({ username: 1 }, { unique: true })
    }
  }

  async indexRefreshTokens() {
    const exist = await this.users.indexExists(['exp1', 'token_1'])
    if (!exist) {
      this.refreshTokens.createIndex({ token: 1 })
      this.refreshTokens.createIndex(
        { exp: 1 },
        {
          expireAfterSeconds: 0
        }
      )
    }
  }

  async indexFollowers() {
    const exist = await this.followers.indexExists(['user_id_1_following_user_id_1'])
    if (!exist) {
      this.followers.createIndex({ user_id: 1, following_user_id: 1 })
    }
  }

  async indexTweets() {
    const exist = await this.tweets.indexExists(['content_text'])
    if (!exist) {
      this.tweets.createIndex({ content: 'text' }, { default_language: 'none' })
    }
  }

  get users(): Collection<User> {
    return this.db.collection(`${envConfig.dbUsersCollection}`)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(`${envConfig.dbRefreshTokenCollection}`)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(`${envConfig.dbFlolowersCollection}`)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(`${envConfig.dbVideoStatusCollection}`)
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection(`${envConfig.dbTweetsCollection}`)
  }

  get hashtags(): Collection<Hashtag> {
    return this.db.collection(`${envConfig.dbHashtagsCollection}`)
  }

  get bookmarks(): Collection<bookMark> {
    return this.db.collection(`${envConfig.dbBookmarksCollection}`)
  }

  get likes(): Collection<like> {
    return this.db.collection(`${envConfig.dbLikesCollection}`)
  }

  get conversations(): Collection<Conversation> {
    return this.db.collection(`${envConfig.dbConversationCollection}`)
  }
}

const databaseService = new DatabaseService()
export default databaseService
