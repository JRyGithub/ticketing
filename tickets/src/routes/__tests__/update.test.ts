import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'


it(`returns 404 if ticket does not exist`,async() => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set(`Cookie`,global.signIn())
        .send({
            title: `hi`,
            price: 120
        })
        .expect(404)
})

it(`returns 401 if user not auth`,async() => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: `hi`,
            price: 120
        })
        .expect(401)
})

it(`returns 401 if use does not own ticket`,async() => {
    const response = await request(app)
        .post(`/api/tickets`)
        .set(`Cookie`, global.signIn())
        .send({
            title: `MakeBelieve`,
            price: 100
        })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set(`Cookie`,global.signIn())
        .send({
            title: `NewString`,
            price: 2
        })
        .expect(401)
})

it(`returns 400 if invalid title etc`,async() => {
    const cookie = global.signIn()
    const response = await request(app)
        .post(`/api/tickets`)
        .set(`Cookie`, cookie)
        .send({
            title: `MakeBelieve`,
            price: 100
        })
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set(`Cookie`,cookie)
        .send({
            title: ``,
            price: 23
        })
        .expect(400)
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set(`Cookie`,cookie)
        .send({
            title: `fsdfsdf`,
            price: 0
        })
        .expect(400)
})

it(`it updates ticket provided valid inputs`,async() => {
    const cookie = global.signIn()
    const response = await request(app)
        .post(`/api/tickets`)
        .set(`Cookie`, cookie)
        .send({
            title: `MakeBelieve`,
            price: `100`
        })
   await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set(`Cookie`,cookie)
        .send({
            title: `newTitle`,
            price: `23`
        })
        .expect(200)
    
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()

    expect(ticketResponse.body.title).toEqual(`newTitle`)
    expect(ticketResponse.body.price).toEqual(`23`)
    
})