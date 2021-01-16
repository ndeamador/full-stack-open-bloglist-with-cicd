require('dotenv').config()

const PORT = process.env.PORT
// because we change this address depending on the execution mode, we have to use let instead of const.
let MONGODB_URI = process.env.MONGODB_URI

const SECRET = process.env.SECRET

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

// console.log('CONFIG: ====================================');
// console.log('process.env.TEST: ', process.env.TEST);
// console.log(`node_env: ${process.env.NODE_ENV}`);
// console.log(`config.js mongo princeps: `, MONGODB_URI ? MONGODB_URI.substring(50,70) : MONGODB_URI);
// console.log('============================================');


module.exports = {
  PORT,
  MONGODB_URI,
  SECRET
}