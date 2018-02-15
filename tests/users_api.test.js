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

describe('post', async () => {
    test('user can be added', async () => {
        const newUser = {
            username: 'snippe',
            passwordHash: 'swopards',
            name: 'Columbo',
            legal: false
        }

        const usersBefore = await usersInDb()
        
        api.post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await usersInDb()

        const names = usersAfter.map(r => r.name)
        //console.log(usersAfter)
        expect(usersAfter.length).toBe(usersBefore.length + 1)
        expect(names).toContain("Columbo")
    })
})

afterAll(() => {
    //console.log('USERS')
    server.close()
})