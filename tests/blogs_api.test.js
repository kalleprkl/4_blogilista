const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { addBlog, resetBlogsDb, testData, blogsInDb, testDataBlogs } = require('./test_helper')
const Blog = require('../models/blog')

beforeAll(async () => {
    //await resetBlogsDb()
    await Blog.remove({})
    const blogObjects = testDataBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('getAll', async () => {
    test('all blogs are retrieved from database', async () => {

        const blogs = await blogsInDb()

        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(blogs.length)
    })
})

describe('post', async () => {

    test('new blog is added', async () => {
        const newBlog = {
            title: "Mispronounciation",
            author: "Throatwobler Mangrove",
            url: 'http://nonsense',
            likes: 3
        }

        const blogsBefore = await blogsInDb()

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await blogsInDb()

        const authors = blogsAfter.map(r => r.author)

        expect(blogsAfter.length).toBe(blogsBefore.length + 1)
        expect(authors).toContain("Throatwobler Mangrove")
    })

    test('likes set to 0 if not defined', async () => {

        const newBlog = {
            title: "Mispronounciation",
            author: "Luxury Yacht",
            url: 'http://nonsense',
        }

        const blogsBefore = await blogsInDb()

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await blogsInDb()

        expect(blogsAfter.length).toBe(blogsBefore.length + 1)

        const savedBlog = blogsAfter.find(b => b.author === 'Luxury Yacht')

        expect(savedBlog.likes).toBe(0)
    })

    test('if title not defined, return 400 Bad request', async () => {
        const newBlog = {
            author: "Timothy Titlesarehard",
            url: 'http://disndat',
        }

        const blogsBefore = await blogsInDb()

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await blogsInDb()

        expect(blogsAfter.length).toBe(blogsBefore.length)

        expect(blogsAfter.find(b => b.author === 'Timothy Titlesarehard')).toBe(undefined)

        expect(response.error.text).toBe(JSON.stringify('Bad request'))
    })

    test('if url not defined, return 400 Bad request', async () => {
        const newBlog = {
            title: "What's an url?",
            author: "Big Dummy",
        }

        const blogsBefore = await blogsInDb()

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await blogsInDb()

        expect(blogsAfter.length).toBe(blogsBefore.length)

        expect(blogsAfter.find(b => b.author === 'Bid Dummy')).toBe(undefined)

        expect(response.error.text).toBe(JSON.stringify('Bad request'))
    })
})

describe('delete', async () => {

    test('blog is deleted', async () => {

        await addBlog({
            title: 'Doomed',
            author: 'Poor Fella',
            url: 'http://itsanurlallright',
            likes: -2
        })

        const blogsBefore = await blogsInDb()

        const toBeRemoved = blogsBefore.find(b => b.title === 'Doomed')

        await api
            .delete('/api/blogs/' + toBeRemoved._id)
            .expect(204)

        const blogsAfter = await blogsInDb()

        expect(blogsAfter.length).toBe(blogsBefore.length - 1)
        expect(blogsAfter.find(b => b.title === 'Doomed')).toBe(undefined)
    })
})

describe('put', async () => {

    test('likes can be updated', async () => {

        await addBlog({
            title: 'Like me, I like me',
            author: 'Me',
            url: 'http://whatadrag',
            likes: 2
        })

        const blogsBefore = await blogsInDb()

        const blogToBeUpdated = blogsBefore.find(b => b.author === 'Me')

        expect(blogToBeUpdated.likes).toBe(2)

        await api
            .put('/api/blogs/' + blogToBeUpdated._id)
            .send({ likes: 3 })
            .expect(200)

        const blogsAfter = await blogsInDb()

        const updatedBlog = blogsAfter.find(b => b.author === 'Me')

        expect(updatedBlog.likes).toBe(3)
    })
})

afterAll(() => {
    //console.log('BLOGS')
    server.close()
})