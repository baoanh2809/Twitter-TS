import express from 'express'
import { routes } from './routes/index.routes'
import { defaultErrorHandler } from '@/middlewares/errors.middleware'
import databaseService from './services/database.services'
import { initFolder } from '@/utils/file'
import { UPLOAD_IMAGE_DIR } from '@/constants/dir'
import bodyParser from 'body-parser'
import cors, { CorsOptions } from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
// import '@/utils/fake'
// import '@/utils/s3'

import { createServer } from 'http'
import initSocket from '@/utils/socket'
import YAML from 'yaml'
import fs from 'fs'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import { envConfig, isProduction } from '@/constants/config'

const file = fs.readFileSync(path.resolve('twitter-swagger.yaml'), 'utf8')

const swaggerOptions: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Twitter API',
      version: '1.0.0',
      description: 'Twitter API',
      contact: {
        name: 'Twitter',
        email: 'tranbaoanh@gmail.com'
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerformat: 'JWT'
        }
      }
    },
    servers: [
      {
        url: 'http://localhost:4000'
      }
    ]
  },
  apis: ['./src/routes/*.routes.ts', './src/models/requests/*.requests.ts']
}

const swaggerSpecification = swaggerJSDoc(swaggerOptions)

const swaggerDocument = YAML.parse(file)

const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: true, // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: true // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
})

app.use(limiter)

const httpServer = createServer(app)

// app.use(helmet())
// const corsOptions: CorsOptions = {
//   origin: isProduction ? envConfig.clientURL : '*'
// }

app.use(cors())

// Tạo folder upload
initFolder()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
routes(app)
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexFollowers()
  databaseService.indexTweets()
})

app.use('/static', express.static(UPLOAD_IMAGE_DIR))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecification))
app.use(defaultErrorHandler)
initSocket(httpServer)
const PORT = envConfig.port
httpServer.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
