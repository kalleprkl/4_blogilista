const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    try {
        
        const body = request.body
        //console.log(body)
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.passwordHash, saltRounds)

        const user = new User({
            username: body.username,
            passwordHash,
            name: body.name,
            legal: body.legal
        })

        const savedUser =  await user.save()

        response.status(201).json(savedUser)

    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'it\'s all gone to hell' })
    }
})

module.exports = usersRouter