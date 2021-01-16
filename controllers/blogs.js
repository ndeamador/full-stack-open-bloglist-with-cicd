// using  the .Router() middleware/object instead of the usual app (express()) is done to extract routes to a separate module.
// while express() handles everything (html, css, database comms), .Router only handles middleware and routing.
// it seems to be used mainly to separate routes into a dedicated module (for 'related' routes).
// http://expressjs.com/en/api.html#router
const blogsRouter = require('express').Router()

const config = require('../utils/config')
const jwt = require('jsonwebtoken')

// establishing connection to the database has been done in app.js, so the blog model only defines the schema for blogs
const Blog = require('../models/blog')
const User = require('../models/user')




// These are relative paths, since in app js the router has been linked to the address api/blogs  (so route /:id goes to api/blogs/:id)
blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
    const body = request.body

    // Making sure that only logged in users can create new notes
    const token = request.token

    // jwt very checks if the token is valid and decodes the token (or returns the initial object the token was based on)
    // The decoded object contains the fields username and id
    const decodedToken = jwt.verify(token, config.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        likes: body.likes,
        title: body.title,
        author: body.author,
        url: body.url,
        user: user._id
    })

    if (!blog.title && !blog.url) {
        return response.status(400).json({ error: 'Blog requires title or url' })
    }

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })

    response.status(200).json(populatedBlog)
    // response.status(200).json(savedBlog)

})


blogsRouter.get('/:id', async (request, response) => {

    // There seems to be a problem with Mongo returning error 500 if an invalid id is provided and stopping the execution.
    // It seems to be a common problem with Mongo, so I will handle the invalid id beforehand
    // https://github.com/strapi/strapi/issues/5930
    // https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id

    // If ID is not valid in Mongo:
    // if (!request.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    //     return response.status(400).end()
    // }

    // edit: commented out because it can also be bypassed by using the error handling middleware.



    // If Id is valid:
    const blog = await Blog.findById(request.params.id)

    if (blog) {
        response.json(blog)
    } else {
        // the .end() method ends responses that send back no content.
        response.status(404).end()
    }
})


blogsRouter.put('/:id', async (request, response) => {

    // If ID is not valid in Mongo:
    /*     if (!request.params.id.match(/^[0-9a-fA-F]{24}$/)) {

            return response.status(400).json({ error: 'Invalid ID' })
        } */

    // If ID is valid
    const blog = request.body

    if (!blog.title && !blog.url) {

        return response.status(400).json({ error: 'Blog requires title or url' })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', { username: 1, name: 1 })

    if (updatedBlog) {
        response.json(updatedBlog)
    } else {
        response.status(404).json({ error: 'Blog not found in database' })
    }
})


blogsRouter.delete('/:id', async (request, response) => {

    const blog = await Blog.findOne({ _id: request.params.id })

    // Making sure that only the creator of the blog can delete it:
    const token = request.token

    const decodedToken = jwt.verify(token, config.SECRET)

    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    // the ids are objects (reference types) and can't be compared with the === operator, so we stringify them for convenience:
    if (blog.user.toString() !== user._id.toString()) {
        return response.status(401).json({ error: 'only the author of the blog can delete it' })
    }

    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()
})

module.exports = blogsRouter