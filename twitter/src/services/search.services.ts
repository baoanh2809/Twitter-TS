import { MediaQuery, PeopleFollow, TweetType } from '@/constants/enums'
import { SearchQuery } from '@/models/requests/Search.requests'
import Tweet from '@/models/schemas/Tweet.schema'
import databaseService from '@/services/database.services'
import { ObjectId } from 'mongodb'
import { MediaType } from '../constants/enums';

class SearchService {
  async search({
    content,
    limit,
    page,
    media_type,
    people_follow,
    user_id
  }: {
    content: string
    limit: number
    page: number
    media_type?: MediaQuery,
    people_follow?: string
    user_id: string
  }) {
    const $match: any = {
      $text: {
        $search: content
      },
      'medias.type': 0
    }
    if (media_type === MediaQuery.Image) {
      $match['medias.type'] = MediaType.Image
    }
    if (media_type === MediaQuery.Video) {
      $match['medias.type'] = {
        $in: [MediaType.Video, MediaType.HLS]
      }
    }
    if (people_follow && people_follow === PeopleFollow.Following) {
      const user_id_obj = new ObjectId(user_id)
      const follower_user_ids = await databaseService.followers
        .find(
          {
            user_id: user_id_obj
          },
          {
            projection: {
              follower_user_id: 1,
              _id: 0
            }
          }
        )
        .toArray()
      const ids = follower_user_ids.map((follower) => follower.follower_user_id)
      ids.push(user_id_obj)
      $match['user_id'] = {
        $in: ids
      }
    }
    const [tweets, total] = await Promise.all([
      databaseService.tweets
        .aggregate([
          {
            $match
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $match: {
              $or: [
                {
                  audience: 0
                },
                {
                  $and: [
                    {
                      audience: 1
                    },
                    {
                      'user.twitter_circle': {
                        $in: [new ObjectId(user_id)]
                      }
                    }
                  ]
                }
              ]
            }
          },
          {
            $lookup: {
              from: 'hashtags',
              localField: 'hashtags',
              foreignField: '_id',
              as: 'result'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'mentions',
              foreignField: '_id',
              as: 'mentions'
            }
          },
          {
            $addFields: {
              mentions: {
                $map: {
                  input: '$mentions',
                  as: 'mention',
                  in: {
                    _id: '$$mention._id',
                    name: '$$mention.name',
                    username: '$$mention.username',
                    email: '$$mention.email'
                  }
                }
              }
            }
          },
          {
            $lookup: {
              from: 'bookmarks',
              localField: '_id',
              foreignField: 'tweet_id',
              as: 'bookmarks'
            }
          },
          {
            $lookup: {
              from: 'likes',
              localField: '_id',
              foreignField: 'tweet_id',
              as: 'like'
            }
          },
          {
            $lookup: {
              from: 'tweets',
              localField: '_id',
              foreignField: 'parent_id',
              as: 'tweet_children'
            }
          },
          {
            $addFields: {
              like: {
                $size: '$like'
              },
              bookmarks: {
                $size: '$bookmarks'
              },
              retweet_count: {
                $size: {
                  $filter: {
                    input: '$tweet_children',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.type', TweetType.ReTweet]
                    }
                  }
                }
              },
              comment_count: {
                $size: {
                  $filter: {
                    input: '$tweet_children',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.type', TweetType.Comment]
                    }
                  }
                }
              },
              quote_count: {
                $size: {
                  $filter: {
                    input: '$tweet_children',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.type', TweetType.QuoteTweet]
                    }
                  }
                }
              }
            }
          },
          {
            $project: {
              tweet_children: 0,
              user: {
                password: 0,
                email_verified_token: 0,
                forgot_password_token: 0,
                twitter_circle: 0,
                dateofbirth: 0
              }
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseService.tweets
        .aggregate([
          {
            $match: {
              $text: {
                $search: content
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $match: {
              $or: [
                {
                  audience: 0
                },
                {
                  $and: [
                    {
                      audience: 1
                    },
                    {
                      'user.twitter_circle': {
                        $in: [new ObjectId(user_id)]
                      }
                    }
                  ]
                }
              ]
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])
    const tweet_id = tweets.map((tweet) => tweet._id as ObjectId)
    const date = new Date()
    await databaseService.tweets.updateMany(
      {
        _id: {
          $in: tweet_id
        }
      },
      {
        $inc: { user_views: 1 },
        $set: {
          updated_at: date
        }
      }
    )
    tweets.forEach((tweet) => {
      tweet.updated_at = date
      tweet.user_views = tweet.user_views + 1
    })
    return {
      tweets,
      total: total[0]?.total || 0
    }
  }

  // async searchUsers({ bill_number, limit, page }: { bill_number: string; limit: number; page: number }) {
  //   const payments = await databaseService.payments.findOne({ bill_number })
  //   return payments
  // }
}

const searchService = new SearchService()

export default searchService
