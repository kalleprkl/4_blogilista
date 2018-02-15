const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.status(200).json(users)
})

usersRouter.post('/', async (request, response) => {
    try {
        
        const body = request.body
        
        if (body.passwordHash.length < 3) {
            return response.status(400).json('password needs to be atleast 3 characters')
        }

        const usernameTaken = await User.find({ username: body.username }) 
        
        if (usernameTaken.length > 0) {
            return response.status(400).json('username already in use')
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.passwordHash, saltRounds)

        const user = new User({
            username: body.username,
            passwordHash,
            name: body.name,
            legal: body.legal || true
        })

        const savedUser =  await user.save()

        response.status(201).json(savedUser)

    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'it\'s all gone to hell' })
    }
})

module.exports = usersRouter