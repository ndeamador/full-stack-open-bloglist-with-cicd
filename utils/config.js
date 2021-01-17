require('dotenv').config()

const PORT = process.env.PORT
// because we change this address depending on the execution mode, we have to use let instead of const.
let MONGODB_URI = process.env.MONGODB_URI

const SECRET = process.env.SECRET

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  PORT,
  MONGODB_URI,
  SECRET
}