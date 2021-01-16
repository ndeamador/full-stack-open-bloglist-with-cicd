// ¿Config imported first to make sure dotenv is imported as early as possible?
const config = require('./utils/config')
const express = require('express')
// express-async-errors handles async errors on its own, so we don't need try-catch blocks or the next function.
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')


const mongoUrl = config.MONGODB_URI

logger.info('Connecting to MongoDB')

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        logger.info('Connected to MonboDB')
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB:', error.message)
    })


app.use(cors())
// The json-parser middleware should be among the very first middleware loaded into Express
app.use(express.json())

// This middleware takes the token from the Authorization header of the request and creates a new request.token field with it.
// We place the middleware before the route handlers so that they have access to the token through request.token.
app.use(middleware.getTokenFrom)

// frontend middleware for part 11
app.use(express.static('build'))

// since the express.Router() object in blogsRouter.js is a middleware, we use it with app.use:
// the first parameter indicates the root of the used route (the routes in blogsRouter.js are relative to this one)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    console.log(`NODE_ENV set to 'test'`);
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)



module.exports = app