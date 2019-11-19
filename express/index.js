const server = require('./server.js')
const dotenv = require('dotenv')

// Load the .env file
dotenv.config()

server.start(process.env.BIND_PORT, process.env.BIND_ADDRESS)
