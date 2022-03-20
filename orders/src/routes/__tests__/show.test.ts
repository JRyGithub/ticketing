import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

it(`fetches the order`,async() => {
    const ticket = Ticket.build({
        title: `hi`,
        price: `10`,
        id: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save()
    const user = global.signIn()

    const {body: order} = await request(app)
        .post(`/api/orders`)
        .set(`Cookie`,user)
        .send({ticketId: ticket.id})
        .expect(201)

    const { body: fetchOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set(`Cookie`,user)
        .send()
        .expect(200)
    
    expect(fetchOrder.id).toEqual(order.id)
})
it(`returns a error if tries to get another users order`,async() => {
    const ticket = Ticket.build({
        title: `hi`,
        price: `10`,
        id: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save()
    const user = global.signIn()

    const {body: order} = await request(app)
        .post(`/api/orders`)
        .set(`Cookie`,user)
        .send({ticketId: ticket.id})
        .expect(201)

    
    const { body: fetchOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set(`Cookie`,global.signIn())
        .send()
        .expect(401)
    
})