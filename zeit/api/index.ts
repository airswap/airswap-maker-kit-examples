import dotenv from 'dotenv'
import jayson from 'jayson'
import winston from 'winston'
import handlers from '../airswap-maker-kit/handlers'

// Load the .env file
dotenv.config()

if (!process.env.ETHEREUM_ACCOUNT) {
  throw new Error('ETHEREUM_ACCOUNT must be set in your .env file')
}

if (!process.env.ETHEREUM_NODE) {
  throw new Error('ETHEREUM_NODE must be set in your .env file')
}

// Setup logger
const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
  format: winston.format.printf(({ level, message }) => {
    return `${level}: ${message}`
  }),
})

export default new jayson.Server(handlers, {
  // Ensures we're serving requested token pairs and catches other errors
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
