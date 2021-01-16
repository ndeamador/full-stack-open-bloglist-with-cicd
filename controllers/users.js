// Bcrypt for hashing passwords
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    // Mongoose's populate method will include full blogs (and not just blog ids) when retreiving each user.
    // the arguments are the fields we want to include in each referenced blog: 
    // https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/#return-the-specified-fields-and-the-id-field-only
    const users = await User
        .find({}).populate('blogs', { title: 1, author: 1, url: 1 })
    response.json(users)
})


usersRouter.post('/', async (request, response) => {
    const body = request.body

    // It's not a good idea to test password restrictions with just Mongoose restrictions, so we validate them first in the controller
    // This due to the received (uncrypted) password not being the same as the stored hash.
    if (!body.password || body.password.length < 3) {
        return response.status(401).json({ error: 'A password of at least 3 characters is required' })
    }


    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })
    const savedUser = await user.save()

    const populatedUser = await User.findById(savedUser._id).populate('blogs', { title: 1, author: 1, url: 1 })

    response.json(populatedUser)
    // response.json(savedUser)

})

usersRouter.get('/:id', async (request, response) => {

    // If Id is valid:
    const user = await User.findById(request.params.id)

    if (user) {
        response.json(user)
    } else {
        // the .end() method ends responses that send back no content.
        response.status(404).end()
    }
})


usersRouter.delete('/:id', async (request, response) => {

    console.log(request.params.id);
    const user = await User.findById(request.params.id)
    console.log(user);
    const test = await User.findByIdAndRemove(request.params.id)
    console.log(test);
    response.status(204).end()
})


module.exports = usersRouter