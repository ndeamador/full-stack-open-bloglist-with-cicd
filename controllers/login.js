const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
    const body = request.body

    // if the user is not found, we get a 401 unauthorized state.
    const user = await User.findOne({ username: body.username })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    // token created and signed. The token contains the user id and username, digitally signed.
    // the document is signed using the secret taking from our environmental variables.
    // through the signature, only parties who know the secret can create a valid token.
    const token = jwt.sign(userForToken, config.SECRET)

    response
        .status(200)
        // Added user id for convenience in the frontend
        .send({ token, username: user.username, name: user.name, id: user._id })
})

module.exports = loginRouter