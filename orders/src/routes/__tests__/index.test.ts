import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'


const createTicket = async() => {
    const ticket = Ticket.build({
        title: `convert`,
        price: `20`,
        id: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save()

    return ticket
}

it(`fetches orders for a user`,async() => {
    const ticketOne = await createTicket()
    const ticketTwo = await createTicket()
    const ticketThree = await createTicket()

    const userOne = global.signIn()
    const userTwo = global.signIn()

    await request(app)
        .post(`/api/orders`)
        .set(`Cookie`,userOne)
        .send({ticketId: ticketOne.id})
        .expect(201)
    const { body: orderOne } = await request(app)
        .post(`/api/orders`)
        .set(`Cookie`,userTwo)
        .send({ticketId: ticketTwo.id})
        .expect(201)
    const { body: orderTwo } = await request(app)
        .post(`/api/orders`)
        .set(`Cookie`,userTwo)
        .send({ticketId: ticketThree.id})
        .expect(201) 

    const res = await request(app)
        .get(`/api/orders`)
        .set(`Cookie`,userTwo)
        .expect(200)

    expect(res.body.length).toEqual(2)
    expect(res.body[0].id).toEqual(orderOne.id)
    expect(res.body[1].id).toEqual(orderTwo.id)
    
})