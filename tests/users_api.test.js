const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { addUser, resetUsersDb, testData, usersInDb, testDataUsers } = require('./test_helper')
const User = require('../models/user')

beforeAll(async () => {
    //await resetUsersDb()
    await User.remove({})
    const userObjects = testDataUsers.map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
})

describe('getAll', async () => {
    test('all users in db are returned', async () => {
        const users = await usersInDb()

        const usersHttp = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(usersHttp.body.length).toBe(users.length)
    })
})

describe('post', async () => {
    test('valid user can be added', async () => {
        const newUser = {
            username: 'snippe',
            passwordHash: 'swopards',
            name: 'Matlock',
            legal: false
        }

        const usersBefore = await usersInDb()
        
        await api.post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await usersInDb()

        const usernames = usersAfter.map(r => r.username)
        //console.log(usersAfter)
        expect(usersAfter.length).toBe(usersBefore.length + 1)
        expect(usernames).toContain("snippe")
    })

    test('user with invalid password cannot be added', async () => {
        const invalidUser = {
            username: 'slalom',
            passwordHash: 'ts',
            name: 'Columbo',
            legal: false
        }

        const usersBefore = await usersInDb()

        const response = await api.post('/api/users')
            .send(invalidUser)
            .expect(400)

        const usersAfter = await usersInDb()
        
        expect(usersAfter.length).toBe(usersBefore.length)
        expect(usersAfter.find(u => u.username === "slalom")).toBe(undefined)
        expect(response.error.text).toBe(JSON.stringify('password needs to be atleast 3 characters'))
    })

    test('username has to be unique', async () => {
        const invalidUser = {
            username: 'Kepe',
            passwordHash: 'gut',
            name: 'Robocop',
            legal: false
        }

        const usersBefore = await usersInDb()

        const response = await api.post('/api/users')
            .send(invalidUser)
            .expect(400)

        const usersAfter = await usersInDb()
        
        expect(usersAfter.length).toBe(usersBefore.length)
        expect(usersAfter.find(u => u.name === "Robocop")).toBe(undefined)
        expect(response.error.text).toBe(JSON.stringify('username already in use'))
    })

    test('legal set to true by default', async () => {
        const ambiguousUser = {
            username: 'Raipe',
            passwordHash: 'gunk',
            name: 'Marmelade',
        }

        const usersBefore = await usersInDb()

        const response = await api.post('/api/users')
            .send(ambiguousUser)
            .expect(201)

        const usersAfter = await usersInDb()
        
        expect(usersAfter.length).toBe(usersBefore.length + 1)
        expect(usersAfter.find(u => u.username === "Raipe").legal).toBe(true)
    })
})

afterAll(() => {
    //console.log('USERS')
    server.close()
})