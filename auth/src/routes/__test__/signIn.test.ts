import request from 'supertest'
import { app } from '../../app'

it('fails when a email that does not exist is supplied', async () => {
    await request(app)
        .post(`/api/users/signIn`)
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(400)
})
it('fails when a incorrect password is supplied', async () => {
    await request(app)
        .post(`/api/users/signUp`)
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201)
    await request(app)
        .post(`/api/users/signIn`)
        .send({
            email: "test@test.com",
            password: "blah123"
        })
        .expect(400)
})

it('success when a correct email and password is supplied', async () => {
    await request(app)
        .post(`/api/users/signUp`)
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201)
    const response = await request(app)
        .post(`/api/users/signIn`)
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(200)
    
    expect(response.get("Set-Cookie"))
})