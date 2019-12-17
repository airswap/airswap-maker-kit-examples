import jayson from 'jayson' // JSON-RPC helper
import winston from 'winston' // logger
import connect from 'connect' // expressJS-like middleware helper
import cors from 'cors' // CORS middleware
import bodyParser from 'body-parser' // request body parsing middleware
import initHandlers from '../handlers' // airswap maker logic reference implementation

// Make sure environment variable is set
if (!process.env.ETHEREUM_ACCOUNT) {
  throw new Error('ETHEREUM_ACCOUNT must be set')
}

// Setup logger
const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
  format: winston.format.printf(({ level, message }) => {
    return `${level}: ${message}`
  }),
})

// Initialize pricing handlers with our private key
const handlers = initHandlers(process.env.ETHEREUM_ACCOUNT)

// Listen and respond to incoming JSON-RPC over HTTP requests
const server = new jayson.Server(handlers, {
  router(method) {
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

// Instantiate our express-style middleware helper
const app = connect()

// Parse JSON request body
app.use(bodyParser.json())

// Do preflight OPTIONS check before the jayson middleware
app.use(cors())

// Apply our order handlers
app.use(server.middleware())

export default app
