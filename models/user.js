const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 3
    },
    name: String,
    passwordHash: String,
    // the blog ids are stored as an array of Mongo ids:
    blogs: [
        {
            // the reference is just syntax, Mongo does not know what we are referencing.
            // As we are storing the blog's ids, the type is objectId (ids are not strings).
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash
    }
})

userSchema.plugin(uniqueValidator)


const User = mongoose.model('User', userSchema)

module.exports = User