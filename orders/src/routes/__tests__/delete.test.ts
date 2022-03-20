import { OrderStatus } from '@ryweb.solutions/common'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../natsWrapper'
import mongoose from 'mongoose'

it(`marks an order as cancelled`,async() => {
    const ticket = Ticket.build({
        title: `hello`,
        price: `10`,
        id: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save()
    const user = global.signIn()

    const { body: order } = await request(app)
        .post(`/api/orders`)
        .set(`Cookie`,user)
        .send({ticketId: ticket.id})
        .expect(201)

    const response = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set(`Cookie`,user)
        .send()
        .expect(204)
    
    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

})

it(`emits a order cancelled event`,async() => {
    const ticket = Ticket.build({
        title: `hello`,
        price: `10`,
        id: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save()
    const user = global.signIn()

    const { body: order } = await request(app)
        .post(`/api/orders`)
        .set(`Cookie`,user)
        .send({ticketId: ticket.id})
        .expect(201)

    const response = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set(`Cookie`,user)
        .send()
        .expect(204)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})