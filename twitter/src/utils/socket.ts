import { Server } from 'socket.io'
import Conversation from '@/models/schemas/conversations.Schema'
import { ObjectId } from 'mongodb'
import { verifyAccessToken } from '@/utils/commons'
import { TokenPayload } from '@/models/requests/User.requests'
import { UserVerifiStatus } from '@/constants/enums'
import { ErrorsWithStatus } from '@/models/Errors'
import { USER_MESSAGES } from '@/constants/messages'
import HTTP from '@/constants/httpStatus'
import databaseService from '@/services/database.services'
import { Server as ServerHTTP } from 'http'

const initSocket = (httpServer: ServerHTTP) => {
  const io = new Server(httpServer, { cors: { origin: 'http://localhost:3000' } })

  const users: {
    [key: string]: {
      socket_id: string
    }
  } = {}

  io.use(async (socket, next) => {
    const { Authorization } = socket.handshake.auth
    const accessToken = Authorization?.split(' ')[1]
    try {
      const decoded_authorization = await verifyAccessToken(accessToken)
      const user_verify = await databaseService.users.findOne({
        _id: new ObjectId((decoded_authorization as TokenPayload).user_id)
      })
      const verify = user_verify?.verify
      if (verify !== UserVerifiStatus.Verified) {
        throw new ErrorsWithStatus({
          message: USER_MESSAGES.USER_NOT_VERIFIED,
          status: HTTP.UNAUTHORIZED
        })
      }
      socket.handshake.auth.decoded_authorization = decoded_authorization as TokenPayload
      socket.handshake.auth.accessToken = accessToken
      next()
    } catch (err) {
      next({
        message: 'Unauthorized',
        name: 'UnauthorizedError',
        data: err
      })
    }
  })

  io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`)
    const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
    users[user_id] = {
      socket_id: socket.id
    }
    socket.use(async (packet, next) => {
      const { accessToken } = socket.handshake.auth
      try {
        await verifyAccessToken(accessToken)
        next()
      } catch {
        next(new Error('Unauthorized'))
      }
    })

    socket.on('error', (err) => {
      if (err.message === 'Unauthorized') {
        socket.disconnect()
      }
    })
    socket.on('send_message', async (data) => {
      const { receiver_id, sender_id, content } = data.payload
      const receive_socket_id = users[receiver_id]?.socket_id
      const conversation = new Conversation({
        sender_id: new ObjectId(sender_id),
        receiver_id: new ObjectId(receiver_id),
        content
      })
      const result = await databaseService.conversations.insertOne(conversation)
      conversation._id = result.insertedId
      if (receive_socket_id) {
        socket.to(receive_socket_id).emit('receive_message', {
          payload: conversation
        })
      }
    })
    socket.on('disconnect', () => {
      delete users[user_id]
      console.log(`user ${socket.id} disconnected`)
    })
  })
}

export default initSocket
