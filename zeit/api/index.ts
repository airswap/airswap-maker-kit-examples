import jayson from 'jayson' // JSON-RPC helper
import winston from 'winston' // logger
import initHandlers from '@airswap/maker-kit'
import connect from 'connect'
import cors from 'cors'
import bodyParser from 'body-parser'

const jsonParser = bodyParser.json

// Make sure environment variable is set
if (!process.env.ETHEREUM_ACCOUNT) {
  throw new Error('ETHEREUM_ACCOUNT must be set in your .env file')
}

// Initialize pricing handlers with our private key
const handlers = initHandlers(process.env.ETHEREUM_ACCOUNT)

// Setup logger
const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
  format: winston.format.printf(({ level, message }) => {
    return `${level}: ${message}`
  }),
})

// Instantiate our express-style middleware helper
const app = connect()

// Listen and respond to incoming JSON-RPC over HTTP requests
const server = new jayson.Server(handlers, {
  router: function(method) {
    try {
      logger.info(`Received ${method} request`)
      return this._methods[method]
    } catch (e) {
      return new jayson.Method((params, callback) => {
        callback(true, null)
      })
    }
  },
})

// Parse JSON requset body
app.use(jsonParser())

// Do preflight OPTIONS check before the jayson middleware
app.use(cors())

// Apply our order handlers
app.use(server.middleware())

export default app
