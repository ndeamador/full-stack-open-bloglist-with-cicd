const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
    {
        title: 'Creating Adam',
        author: 'test',
        url: 'test.t',
        likes: 1
    },
    {
        title: 'Creating Eve',
        author: 'test',
        url: 'test.t',
        likes: 2
    }
]

const initialUsers = [
    {
        username: 'KaroloV',
        name: 'Charles Habsburg',
        password: 'Pavia'
    },
    {
        username: 'FranFran',
        name: 'Francis Valois',
        password: 'lovingMadrid'
    }
]


const genericNewBlog = {
    title: 'newcomer',
    author: 'test',
    url: 'test.t',
    likes: 3
}

const noLikesBlog = {
    title: 'noLikesBlog',
    author: 'test',
    url: 'test.t'
}

const noTitleBlog = {
    author: 'he who writes no title',
    url: 'test.t'
}

const noUrlBlog = {
    author: 'he who writes no url',
    title: 'test'
}

const onlyAuthorBlog = {
    author: 'he who writes nothing',
}

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon' })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}


const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

// Users:

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const userShortPassword = {
    username: 'username',
    name: 'user with short pw',
    password: 'pw'
}

const userShortUsername = {
    username: 'un',
    name: 'user with short username',
    password: 'password'
}

const userNoUsername = {
    name: 'user with no username',
    password: 'password'
}

const userNullUsername = {
    username: '',
    name: 'user with no username',
    password: 'password'
}

const userNoPassword = {
    username: 'username',
    name: 'user with no username'
}

const userNullPassword = {
    username: 'username',
    name: 'user with no username',
    password: ''
}








module.exports = {
    initialBlogs,
    genericNewBlog,
    noLikesBlog,
    noTitleBlog,
    noUrlBlog,
    onlyAuthorBlog,
    blogsInDb,
    nonExistingId,
    usersInDb,
    userShortPassword,
    userShortUsername,
    userNoUsername,
    userNullUsername,
    userNoPassword,
    userNullPassword,
    initialUsers
}