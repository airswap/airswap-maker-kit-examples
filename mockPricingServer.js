/* eslint-disable */
const express = require('express')

const app = express()
const port = 1337

app.post('/', (req, res) => {
  // here you will have access to all of the request data from the ZEIT server
  // you just have to compute your price or your pricing error, and then send it back as the response
  res.send('Hello World!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
