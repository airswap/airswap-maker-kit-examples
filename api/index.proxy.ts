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
import { keccak256 } from 'ethers/utils'

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
  console.log('params', params)
  return {
    method: 'POST',
    url: PRICING_SERVER_URL,
    data: params,
  }
}

// Forward JSON-RPC requests to our pricing server
const server = new jayson.Server(
  {},
  {
    router(method) {
      return new jayson.Method((params, callback) => {
        axios({
          method: 'POST',
          url: PRICING_SERVER_URL,
          data: {
            method,
            params,
          },
        })
          .then(response => {
            // you could also check the response from your server here to make sure it's valid and not an error
            console.log('got a response from our server', response.data)
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
      })
    },
  },
)

// Instantiate our express-style middleware helper
const app = connect()

// Parse JSON request body
app.use(bodyParser.json())

// Do preflight OPTIONS check before the jayson middleware
app.use(cors())

// Apply our order handlers
app.use(server.middleware())

export default app
