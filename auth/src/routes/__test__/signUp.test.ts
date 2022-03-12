import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on successful sign up', async () => {
    return request(app)
        .post(`/api/users/signUp`)
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201)
})
it('returns a 400 with invalid email', async () => {
    return request(app)
        .post(`/api/users/signUp`)
        .send({
            email: "testtest.com",
            password: "password"
        })
        .expect(400)
})
it('returns a 400 with invalid password', async () => {
    return request(app)
        .post(`/api/users/signUp`)
        .send({
            email: "test@test.com",
            password: "123"
        })
        .expect(400)
})
it('returns a 400 with invalid password and email', async () => {
    await request(app)
        .post(`/api/users/signUp`)
        .send({
            password: `12345`
        })
        .expect(400)
    await request(app)
        .post(`/api/users/signUp`)
        .send({
            email: `test@test.com`
        })
        .expect(400)
})

it(`disallows duplicate email`,async() => {
    await request(app)
        .post(`/api/users/signUp`)
        .send({
            email: 'test@test.com',
            password: `hello`})
        .expect(201)
    await request(app)
        .post(`/api/users/signUp`)
        .send({
            email: 'test@test.com',
            password: `hello`})
        .expect(400)
})
it(`Sets a cookie after successful signup`,async()=> {
     const response = await request(app)
        .post(`/api/users/signUp`)
        .send({
            email: 'test@test.com',
            password: `hello`})
        .expect(201)
    expect(response.get(`Set-Cookie`))
})
