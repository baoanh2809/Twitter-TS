import { TweetAudience, TweetType } from '@/constants/enums'
import { Media } from '@/models/Other'
import { ObjectId } from 'mongodb'

interface TweetContructor {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType | undefined
  content: string
  audience: TweetAudience
  parent_id: null | string
  hashtags: ObjectId[]
  mentions: string[]
  medias: Media[]
  guest_views?: number
  user_views?: number
  created_at?: Date
  updated_at?: Date
}

export default class Tweet {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType | undefined
  content: string
  audience: TweetAudience
  parent_id: null | ObjectId
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  guest_views: number
  user_views: number
  created_at: Date
  updated_at: Date
  constructor({
    audience,
    content,
    parent_id,
    hashtags,
    medias,
    mentions,
    guest_views,
    updated_at,
    created_at,
    user_id,
    user_views,
    type
  }: TweetContructor) {
    const date = new Date()
    this._id = new ObjectId()
    this.user_id = user_id
    this.type = type
    this.content = content
    this.audience = audience
    this.parent_id = parent_id ? new ObjectId(parent_id) : null
    this.hashtags = hashtags
    this.mentions = mentions.map((mention) => new ObjectId(mention))
    this.medias = medias
    this.guest_views = guest_views || 0
    this.user_views = user_views || 0
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
