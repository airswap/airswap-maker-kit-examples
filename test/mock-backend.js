/* eslint-disable */
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 1337

app.use(bodyParser.json())

app.post('/', (req, res) => {
  // here you will have access to all of the request data from the ZEIT server
  // you just have to compute your price or your pricing error, and then send it back as the response
  const { method, params } = req.body
  console.log(`RPC Method: ${method}`)
  console.log(`Parameters: ${params}`)

  // make sure to implement all protocol defined JSON-RPC methods
  // https://docs.airswap.io/instant/run-makers#maker-api
  switch (method) {
    case 'ping':
      res.send('pong')
      break
    default:
      res.send('Hello World!')
      break
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
