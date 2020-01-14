/**
 * This file demonstrates how you can use the ZEIT Now Server as a proxy layer that
 * sits between your pricing/hedging server and the end users who request quotes and orders.
 * This could be beneficial if you alrady have an isolated pricing server that generates your quotes and orders.
 * ZEIT takes care of the web layer so you don't have to worry about CORS and SSL,
 * and all quote/order requests will be forwarded to your remote server.
 */

import jayson from 'jayson' // JSON-RPC helper
import connect from 'connect' // expressJS-like middleware helper
import cors from 'cors' // CORS middleware
import bodyParser from 'body-parser' // request body parsing middleware
import axios from 'axios' // Promise based HTTP client for the browser and node.js

// Your remote pricing/hedging server
const PRICING_SERVER_URL = 'http://localhost:1337'

// Make sure environment variable is set
if (!process.env.ETHEREUM_ACCOUNT) {
  throw new Error('ETHEREUM_ACCOUNT must be set')
}

// Forward JSON-RPC requests to our pricing server
const server = new jayson.Server(
  {},
  {
    router(method) {
      return new jayson.Method((params, callback) => {
        axios({
          // you can also add some auth headers here if you want
          // https://github.com/axios/axios#axios-api
          method: 'POST',
          url: PRICING_SERVER_URL,
          data: {
            method,
            params,
          },
        })
          .then(response => {
            // you could also check the response from your server here to make sure it's valid and not an error
            // the way that you check for an error here will depend on your server's implemenetation.
            // if your server sends an error-level HTTP code such as 500, then the error handling block in line 48
            // will be invoked automatically.

            // however, if you send an OK HTTP response with an error object, you will need to handle that here with a conditional
            if ('error' in response.data) {
              console.log('Received an error response from the server', response.data)
              // example error handling (your implementation may vary):
              // callback({ code: response.data['error']['code'], message: response.data['error']['message'] })
              callback(response.data.error)
            } else {
              // we pass null as the first argument because there is no error
              // we pass the response as the second argument, which sends the quote/order back to the requester
              console.log('Received a resonse from the server', response.data)
              callback(null, response.data)
            }
          })
          .catch(error => {
            console.log(error.message)
            // since we have an error, we pass the error to the requester with the _correct_ protocol-defined error code
            // https://docs.airswap.io/instant/run-makers#error-codes

            // notice how we don't send the entire JSON-RPC error envelope here, e.g. { "jsonrpc": "2.0", "id": "123", "error": {}}
            // that's because the jayson library we are using on line 24 takes care of _all_ JSON-RPC details
            // we only need to send the error object, and jayson will take care of formatting it as a JSON-RPC message
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
