/*
 * A simple maker for the AirSwap Network
 * Warning: For demonstration purposes only, use at your own risk
 */

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jayson = require('jayson')
const winston = require('winston')

const dotenv = require('dotenv')
dotenv.config()

const initHandlers = require('@airswap/maker-kit')
const handlers = initHandlers(process.env.ETHEREUM_ACCOUNT)

let listener

module.exports = {
  start: (_port, _address, _logLevel) => {
    // Express instance
    const server = express()

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
      level: _logLevel || 'info',
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
    listener = server.listen(_port, _address, () => {
      logger.info(`Server now listening on ${_address}:${_port}`)
    })
  },
  stop: callback => {
    listener.close(callback)
  },
}
