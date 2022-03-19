import mongoose from "mongoose"
import { app } from "../../app"
import request from "supertest";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@ryweb.solutions/common";
import { natsWrapper } from "../../natsWrapper";

it(`returns an error if ticket does not exits`,async() =>{
    const ticketId = new mongoose.Types.ObjectId()

    await request(app)
        .post(`/api.order`)
        .set(`Cookie`,global.signIn())
        .send({ticketId})
        .expect(404)
})
it(`returns an error if ticket is reserved`,async() =>{
    const ticket = Ticket.build({
        title: `concert`,
        price: 20
    })
    await ticket.save()
    const order = Order.build({
        ticket,
        userId: `whatever`,
        status: OrderStatus.Created,
        expiresAt: new Date()
    })
    await order.save()

    await request(app)
        .post(`/api/orders`)
        .set(`Cookie`,global.signIn())
        .send({ticketId: ticket.id})
        .expect(400)

})
it(`reserves a ticket`,async() =>{
    const ticket = Ticket.build({
        title: `concert`,
        price: 20
    })
    await ticket.save()

    await request(app)
        .post(`/api/orders`)
        .set(`Cookie`,global.signIn())
        .send({ticketId: ticket.id})
        .expect(201)
})


it(`emits a order created event`,async() => {
    const ticket = Ticket.build({
        title: `concert`,
        price: 20
    })
    await ticket.save()

    await request(app)
        .post(`/api/orders`)
        .set(`Cookie`,global.signIn())
        .send({ticketId: ticket.id})
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})