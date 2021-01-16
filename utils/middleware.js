const logger = require('./logger')


// A function to get the authentication token sent by the front end. Isolates the token from the authorization header
const getTokenFrom = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        // As we are extracting the token through middleware, instead of returing the value, we add a token property to the request to be passed on to the route handlers.
        request.token = authorization.substring(7)
    }

    next()
}


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {

    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({
            error: error.message
        })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    }

    logger.error(error.message)

    next(error)
}

module.exports = {
    getTokenFrom,
    unknownEndpoint,
    errorHandler    
}