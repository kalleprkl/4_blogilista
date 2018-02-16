const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user')
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

    const body = request.body
    
    try {
        const token = request.token
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        if (body.title === undefined || body.url === undefined) {
            return response.status(400).json('Bad request')
        }

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes === undefined ? 0 : body.likes,
            user: decodedToken.id
        })

        const savedBlog = await blog.save()

        response.status(201).json(savedBlog)
    } catch (exception) {
        if (exception.name === 'JsonWebTokenError') {
            response.status(401).json({ error: exception.message })
        } else {
            console.log(exception)
            response.status(500).json({ error: 'something went wrong...' })
        }
    }

})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).json('Removed from database')
})

blogsRouter.put('/:id', async (request, response) => {
    await Blog.findByIdAndUpdate(request.params.id, request.body)
    response.status(200).json('Updated')
})

module.exports = blogsRouter