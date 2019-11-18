/*
 * A simple maker for the AirSwap Network
 * Warning: For demonstration purposes only, use at your own risk
 */

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jayson = require('jayson')

const winston = require('winston')
// TOOD: REPLACE THIS WITH NPM PUBLISHED PACKAGE
const handlers = require('../zeit/airswap-maker-kit/handlers')

// Express instance
const server = express()
const port = 8080

// CORS for connections from web browsers
server.use(
  cors({
    origin: '*',
    methods: 'POST',
  }),
)

// POST body parsing for JSON-RPC
server.use(bodyParser.json())

// Setup logger
const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
  format: winston.format.printf(({ level, message }) => {
    return `${level}: ${message}`
  }),
})

// POST request handler
server.post(
  '/',
  jayson
    .server(handlers, {
      // Ensures we're serving requested token pairs and catches other errors
      router(method) {
        try {
          logger.info(`Received ${method} request`)
          if (typeof this._methods[method] === 'object') return this._methods[method]
        } catch (e) {
          return new jayson.Method(function(params, callback) {
            callback(true, null)
          })
        }
      },
    })
    .middleware(),
)

// Start the listener
const listener = server.listen(port, () => {
  logger.info(`Server now listening on port ${port}`)
})

function stopServer(callback) {
  listener.close(callback)
}
