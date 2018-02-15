const mongoose = require('mongoose')

const User = mongoose.model('User', {
    username: String,
    passwordHash: String,
    name: String,
    legal: Boolean
})

module.exports = User