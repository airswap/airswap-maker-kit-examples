import dotenv from 'dotenv' // loads env variables
import jayson from 'jayson' // JSON-RPC helper
import winston from 'winston' // logger
import initHandlers from '@airswap/maker-kit'

// Load the .env file
dotenv.config()

// Make sure enviornment variables are ready
if (!process.env.ETHEREUM_ACCOUNT) {
  throw new Error('ETHEREUM_ACCOUNT must be set in your .env file')
}

if (!process.env.ETHEREUM_NODE) {
  throw new Error('ETHEREUM_NODE must be set in your .env file')
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

// Listen and respond to incoming JSON-RPC over HTTP requests
export default new jayson.Server(handlers, {
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
}).middleware()
