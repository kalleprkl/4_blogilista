const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

    const blog = new Blog(request.body)

    const savedBlog = await blog.save()

    response.status(201).json(savedBlog)

    /*blog
        .save()
        .then(result => {
            response.status(200).json(result)
        })*/
})

module.exports = blogsRouter