/**
 * This file demonstrates how you can use the ZEIT Now Server as a proxy layer that
 * sits between your pricing/hedging server and the end users who request quotes and orders.
 * This could be beneficial if you alrady have an isolated pricing server that generates your quotes and orders.
 * ZEIT takes care of the web layer so you don't have to worry about CORS and SSL,
 * and all quote/order requests will be forwarded to your remote server.
 */

import jayson from 'jayson' // JSON-RPC helper
import winston from 'winston' // logger
import connect from 'connect' // expressJS-like middleware helper
import cors from 'cors' // CORS middleware
import bodyParser from 'body-parser' // request body parsing middleware
import axios, { AxiosRequestConfig } from 'axios' // Promise based HTTP client for the browser and node.js

// Your remote pricing/hedging server
const PRICING_SERVER_URL = 'http://localhost:1337'

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

// you can also add some auth headers here if you want
// https://github.com/axios/axios#axios-api
function makeRequestConfig(params): AxiosRequestConfig {
  return {
    method: 'POST',
    url: PRICING_SERVER_URL,
    data: params,
  }
}

// Forward JSON-RPC requests to our pricing server
const handlers = {
  getSenderSideQuote: (params, callback) => {
    axios(makeRequestConfig(params))
      .then(response => {
        console.log('got a response from our server', response.data)
        // you could also check the response from your server here to make sure it's valid and not an error

        // we pass null as the first argument because there is no error
        // we pass the response as the second argument, which sends the quote/order back to the requester
        callback(null, response.data)
      })
      .catch(error => {
        console.log(error.message)
        // since we have an error, we pass the error to the requester with the _correct_ protocol-defined error code
        // https://docs.airswap.io/instant/run-makers#error-codes
        callback({ code: -32603, message: error.message })
      })
  },
  getSignerSideQuote: (params, callback) => {
    axios(makeRequestConfig(params))
      .then(response => {
        console.log('got a getSignerSideQuote pricing response', response.data)
        callback(null, response.data)
      })
      .catch(error => {
        console.log(error.message)
        callback({ code: -32603, message: error.message })
      })
  },
  getMaxQuote: (params, callback) => {
    axios(makeRequestConfig(params))
      .then(response => {
        console.log('got a getMaxQuote pricing response', response.data)
        callback(null, response.data)
      })
      .catch(error => {
        console.log(error.message)
        callback({ code: -32603, message: error.message })
      })
  },
  getSenderSideOrder: (params, callback) => {
    axios(makeRequestConfig(params))
      .then(response => {
        console.log('got a getSenderSideOrder pricing response', response.data)
        callback(null, response.data)
      })
      .catch(error => {
        console.log(error.message)
        callback({ code: -32603, message: error.message })
      })
  },
  getSignerSideOrder: (params, callback) => {
    axios(makeRequestConfig(params))
      .then(response => {
        console.log('got a getSignerSideOrder pricing response', response.data)
        callback(null, response.data)
      })
      .catch(error => {
        console.log(error.message)
        callback({ code: -32603, message: error.message })
      })
  },
  ping: (params, callback) => {
    callback(null, 'pong')
  },
}

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
