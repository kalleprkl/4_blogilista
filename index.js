const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

mongoose
    .connect(config.mongoUrl)
    .then(() => {
        console.log('connected to database', config.mongoUrl)
    })
    .catch(err => {
        console.log(err)
    })

mongoose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

const server = http.createServer(app)

server.listen(config.port, () => {
    console.log('server running on port ' +  config.port)
})

server.on('close', () => {
    //console.log('SULKEIIIIIIIIIIIIIIII')
    mongoose.connection.close()
})

module.exports = { app, server }

