const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

    const body = request.body

    if (body.title === undefined || body.url === undefined) {
        return response.status(400).json('Bad request')
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes
    })

    const savedBlog = await blog.save()

    response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response) => {
    console.log(request.params.id)
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).json('Removed from database')
})

module.exports = blogsRouter